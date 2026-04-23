const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const { prisma } = require("../lib/prisma");
const generateToken = require("../utils/generateToken");

const googleClient = new OAuth2Client();

const getAllowedGoogleClientIds = () => {
  const rawValues = [process.env.GOOGLE_CLIENT_IDS, process.env.GOOGLE_CLIENT_ID]
    .filter(Boolean)
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);

  return [...new Set(rawValues)];
};

const maskGoogleClientId = (clientId) => {
  if (!clientId) {
    return "missing";
  }

  const suffix = ".apps.googleusercontent.com";
  const normalized = clientId.trim();

  if (!normalized.endsWith(suffix)) {
    return `${normalized.slice(0, 8)}...${normalized.slice(-4)}`;
  }

  const prefix = normalized.slice(0, -suffix.length);
  return `${prefix.slice(0, 8)}...${prefix.slice(-4)}${suffix}`;
};

const getReceivedGoogleAudiences = (payload) => {
  if (!payload) {
    return [];
  }

  const values = [payload.aud, payload.azp].flatMap((value) =>
    Array.isArray(value) ? value : [value],
  );

  return [...new Set(values.filter(Boolean).map((value) => value.trim()))];
};

const getFrontendUrl = () =>
  process.env.FRONTEND_URL || "http://localhost:5173";

const generateResetCode = () =>
  crypto.randomInt(0, 1000000).toString().padStart(6, "0");

const sendResetPasswordEmail = async (user, resetLink) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  if (!emailUser || !emailPass) {
    console.error(
      "EMAIL_USER or EMAIL_PASS missing in environment, unable to send reset email",
    );
    return false;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  const mailOptions = {
    from: `"AIFUS 2026" <${emailUser}>`,
    to: user.email,
    subject: "Réinitialisation de votre mot de passe AIFUS",
    html: `
      <div style="font-family:Arial,sans-serif;color:#111;line-height:1.5;">
        <h2>Réinitialisation de votre mot de passe</h2>
        <p>Bonjour ${user.prenom},</p>
        <p>Nous avons reçu une demande de réinitialisation du mot de passe pour votre compte.</p>
        <p>Cliquez sur le lien ci-dessous pour choisir un nouveau mot de passe :</p>
        <p><a href="${resetLink}" style="color:#1d4ed8;">Réinitialiser mon mot de passe</a></p>
        <p>Ce lien expire dans 1 heure.</p>
        <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer ce message.</p>
      </div>
    `,
  };

try {
    await transporter.sendMail(mailOptions);
    console.log("Email de réinitialisation envoyé à", user.email);
    return true;
  } catch (error) {
    console.error("Erreur envoi email de réinitialisation:", error.message);
    return false;
  }
};

