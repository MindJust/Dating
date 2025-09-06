// Routes d'administration
const express = require('express');
const { 
  getUsers, 
  getUserDetails, 
  getReports, 
  resolveReport, 
  getVenues, 
  createVenue, 
  updateVenue, 
  deleteVenue 
} = require('../controllers/admin.controller');
const { updateUserTrustLevel } = require('../controllers/user.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

// Appliquer l'authentification à toutes les routes
router.use(authenticate);

// Mettre à jour le niveau de confiance d'un utilisateur (admin only)
router.put('/users/:userId/trust-level', updateUserTrustLevel);

// Routes des utilisateurs
router.get('/users', getUsers);
router.get('/users/:userId', getUserDetails);

// Routes des signalements
router.get('/reports', getReports);
router.put('/reports/:reportId', resolveReport);

// Routes des lieux sûrs
router.get('/venues', getVenues);
router.post('/venues', createVenue);
router.put('/venues/:venueId', updateVenue);
router.delete('/venues/:venueId', deleteVenue);

module.exports = router;