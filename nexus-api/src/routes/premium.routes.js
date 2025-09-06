// Routes de monétisation
const express = require('express');
const { getPremiumPlans, subscribeToPremium } = require('../controllers/premium.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// Appliquer l'authentification à toutes les routes
router.use(authenticate);

// Récupérer les plans premium
router.get('/plans', getPremiumPlans);

// S'abonner à un plan premium
router.post('/subscribe', subscribeToPremium);

module.exports = router;