const sendResetCodeEmail = async (user, resetCode) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    console.error("EMAIL_USER or EMAIL_PASS missing in environment");
    return false;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  const mailOptions = {
    from: `"AIFUS 2026" <${emailUser}>`,
    to: user.email,
    subject: "Code de reinitialisation AIFUS",
    html: `
      <div style="font-family:Arial,sans-serif;color:#111;line-height:1.5;">
        <h2>Reinitialisation de votre mot de passe</h2>
        <p>Bonjour ${user.prenom},</p>
        <p>Nous avons recu une demande de reinitialisation du mot de passe pour votre compte.</p>
        <p>Entrez ce code a 6 chiffres dans l'application :</p>
        <p style="margin:24px 0;font-size:32px;font-weight:700;letter-spacing:0.35em;color:#0f172a;">
          ${resetCode}
        </p>
        <p>Ce code expire dans 10 minutes.</p>
        <p>Si vous n'avez pas demande cette reinitialisation, vous pouvez ignorer ce message.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Erreur envoi email code de reinitialisation:", error.message);
    return false;
  }
};

const findValidResetRequestByCode = async (identifiant, code) => {
  const normalizedEmail = identifiant?.trim().toLowerCase();
  const normalizedCode = code?.trim();

  if (!normalizedEmail || !normalizedCode) {
    return null;
  }

  const hashedCode = crypto
    .createHash("sha256")
    .update(normalizedCode)
    .digest("hex");

  return prisma.passwordReset.findFirst({
    where: {
      identifier: normalizedEmail,
      code: hashedCode,
      expiresAt: { gt: new Date() },
    },
  });
};

// @desc    Inscription utilisateur
// @route   POST /api/auth/register
const register = async (req, res) => {
  const { email, password, nom, prenom, telephone } = req.body;

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: "Cet email est déjà utilisé" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        nom,
        prenom,
        telephone,
        role: "USER", // premier utilisateur pourra être promu admin manuellement
      },
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// @desc    Connexion utilisateur
// @route   POST /api/auth/login
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Aucun compte trouve avec cette adresse email." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Mot de passe incorrect. Veuillez reessayer." });
    }

    res.json({
      id: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// @desc    Envoyer un email pour réinitialiser le mot de passe
// @route   POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  const { identifiant } = req.body;
  const normalizedEmail = identifiant?.trim().toLowerCase();
  
  if (!identifiant || identifiant.trim() === "") {
    return res.status(400).json({ message: "Email ou téléphone requis" });
  }
  
  if (!normalizedEmail) {
    return res.status(400).json({ message: "Email requis" });
  }

  if (!normalizedEmail.includes("@")) {
    return res.status(400).json({ message: "Adresse email invalide" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user) {
      return res.json({
        message: isEmail
          ? "Si cet email existe, un lien de réinitialisation a été envoyé."
          : "Si ce numéro existe, un code de réinitialisation a été envoyé.",
      });
    }

    if (!isEmail && !user.telephone) {
      return res.json({
        message: "Si ce numéro existe, un code de réinitialisation a été envoyé.",
      });
    }

    if (isEmail) {
      if (!process.env.JWT_SECRET || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error("JWT_SECRET or EMAIL config missing");
        return res.status(500).json({ message: "Configuration serveur incomplète." });
      }

      const token = crypto.randomBytes(32).toString("hex");
      const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await prisma.passwordReset.deleteMany({ where: { identifier: identifiant } });
      await prisma.passwordReset.create({
        data: { identifier: identifiant, token: hashedToken, expiresAt },
      });

      const resetLink = `${getFrontendUrl()}/reset-password?token=${token}`;
      const emailSent = await sendResetPasswordEmail(user, resetLink);

      if (!emailSent) {
        return res.status(500).json({ message: "Impossible d'envoyer l'email." });
      }
      res.json({ message: "Un lien de réinitialisation a été envoyé par email." });
    } else {
      res.json({
        message: "Si ce numéro existe, un code de réinitialisation a été envoyé.",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// @desc    Envoyer un code SMS pour réinitialisation
// legacy SMS flow disabled
const sendSmsCode = async (req, res) => {
  const { phone } = req.body;

  try {
    const user = await prisma.user.findFirst({
      where: { telephone: { contains: phone } },
    });

    if (!user) {
      return res.json({
        message: "Si ce numéro existe, un code vous sera envoyé.",
      });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.passwordReset.deleteMany({ where: { identifier: phone } });
    await prisma.passwordReset.create({
      data: { identifier: phone, code: hashedCode, expiresAt },
    });

    const smsMessage = `AIFUS: Votre code de réinitialisation est ${code}. Valable 10 minutes.`;
    const smsSent = await sendResetSms(phone, smsMessage);

    if (!smsSent) {
      return res.status(500).json({ message: "Erreur lors de l'envoi du SMS." });
    }

    res.json({ message: "Code envoyé par SMS." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// @desc    Vérifier le code SMS et réinitialiser le mot de passe
// legacy SMS verification disabled
const verifySmsCode = async (req, res) => {
  const { phone, code, newPassword } = req.body;

  try {
    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");
    const resetRequest = await prisma.passwordReset.findFirst({
      where: {
        identifier: phone,
        code: hashedCode,
        expiresAt: { gt: new Date() },
      },
    });

    if (!resetRequest) {
      return res.status(400).json({ error: "Code invalide ou expiré" });
    }

    const user = await prisma.user.findFirst({
      where: { telephone: { contains: phone } },
    });

    if (!user) {
      return res.status(400).json({ error: "Utilisateur introuvable" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await prisma.passwordReset.deleteMany({ where: { identifier: phone } });

    res.json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// @desc    Authentification via Google
// @route   POST /api/auth/google
const forgotPasswordEmailOnly = async (req, res) => {
  const normalizedEmail = req.body.identifiant?.trim().toLowerCase();

  if (!normalizedEmail) {
    return res.status(400).json({ message: "Email requis" });
  }

  if (!normalizedEmail.includes("@")) {
    return res.status(400).json({ message: "Adresse email invalide" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return res.json({
        message: "Si cet email existe, un code de reinitialisation a ete envoye.",
      });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("EMAIL_USER or EMAIL_PASS missing");
      return res.status(500).json({ message: "Configuration email incomplete." });
    }

    const resetCode = generateResetCode();
    const hashedCode = crypto.createHash("sha256").update(resetCode).digest("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.passwordReset.deleteMany({
      where: { identifier: normalizedEmail },
    });

    await prisma.passwordReset.create({
      data: {
        identifier: normalizedEmail,
        token: null,
        code: hashedCode,
        expiresAt,
      },
    });

    const emailSent = await sendResetCodeEmail(user, resetCode);

    if (!emailSent) {
      return res.status(500).json({ message: "Impossible d'envoyer l'email." });
    }

    return res.json({
      message: "Un code de reinitialisation a ete envoye par email.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

const verifyResetCode = async (req, res) => {
  const normalizedEmail = req.body.identifiant?.trim().toLowerCase();
  const normalizedCode = req.body.code?.trim();

  try {
    const resetRequest = await findValidResetRequestByCode(
      normalizedEmail,
      normalizedCode,
    );

    if (!resetRequest) {
      return res.status(400).json({ error: "Code invalide ou expire" });
    }

    return res.json({
      message: "Code verifie. Vous pouvez maintenant definir un nouveau mot de passe.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
};

const googleAuth = async (req, res) => {
  const { idToken } = req.body;

  try {
    const allowedGoogleClientIds = getAllowedGoogleClientIds();

    if (!idToken) {
      return res.status(400).json({ message: "Token Google manquant." });
    }
    if (!allowedGoogleClientIds.length) {
      console.error("GOOGLE_CLIENT_ID or GOOGLE_CLIENT_IDS missing in environment");
      return res
        .status(500)
        .json({ message: "Configuration Google manquante côté serveur." });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
    });
    const payload = ticket.getPayload();
    const receivedAudiences = getReceivedGoogleAudiences(payload);
    const isAllowedAudience = receivedAudiences.some((audience) =>
      allowedGoogleClientIds.includes(audience),
    );

    if (!payload || !isAllowedAudience) {
      console.error("Audience Google non autorisee", {
        receivedAudiences: receivedAudiences.map(maskGoogleClientId),
        allowedAudiences: allowedGoogleClientIds.map(maskGoogleClientId),
      });
      return res
        .status(401)
        .json({ message: "Jeton Google invalide pour cette application." });
    }
    if (!payload.email_verified) {
      return res.status(401).json({ message: "Email Google non vérifié." });
    }
    if (!payload.email) {
      return res.status(400).json({ message: "Email introuvable depuis Google." });
    }

    const email = payload.email;
    const nom = payload.family_name || payload.name || "Utilisateur";
    const prenom = payload.given_name || payload.name || "Google";

    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          nom,
          prenom,
          role: "USER",
        },
      });
    }

    res.json({
      id: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    console.error("Erreur de vérification Google:", error);
    res.status(401).json({ message: "Token Google invalide ou expiré." });
  }
};

// @desc    Réinitialiser le mot de passe (via token email)
// @route   POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  const { token, identifiant, code, password } = req.body;

  try {
    let resetRequest = null;

    if (token) {
      const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
      resetRequest = await prisma.passwordReset.findFirst({
        where: {
          token: hashedToken,
          expiresAt: { gt: new Date() },
        },
      });
    } else {
      if (!identifiant || !code) {
        return res
          .status(400)
          .json({ message: "Email et code de verification requis" });
      }

      resetRequest = await findValidResetRequestByCode(identifiant, code);

      if (!resetRequest) {
        return res.status(400).json({ error: "Code invalide ou expire" });
      }
    }

    if (!resetRequest) {
      return res.status(400).json({ error: "Lien invalide ou expiré" });
    }

    const user = await prisma.user.findUnique({
      where: { email: resetRequest.identifier },
    });

    if (!user) {
      return res.status(400).json({ error: "Utilisateur introuvable" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    await prisma.passwordReset.deleteMany({
      where: { identifier: resetRequest.identifier },
    });

    res.json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
};

// @desc    Obtenir le profil utilisateur connecté
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    select: {
      id: true,
      email: true,
      nom: true,
      prenom: true,
      telephone: true,
      role: true,
    },
  });
  res.json(user);
};

module.exports = {
  register,
  login,
  googleAuth,
  forgotPassword: forgotPasswordEmailOnly,
  verifyResetCode,
  resetPassword,
  getMe,
};
