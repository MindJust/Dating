// Routes des utilisateurs
const express = require('express');
const { 
  getCurrentUserProfile, 
  updateCurrentUserProfile 
} = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// Appliquer l'authentification à toutes les routes
router.use(authenticate);

// Récupérer le profil de l'utilisateur courant
router.get('/me', getCurrentUserProfile);

// Mettre à jour le profil de l'utilisateur courant
router.put('/me', updateCurrentUserProfile);

module.exports = router;