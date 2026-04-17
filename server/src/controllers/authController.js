const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const generateToken = require("../utils/generateToken");

const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const getFrontendUrl = () =>
  process.env.FRONTEND_URL || "http://localhost:5173";

const sendResetSms = async (phone, message) => {
  const apiKey = process.env.SMS_API_KEY;
  const senderId = process.env.SMS_SENDER_ID || "AIFUS";
  
  if (!apiKey) {
    console.error("SMS_API_KEY missing, unable to send SMS");
    return false;
  }
  
  try {
    const response = await fetch(`https://api.smsarena.ci/api/v1/send?key=${apiKey}&sender=${senderId}&phone=${phone}&message=${encodeURIComponent(message)}`);
    const data = await response.json();
    return data.success || data.status === "success" || response.ok;
  } catch (error) {
    console.error("SMS send error:", error.message);
    return false;
  }
};

const sendResetPasswordEmail = async (user, resetToken) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const frontendUrl = getFrontendUrl();

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

  const resetUrl = `${frontendUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;

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
        <p><a href="${resetUrl}" style="color:#1d4ed8;">Réinitialiser mon mot de passe</a></p>
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
        .json({ message: "Email ou mot de passe incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Email ou mot de passe incorrect" });
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
  
  if (!identifiant || identifiant.trim() === "") {
    return res.status(400).json({ message: "Email ou téléphone requis" });
  }
  
  const isEmail = identifiant.includes("@");

  try {
    const user = isEmail
      ? await prisma.user.findUnique({ where: { email: identifiant } })
      : await prisma.user.findFirst({ where: { telephone: { contains: identifiant } } });

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
// @route   POST /api/auth/send-sms-code
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
// @route   POST /api/auth/verify-sms-code
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
const googleAuth = async (req, res) => {
  const { idToken } = req.body;

  try {
    if (!idToken) {
      return res.status(400).json({ message: "Token Google manquant." });
    }
    if (!process.env.GOOGLE_CLIENT_ID) {
      console.error("GOOGLE_CLIENT_ID missing in environment");
      return res
        .status(500)
        .json({ message: "Configuration Google manquante côté serveur." });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    if (!payload || payload.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).json({ message: "Jeton Google invalide." });
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
  const { token, password } = req.body;

  try {
    if (!token) {
      return res.status(400).json({ message: "Token requis" });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const resetRequest = await prisma.passwordReset.findFirst({
      where: {
        token: hashedToken,
        expiresAt: { gt: new Date() },
      },
    });

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
  forgotPassword,
  resetPassword,
  sendSmsCode,
  verifySmsCode,
  getMe,
};
