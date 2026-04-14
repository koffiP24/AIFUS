const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Générer un numéro de billet aléatoire au format A1..Z100
const generateNumeroBillet = () => {
  const lettre = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  const numero = Math.floor(Math.random() * 100) + 1;
  return `${lettre}${numero}`;
};

// @desc    Acheter des billets de tombola
// @route   POST /api/tombola/acheter
const acheterBillets = async (req, res) => {
  const { quantite } = req.body;
  const userId = req.user.id;

  if (!quantite || quantite < 1 || quantite > 10) {
    return res.status(400).json({ message: 'Quantité invalide (1-10 billets)' });
  }

  const prixUnitaire = 10000;
  const montant = quantite * prixUnitaire;

  try {
    // Simulation de paiement (à remplacer par intégration réelle)
    // On crée un enregistrement pour chaque billet
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
          statutPaiement: 'VALIDE', // Simulation: on valide directement
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

module.exports = { acheterBillets, getMesBillets };