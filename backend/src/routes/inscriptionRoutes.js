const express = require('express');
const router = express.Router();
const { createInscription, getMyInscription, getPlaces, confirmPayment, handleDirectPayment, cancelInscription } = require('../controllers/inscriptionController');
const authMiddleware = require('../middlewares/auth');
const { validate, inscriptionValidation } = require('../middlewares/validation');

router.get('/gala/places', getPlaces);
router.use(authMiddleware);
router.post('/gala', validate(inscriptionValidation), createInscription);
router.get('/gala/mine', getMyInscription);
router.delete('/gala/cancel', cancelInscription);
router.post('/gala/payer', confirmPayment);
router.post('/gala/payer-direct', validate(inscriptionValidation), handleDirectPayment);

module.exports = router;