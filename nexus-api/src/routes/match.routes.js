// Routes des matchs
const express = require('express');
const { 
  getMatches, 
  getMessages, 
  sendMessage 
} = require('../controllers/match.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// Appliquer l'authentification à toutes les routes
router.use(authenticate);

// Récupérer les matchs de l'utilisateur
router.get('/', getMatches);

// Récupérer les messages d'un match
router.get('/:matchId/messages', getMessages);

// Envoyer un message
router.post('/:matchId/messages', sendMessage);

module.exports = router;