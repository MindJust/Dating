// Routes de sécurité
const express = require('express');
const { getSafetyVenues, reportUser } = require('../controllers/safety.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// Appliquer l'authentification à toutes les routes
router.use(authenticate);

// Récupérer les lieux sûrs
router.get('/venues', getSafetyVenues);

// Signaler un utilisateur
router.post('/reports', reportUser);

module.exports = router;