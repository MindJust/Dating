// Routes de configuration
const express = require('express');
const { getConfig, updateConfig, resetConfig } = require('../controllers/config.controller');
const { authenticate, authorizeAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// Route publique pour récupérer la configuration
router.get('/', getConfig);

// Routes protégées pour mettre à jour et réinitialiser la configuration (réservées aux administrateurs)
router.put('/', authenticate, authorizeAdmin, updateConfig);
router.delete('/', authenticate, authorizeAdmin, resetConfig);

module.exports = router;