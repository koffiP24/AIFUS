const express = require('express');
const router = express.Router();
const { acheterBillets, getMesBillets } = require('../controllers/tombolaController');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);
router.post('/acheter', acheterBillets);
router.get('/mes-billets', getMesBillets);

module.exports = router;