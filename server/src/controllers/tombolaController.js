const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const MAX_BILLETS = 100;

// Générer un numéro de billet aléatoire au format A1..Z100
const generateNumeroBillet = () => {
  const lettre = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const numero = Math.floor(Math.random() * 100) + 1;
  return `${lettre}${numero}`;
};

// Envoyer un email de confirmation
const sendConfirmationEmail = async (user, billets, montantTotal, reference) => {
  const nodemailer = require('nodemailer');
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'aifus2026@gmail.com',
      pass: process.env.EMAIL_PASS || 'votre-mot-de-passe'
    }
  });

  const ticketsHtml = billets.map(b => 
    `<div class="ticket-row">
      <span class="label">Numéro</span>
      <span class="value">${b.numeroBillet}</span>
    </div>`
  ).join('');

  const mailOptions = {
    from: `"AIFUS 2026" <${process.env.EMAIL_USER || 'aifus2026@gmail.com'}>`,
    to: user.email,
    subject: '🎉 Confirmation achat billets - Tombola AIFUS 2026',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #f8f9fa; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #8b5cf6, #6366f1); padding: 40px; text-align: center; color: white; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { padding: 40px; }
          .ticket { background: linear-gradient(135deg, #f5f3ff, #ede9fe); border: 2px dashed #8b5cf6; border-radius: 15px; padding: 25px; margin: 20px 0; }
          .ticket-title { font-size: 18px; font-weight: bold; color: #8b5cf6; text-align: center; margin-bottom: 15px; }
          .ticket-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .ticket-row:last-child { border-bottom: none; }
          .label { color: #6b7280; }
          .value { font-weight: 600; color: #1f2937; }
          .footer { background: #1f2937; color: white; padding: 30px; text-align: center; }
          .highlight { color: #8b5cf6; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎊 Tombola AIFUS 2026</h1>
            <p>Tirage le 1er Août 2026</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937;">Bonjour ${user.prenom} ${user.nom} !</h2>
            <p style="color: #4b5563;">Vos billets de tombola ont été achetés avec succès. Vous êtes maintenant participant au tirage au sort !</p>
            
            <div class="ticket">
              <div class="ticket-title">🎫 Vos Billets de Tombola</div>
              ${ticketsHtml}
              <div class="ticket-row">
                <span class="label">Montant total</span>
                <span class="value highlight">${montantTotal.toLocaleString()} Fcfa</span>
              </div>
              <div class="ticket-row">
                <span class="label">Référence</span>
                <span class="value">${reference}</span>
              </div>
            </div>
            
            <h3 style="color: #1f2937;">📅 Informations</h3>
            <ul style="color: #4b5563; line-height: 1.8;">
              <li><strong>Date du tirage :</strong> Samedi 1er Août 2026</li>
              <li><strong>Lieu :</strong> Hôtel Palm Club / Sofitel</li>
              <li><strong>Prix du billet :</strong> 10 000 Fcfa</li>
            </ul>
            
            <p style="background: #ede9fe; border-left: 4px solid #8b5cf6; padding: 15px; color: #5b21b6; margin-top: 20px;">
              💜 <strong>Important :</strong> Conservez ce mail et vos numéros de billets. Ils seront requis pour la validation des gains.
            </p>
          </div>
          <div class="footer">
            <p>Bonne chance ! 🍀</p>
            <p style="font-size: 12px; opacity: 0.7;">Association des Ivoiriens Formés aux États-Unis</p>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email de confirmation envoyé à', user.email);
  } catch (error) {
    console.error('Erreur envoi email:', error.message);
  }
};

// @desc    Acheter des billets de tombola (simulation - paiement immédiat)
// @route   POST /api/tombola/acheter
const acheterBillets = async (req, res) => {
  const { quantite } = req.body;
  const userId = req.user.id;

  if (!quantite || quantite < 1 || quantite > 10) {
    return res.status(400).json({ message: 'Quantité invalide (1-10 billets)' });
  }

  const prixUnitaire = 10000;

  try {
    // Vérifier le nombre de billets disponibles
    const billsVendus = await prisma.billetTombola.count({
      where: { statutPaiement: 'VALIDE' }
    });
    const placesRestantes = MAX_BILLETS - billsVendus;
    
    if (placesRestantes < quantite) {
      return res.status(400).json({ 
        message: `Plus assez de billets disponibles. Il reste ${placesRestantes} billet(s) sur ${MAX_BILLETS}` 
      });
    }

    // Simulation de paiement (on crée directement les billets validés)
    const billets = [];
    for (let i = 0; i < quantite; i++) {
      let numero;
      let exists = true;
      while (exists) {
        numero = generateNumeroBillet();
        const existing = await prisma.billetTombola.findUnique({ where: { numeroBillet: numero } });
        if (!existing) exists = false;
      }
      const billet = await prisma.billetTombola.create({
        data: {
          userId,
          numeroBillet: numero,
          quantite: 1,
          montant: prixUnitaire,
          statutPaiement: 'VALIDE',
          referencePaiement: `SIMU-${Date.now()}-${i}`
        }
      });
      billets.push(billet);
    }

    res.status(201).json({
      message: `${quantite} billet(s) acheté(s) avec succès`,
      billets
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Paiement direct avec méthode de paiement (simulation)
// @route   POST /api/tombola/payer-direct
const payerDirect = async (req, res) => {
  const { quantite, phone, method } = req.body;
  const userId = req.user.id;

  if (!quantite || quantite < 1 || quantite > 10) {
    return res.status(400).json({ message: 'Quantité invalide (1-10 billets)' });
  }

  if (!phone || !method) {
    return res.status(400).json({ message: 'Veuillez fournir un numéro de téléphone et une méthode de paiement' });
  }

  const prixUnitaire = 10000;
  const montantTotal = quantite * prixUnitaire;

  try {
    // Vérifier le nombre de billets disponibles (seulement les VALIDE)
    const billsVendus = await prisma.billetTombola.count({
      where: { statutPaiement: 'VALIDE' }
    });
    const placesRestantes = MAX_BILLETS - billsVendus;
    
    if (placesRestantes < quantite) {
      return res.status(400).json({ 
        message: `Plus assez de billets disponibles. Il reste ${placesRestantes} billet(s) sur ${MAX_BILLETS}` 
      });
    }

    // Vérifier si l'utilisateur a déjà des billets en attente (optionnel)
    // On peut acheter plusieurs fois, donc on ne bloque pas

    // Créer les billets avec statut EN_ATTENTE initialement
    const billets = [];
    for (let i = 0; i < quantite; i++) {
      let numero;
      let exists = true;
      while (exists) {
        numero = generateNumeroBillet();
        const existing = await prisma.billetTombola.findUnique({ where: { numeroBillet: numero } });
        if (!existing) exists = false;
      }
      
      const billet = await prisma.billetTombola.create({
        data: {
          userId,
          numeroBillet: numero,
          quantite: 1,
          montant: prixUnitaire,
          statutPaiement: 'VALIDE',
          referencePaiement: `TOMO-${method.toUpperCase()}-${Date.now()}-${i}`
        }
      });
      billets.push(billet);
    }

    const reference = `TOMO-${method.toUpperCase()}-${Date.now()}`;

    // Envoyer email de confirmation
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user && user.email) {
      sendConfirmationEmail(user, billets, montantTotal, reference);
    }

    res.status(201).json({
      message: `${quantite} billet(s) acheté(s) avec succès !`,
      billets,
      referencePaiement: reference
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Récupérer les billets de l'utilisateur
// @route   GET /api/tombola/mes-billets
const getMesBillets = async (req, res) => {
  try {
    const billets = await prisma.billetTombola.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json(billets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Récupérer le nombre de billets disponibles
// @route   GET /api/tombola/places
const getPlaces = async (req, res) => {
  try {
    const billsVendus = await prisma.billetTombola.count({
      where: { statutPaiement: 'VALIDE' }
    });
    res.json({ total: MAX_BILLETS, vendues: billsVendus, restantes: MAX_BILLETS - billsVendus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { acheterBillets, payerDirect, getMesBillets, getPlaces };
