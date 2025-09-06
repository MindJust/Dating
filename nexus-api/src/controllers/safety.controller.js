// Contrôleur de sécurité
const { Venue, Report } = require('../models');

// Récupérer les lieux sûrs
const getSafetyVenues = async (req, res) => {
  try {
    const venues = await Venue.findAll({
      where: {
        is_active: true
      }
    });
    
    res.json(venues);
  } catch (error) {
    console.error('Error fetching safety venues:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Signaler un utilisateur
const reportUser = async (req, res) => {
  try {
    const { reported_id, reason, details } = req.body;
    const reporter_id = req.user.id;
    
    // Vérifier que l'utilisateur ne se signale pas lui-même
    if (reporter_id === reported_id) {
      return res.status(400).json({ error: 'You cannot report yourself' });
    }
    
    // Créer le signalement
    const report = await Report.create({
      reporter_id,
      reported_id,
      reason,
      details
    });
    
    res.json(report);
  } catch (error) {
    console.error('Error reporting user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getSafetyVenues,
  reportUser
};