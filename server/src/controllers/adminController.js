const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// @desc    Obtenir toutes les inscriptions au gala
// @route   GET /api/admin/inscriptions
const getAllInscriptions = async (req, res) => {
  try {
    const inscriptions = await prisma.inscriptionGala.findMany({
      include: {
        user: {
          select: { nom: true, prenom: true, email: true, telephone: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(inscriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Valider un paiement d'inscription
// @route   PUT /api/admin/inscriptions/:id/valider
const validerInscription = async (req, res) => {
  const { id } = req.params;
  try {
    const inscription = await prisma.inscriptionGala.update({
      where: { id: parseInt(id) },
      data: { statutPaiement: 'VALIDE' }
    });
    res.json(inscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Obtenir tous les billets de tombola
// @route   GET /api/admin/tombola
const getAllBilletsTombola = async (req, res) => {
  try {
    const billets = await prisma.billetTombola.findMany({
      include: {
        user: { select: { nom: true, prenom: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(billets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};


// @desc    Valider un billet de tombola
// @route   PUT /api/admin/tombola/:id/valider
const validerBilletTombola = async (req, res) => {
  const { id } = req.params;
  try {
    const billet = await prisma.billetTombola.update({
      where: { id: parseInt(id) },
      data: { statutPaiement: 'VALIDE' }
    });
    res.json(billet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// @desc    Statistiques globales
// @route   GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const totalInscriptions = await prisma.inscriptionGala.count();
    const totalBillets = await prisma.billetTombola.count();
    const montantInscriptions = await prisma.inscriptionGala.aggregate({
      _sum: { montantTotal: true }
    });
    const montantTombola = await prisma.billetTombola.aggregate({
      _sum: { montant: true }
    });

    res.json({
      totalInscriptions,
      totalBillets,
      montantTotalInscriptions: montantInscriptions._sum.montantTotal || 0,
      montantTotalTombola: montantTombola._sum.montant || 0
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  getAllInscriptions,
  validerInscription,
  getAllBilletsTombola,
  validerBilletTombola,
  getStats
};