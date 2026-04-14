const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const generateToken = require("../utils/generateToken");

const prisma = new PrismaClient();

const getFrontendUrl = () =>
  process.env.FRONTEND_URL || "http://localhost:5173";

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
  const { email } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.json({
        message:
          "Si cet email existe, un lien de réinitialisation a été envoyé.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET missing in environment");
      return res
        .status(500)
        .json({
          message: "Configuration du serveur incomplète pour l'envoi du lien.",
        });
    }

    const resetToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const emailSent = await sendResetPasswordEmail(user, resetToken);

    if (!emailSent) {
      return res
        .status(500)
        .json({
          message:
            "Impossible d'envoyer le lien de réinitialisation. Vérifiez la configuration du serveur.",
        });
    }

    res.json({
      message: "Si cet email existe, un lien de réinitialisation a été envoyé.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// @desc    Authentification via Google
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

    const googleResponse = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`,
    );
    if (!googleResponse.ok) {
      return res.status(401).json({ message: "Jeton Google invalide." });
    }

    const payload = await googleResponse.json();
    if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
      return res.status(401).json({ message: "Jeton Google invalide." });
    }
    if (!payload.email_verified) {
      return res.status(401).json({ message: "Email Google non vérifié." });
    }

    let user = await prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (!user) {
      const randomPassword = crypto.randomBytes(16).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = await prisma.user.create({
        data: {
          email: payload.email,
          password: hashedPassword,
          nom: payload.family_name || payload.name || "Utilisateur",
          prenom: payload.given_name || payload.name || "Google",
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
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// @desc    Réinitialiser le mot de passe
// @route   POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  try {
    if (!token) {
      return res.status(400).json({ message: "Token requis" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    res.json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (error) {
    console.error(error);
    if (error.name === "TokenExpiredError") {
      return res
        .status(400)
        .json({ message: "Le lien de réinitialisation a expiré." });
    }
    if (error.name === "JsonWebTokenError") {
      return res.status(400).json({ message: "Token invalide." });
    }
    res.status(500).json({ message: "Erreur serveur" });
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
  getMe,
};
