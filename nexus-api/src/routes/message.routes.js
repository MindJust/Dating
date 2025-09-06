// Routes de messagerie
const express = require('express');
const { 
  sendRealTimeMessage, 
  markMessageAsRead 
} = require('../controllers/message.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// Appliquer l'authentification à toutes les routes
router.use(authenticate);

// Envoyer un message en temps réel
router.post('/send', sendRealTimeMessage);

// Marquer un message comme lu
router.put('/:messageId/read', markMessageAsRead);

module.exports = router;