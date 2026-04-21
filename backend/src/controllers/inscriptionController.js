const { prisma } = require("../lib/prisma");
const {
  ensureGalaTicket,
} = require("../utils/galaTicket");

const GALA_MAX_PLACES = {
  ACTIF: 170,
  RETRAITE: 40,
  SANS_EMPLOI: 10,
  INVITE: 50,
};

const GALA_TARIFS = {
  ACTIF: 40000,
  RETRAITE: 25000,
  SANS_EMPLOI: 15000,
  INVITE: 20000,
};

const sendConfirmationEmail = async (user, inscription) => {
  const nodemailer = require("nodemailer");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER || "aifus2026@gmail.com",
      pass: process.env.EMAIL_PASS || "votre-mot-de-passe",
    },
  });

  const categories = {
    ACTIF: "Alumni en fonction",
    RETRAITE: "Retraite",
    SANS_EMPLOI: "Sans emploi",
    INVITE: "Invite",
  };

  const mailOptions = {
    from: `"AIFUS 2026" <${process.env.EMAIL_USER || "aifus2026@gmail.com"}>`,
    to: user.email,
    subject: "Confirmation inscription - Gala des Alumni AIFUS 2026",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #f8f9fa; padding: 20px; }
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
            <h1>Gala des Alumni AIFUS</h1>
            <p>1er Aout 2026</p>
          </div>
          <div class="content">
            <h2 style="color: #1f2937;">Bonjour ${user.prenom} ${user.nom}</h2>
            <p style="color: #4b5563;">Votre inscription au Gala des Alumni AIFUS 2026 a ete confirmee. Nous avons le plaisir de vous accueillir pour cette soiree exceptionnelle.</p>
            <div class="ticket">
              <div class="ticket-title">Votre billet d'acces</div>
              <div class="ticket-row">
                <span class="label">Ticket</span>
                <span class="value">${inscription.ticketCode || "En generation"}</span>
              </div>
              <div class="ticket-row">
                <span class="label">Nom et prenom</span>
                <span class="value">${user.nom} ${user.prenom}</span>
              </div>
              <div class="ticket-row">
                <span class="label">Categorie</span>
                <span class="value">${categories[inscription.categorie]}</span>
              </div>
              <div class="ticket-row">
                <span class="label">Nombre d'invites</span>
                <span class="value">${inscription.nombreInvites}</span>
              </div>
              <div class="ticket-row">
                <span class="label">Montant paye</span>
                <span class="value highlight">${inscription.montantTotal.toLocaleString()} Fcfa</span>
              </div>
              <div class="ticket-row">
                <span class="label">Reference</span>
                <span class="value">${inscription.referencePaiement}</span>
              </div>
            </div>
            <h3 style="color: #1f2937;">Informations pratiques</h3>
            <ul style="color: #4b5563; line-height: 1.8;">
              <li><strong>Date :</strong> Samedi 1er Aout 2026</li>
              <li><strong>Lieu :</strong> Hotel Palm Club / Sofitel</li>
              <li><strong>Heure :</strong> 18h00 - 02h00</li>
            </ul>
            <p style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; color: #065f46; margin-top: 20px;">
              <strong>Important :</strong> Presentez votre ticket QR depuis votre espace membre ou votre reference de paiement a l'entree.
            </p>
          </div>
          <div class="footer">
            <p>Ensemble, celebrons l'excellence.</p>
            <p style="font-size: 12px; opacity: 0.7;">Association des Ivoiriens Formes aux Etats-Unis</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email de confirmation envoye a", user.email);
  } catch (error) {
    console.error("Erreur envoi email:", error.message);
  }
};

const getValidatedPlaces = async () => {
  const inscriptions = await prisma.inscriptionGala.findMany({
    where: { statutPaiement: "VALIDE" },
    select: { categorie: true, nombreInvites: true },
  });

  const places = { ...GALA_MAX_PLACES };

  inscriptions.forEach((inscription) => {
    places[inscription.categorie] = Math.max(
      0,
      places[inscription.categorie] - 1 - inscription.nombreInvites,
    );
  });

  return places;
};

