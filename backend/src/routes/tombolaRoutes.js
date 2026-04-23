const express = require('express');
const router = express.Router();
const { acheterBillets, payerDirect, getMesBillets, getPlaces } = require('../controllers/tombolaController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);
router.post('/acheter', acheterBillets);
router.post('/payer-direct', payerDirect);
router.get('/mes-billets', getMesBillets);
router.get('/places', getPlaces);

module.exports = router;
