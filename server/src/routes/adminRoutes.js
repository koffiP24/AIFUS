const express = require('express');
const router = express.Router();
const {
  getAllInscriptions,
  validerInscription,
  getAllBilletsTombola,
  validerBilletTombola,
  getStats
} = require('../controllers/adminController');
const authMiddleware = require('../middlewares/auth');
const adminMiddleware = require('../middlewares/admin');

router.use(authMiddleware, adminMiddleware);
router.get('/inscriptions', getAllInscriptions);
router.put('/inscriptions/:id/valider', validerInscription);
router.put('/tombola/:id/valider', validerBilletTombola);
router.get('/tombola', getAllBilletsTombola);
router.get('/stats', getStats);

module.exports = router;