const createInscription = async (req, res) => {
  const { categorie, nombreInvites = 0 } = req.body;
  const userId = req.user.id;

  try {
    const existing = await prisma.inscriptionGala.findUnique({ where: { userId } });

    if (existing) {
      return res.status(400).json({ message: "Vous etes deja inscrit au gala" });
    }

    const places = await getValidatedPlaces();

    if (places[categorie] <= 0) {
      return res
        .status(400)
        .json({ message: "Plus de places disponibles pour cette categorie" });
    }

    let montant = GALA_TARIFS[categorie];

    if (categorie !== "INVITE") {
      montant += nombreInvites * 20000;
    }

    const inscription = await prisma.inscriptionGala.create({
      data: {
        userId,
        categorie,
        nombreInvites,
        montantTotal: montant,
        statutPaiement: "EN_ATTENTE",
      },
    });

    res.status(201).json(inscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getMyInscription = async (req, res) => {
  try {
    let inscription = await prisma.inscriptionGala.findUnique({
      where: { userId: req.user.id },
    });

    if (inscription?.statutPaiement === "VALIDE") {
      inscription = await ensureGalaTicket(prisma, inscription.id);
    }

    res.json(inscription || null);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const cancelInscription = async (req, res) => {
  try {
    const inscription = await prisma.inscriptionGala.findUnique({
      where: { userId: req.user.id },
    });

    if (!inscription) {
      return res.status(404).json({ message: "Inscription non trouvee" });
    }

    if (inscription.statutPaiement === "VALIDE") {
      return res.status(400).json({
        message: "Impossible de supprimer une inscription deja payee",
      });
    }

    await prisma.inscriptionGala.delete({ where: { id: inscription.id } });

    res.json({ message: "Reservation supprimee avec succes" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getPlaces = async (_req, res) => {
  try {
    const places = await getValidatedPlaces();
    res.json(places);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const confirmPayment = async (req, res) => {
  const { inscriptionId } = req.body;

  try {
    const inscription = await prisma.inscriptionGala.findUnique({
      where: { id: inscriptionId },
    });

    if (!inscription || inscription.userId !== req.user.id) {
      return res.status(404).json({ message: "Inscription non trouvee" });
    }

    let updated = await prisma.inscriptionGala.update({
      where: { id: inscriptionId },
      data: {
        statutPaiement: "VALIDE",
        referencePaiement: `AIFUS-${Date.now()}`,
      },
    });

    updated = await ensureGalaTicket(prisma, updated.id);

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    sendConfirmationEmail(user, updated);

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const handleDirectPayment = async (req, res) => {
  const { categorie, nombreInvites = 0, montant, method } = req.body;
  const userId = req.user.id;

  try {
    const existing = await prisma.inscriptionGala.findUnique({ where: { userId } });

    if (existing) {
      return res.status(400).json({ message: "Vous etes deja inscrit au gala" });
    }

    const places = await getValidatedPlaces();

    if (places[categorie] <= 0) {
      return res
        .status(400)
        .json({ message: "Plus de places disponibles pour cette categorie" });
    }

    let inscription = await prisma.inscriptionGala.create({
      data: {
        userId,
        categorie,
        nombreInvites,
        montantTotal: montant,
        statutPaiement: "VALIDE",
        referencePaiement: `AIFUS-${Date.now()}-${method?.toUpperCase()}`,
      },
    });

    inscription = await ensureGalaTicket(prisma, inscription.id);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    sendConfirmationEmail(user, inscription);

    res.status(201).json(inscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur" });
  }
};

module.exports = {
  createInscription,
  getMyInscription,
  getPlaces,
  confirmPayment,
  handleDirectPayment,
  cancelInscription,
};
