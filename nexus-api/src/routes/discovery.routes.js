// Routes de découverte
const express = require('express');
const { 
  getDiscoveryFeed, 
  getDiscoveryPriorities, 
  sendDiscoveryAction 
} = require('../controllers/discovery.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// Appliquer l'authentification à toutes les routes
router.use(authenticate);

// Récupérer le flux de découverte
router.get('/feed', getDiscoveryFeed);

// Récupérer les priorités du jour
router.get('/priorities', getDiscoveryPriorities);

// Envoyer une action de découverte (like, pass)
router.post('/actions', sendDiscoveryAction);

module.exports = router;