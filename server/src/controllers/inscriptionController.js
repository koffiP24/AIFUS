const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const sendConfirmationEmail = async (user, inscription) => {
  const nodemailer = require('nodemailer');
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'aifus2026@gmail.com',
      pass: process.env.EMAIL_PASS || 'votre-mot-de-passe'
    }
  });

  const categories = {
    ACTIF: 'Alumni en fonction',
    RETRAITE: 'Retraité',
    SANS_EMPLOI: 'Sans emploi',
    INVITE: 'Invité'
  };

  const mailOptions = {
    from: `"AIFUS 2026" <${process.env.EMAIL_USER || 'aifus2026@gmail.com'}>`,
    to: user.email,
    subject: '🎉 Confirmation inscription - Gala des Alumni AIFUS 2026',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #f8f9fa; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #f59e0b, #d97706); padding: 40px; text-align: center; color: white; }
          .header h1 { margin: 0; font-size: 28px; }
          .content { padding: 40px; }
          .ticket { background: linear-gradient(135deg, #fffbeb, #fef3c7); border: 2px dashed #f59e0b; border-radius: 15px; padding: 25px; margin: 20px 0; }
          .ticket-title { font-size: 18px; font-weight: bold; color: #d97706; text-align: center; margin-bottom: 15px; }
          .ticket-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .ticket-row:last-child { border-bottom: none; }
          .label { color: #6b7280; }
          .value { font-weight: 600; color: #1f2937; }
          .footer { background: #1f2937; color: white; padding: 30px; text-align: center; }
          .highlight { color: #f59e0b; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎊 Gala des Alumni AIFUS</h1>
            <p>1er Août 2026</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937;">Bonjour ${user.prenom} ${user.nom} !</h2>
            <p style="color: #4b5563;">Votre inscription au Gala des Alumni AIFUS 2026 a été confirmée. Nous avons le plaisir de vous accueillir pour cette soirée exceptionnelle !</p>
            
            <div class="ticket">
              <div class="ticket-title">🎫 Votre Billet d'Accès</div>
              <div class="ticket-row">
                <span class="label">Nom & Prénom</span>
                <span class="value">${user.nom} ${user.prenom}</span>
              </div>
              <div class="ticket-row">
                <span class="label">Catégorie</span>
                <span class="value">${categories[inscription.categorie]}</span>
              </div>
              <div class="ticket-row">
                <span class="label">Nombre d'invités</span>
                <span class="value">${inscription.nombreInvites}</span>
              </div>
              <div class="ticket-row">
                <span class="label">Montant payé</span>
                <span class="value highlight">${inscription.montantTotal.toLocaleString()} Fcfa</span>
              </div>
              <div class="ticket-row">
                <span class="label">Référence</span>
                <span class="value">${inscription.referencePaiement}</span>
              </div>
            </div>
            
            <h3 style="color: #1f2937;">📅 Informations pratiques</h3>
            <ul style="color: #4b5563; line-height: 1.8;">
              <li><strong>Date :</strong> Samedi 1er Août 2026</li>
              <li><strong>Lieu :</strong> Hôtel Palm Club / Sofitel</li>
              <li><strong>Heure :</strong> 18h00 - 02h00</li>
            </ul>
            
            <p style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; color: #065f46; margin-top: 20px;">
              💚 <strong>Important :</strong> Présentez ce mail ou votre référence de paiement à l'entrée.
            </p>
          </div>
          <div class="footer">
            <p>Ensemble, célébrons l'excellence ! 🎓</p>
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

// @desc    Créer une inscription au gala
// @route   POST /api/inscriptions/gala
const createInscription = async (req, res) => {
  const { categorie, nombreInvites = 0 } = req.body;
  const userId = req.user.id;

  try {
    // Vérifier si l'utilisateur est déjà inscrit
    const existing = await prisma.inscriptionGala.findUnique({ where: { userId } });
    if (existing) {
      return res.status(400).json({ message: 'Vous êtes déjà inscrit au gala' });
    }

    // Vérifier les places disponibles
    const maxPlaces = { ACTIF: 170, RETRAITE: 40, SANS_EMPLOI: 10, INVITE: 50 };
    const inscriptions = await prisma.inscriptionGala.findMany({
      where: { statutPaiement: 'VALIDE' },
      select: { categorie: true, nombreInvites: true }
    });
    
    let places = { ...maxPlaces };
    inscriptions.forEach(ins => {
      places[ins.categorie] = Math.max(0, places[ins.categorie] - 1 - ins.nombreInvites);
    });
    
    if (places[categorie] <= 0) {
      return res.status(400).json({ message: 'Plus de places disponibles pour cette catégorie' });
    }

    // Calcul du montant
    const tarifs = {
      ACTIF: 40000,
      RETRAITE: 25000,
      SANS_EMPLOI: 15000,
      INVITE: 20000
    };
    let montant = tarifs[categorie];
    if (categorie !== 'INVITE') {
      montant += nombreInvites * 20000;
    }

    const inscription = await prisma.inscriptionGala.create({
      data: {
        userId,
        categorie,
        nombreInvites,
        montantTotal: montant,
        statutPaiement: 'EN_ATTENTE'
      }
    });

    res.status(201).json(inscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Récupérer l'inscription de l'utilisateur connecté
// @route   GET /api/inscriptions/gala/mine
const getMyInscription = async (req, res) => {
  try {
    const inscription = await prisma.inscriptionGala.findUnique({
      where: { userId: req.user.id }
    });
    res.json(inscription || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Supprimer une inscription au gala si le paiement n'est pas encore effectué
// @route   DELETE /api/inscriptions/gala/cancel
const cancelInscription = async (req, res) => {
  try {
    const inscription = await prisma.inscriptionGala.findUnique({
      where: { userId: req.user.id }
    });

    if (!inscription) {
      return res.status(404).json({ message: 'Inscription non trouvée' });
    }

    if (inscription.statutPaiement === 'VALIDE') {
      return res.status(400).json({ message: 'Impossible de supprimer une inscription déjà payée' });
    }

    await prisma.inscriptionGala.delete({ where: { id: inscription.id } });

    res.json({ message: 'Réservation supprimée avec succès' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Obtenir le nombre de places disponibles par catégorie
// @route   GET /api/inscriptions/gala/places
const getPlaces = async (req, res) => {
  try {
    const maxPlaces = { ACTIF: 170, RETRAITE: 40, SANS_EMPLOI: 10, INVITE: 50 };
    
    const inscriptions = await prisma.inscriptionGala.findMany({
      where: { statutPaiement: 'VALIDE' },
      select: { categorie: true, nombreInvites: true }
    });
    
    const places = { ...maxPlaces };
    
    inscriptions.forEach(ins => {
      places[ins.categorie] = Math.max(0, places[ins.categorie] - 1 - ins.nombreInvites);
    });
    
    res.json(places);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Confirmer le paiement
// @route   POST /api/inscriptions/gala/payer
const confirmPayment = async (req, res) => {
  const { inscriptionId } = req.body;
  
  try {
    const inscription = await prisma.inscriptionGala.findUnique({
      where: { id: inscriptionId }
    });
    
    if (!inscription || inscription.userId !== req.user.id) {
      return res.status(404).json({ message: 'Inscription non trouvée' });
    }
    
    const updated = await prisma.inscriptionGala.update({
      where: { id: inscriptionId },
      data: { 
        statutPaiement: 'VALIDE',
        referencePaiement: `AIFUS-${Date.now()}`
      }
    });
    
    // Envoyer l'email de confirmation
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    sendConfirmationEmail(user, updated);
    
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Paiement direct (inscription + paiement en un seul)
// @route   POST /api/inscriptions/gala/payer-direct
const handleDirectPayment = async (req, res) => {
  const { categorie, nombreInvites = 0, montant, phone, method } = req.body;
  const userId = req.user.id;

  try {
    // Vérifier si l'utilisateur est déjà inscrit
    const existing = await prisma.inscriptionGala.findUnique({ where: { userId } });
    if (existing) {
      return res.status(400).json({ message: 'Vous êtes déjà inscrit au gala' });
    }

    // Vérifier les places disponibles
    const maxPlaces = { ACTIF: 170, RETRAITE: 40, SANS_EMPLOI: 10, INVITE: 50 };
    const inscriptions = await prisma.inscriptionGala.findMany({
      where: { statutPaiement: 'VALIDE' },
      select: { categorie: true, nombreInvites: true }
    });
    
    let places = { ...maxPlaces };
    inscriptions.forEach(ins => {
      places[ins.categorie] = Math.max(0, places[ins.categorie] - 1 - ins.nombreInvites);
    });
    
    if (places[categorie] <= 0) {
      return res.status(400).json({ message: 'Plus de places disponibles pour cette catégorie' });
    }

    // Créer l'inscription avec paiement validé
    const inscription = await prisma.inscriptionGala.create({
      data: {
        userId,
        categorie,
        nombreInvites,
        montantTotal: montant,
        statutPaiement: 'VALIDE',
        referencePaiement: `AIFUS-${Date.now()}-${method?.toUpperCase()}`
      }
    });

    // Envoyer l'email de confirmation
    const user = await prisma.user.findUnique({ where: { id: userId } });
    sendConfirmationEmail(user, inscription);

    res.status(201).json(inscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = { createInscription, getMyInscription, getPlaces, confirmPayment, handleDirectPayment, cancelInscription };
