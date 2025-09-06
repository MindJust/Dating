// Contrôleur d'administration
const { User, Report, Venue, AppConfig } = require('../models');
const { Op } = require('sequelize');

// Récupérer les utilisateurs
const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', filter = 'all' } = req.query;
    const offset = (page - 1) * limit;
    
    // Construire la condition de recherche
    const whereCondition = {};
    
    if (search) {
      whereCondition[Op.or] = [
        { first_name: { [Op.iLike]: `%${search}%` } },
        { phone_number: { [Op.iLike]: `%${search}%` } }
      ];
    }
    
    // Appliquer le filtre
    if (filter !== 'all') {
      switch (filter) {
        case 'premium':
          whereCondition.is_premium = true;
          break;
        case 'verified':
          whereCondition.trust_level = 3;
          break;
        case 'suspended':
          whereCondition.status = 'suspended';
          break;
        case 'banned':
          whereCondition.status = 'banned';
          break;
      }
    }
    
    const users = await User.findAndCountAll({
      where: whereCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      users: users.rows,
      totalPages: Math.ceil(users.count / limit),
      currentPage: parseInt(page),
      totalUsers: users.count
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Récupérer les détails d'un utilisateur
const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findByPk(userId, {
      include: [{
        model: Profile,
        as: 'profile'
      }]
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Récupérer les signalements
const getReports = async (req, res) => {
  try {
    const { page = 1, limit = 10, filter = 'all' } = req.query;
    const offset = (page - 1) * limit;
    
    // Construire la condition de filtre
    const whereCondition = {};
    
    if (filter !== 'all') {
      whereCondition.status = filter;
    }
    
    const reports = await Report.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: 'reporter',
          attributes: ['id', 'first_name']
        },
        {
          model: User,
          as: 'reported',
          attributes: ['id', 'first_name']
        }
      ],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      reports: reports.rows,
      totalPages: Math.ceil(reports.count / limit),
      currentPage: parseInt(page),
      totalReports: reports.count
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Traiter un signalement
const resolveReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    
    const report = await Report.findByPk(reportId);
    
    if (!report) {
      return res.status(404).json({ error: 'Report not found' });
    }
    
    // Mettre à jour le statut du signalement
    await report.update({
      status: 'resolved'
    });
    
    res.json(report);
  } catch (error) {
    console.error('Error resolving report:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Récupérer les lieux sûrs
const getVenues = async (req, res) => {
  try {
    const venues = await Venue.findAll({
      order: [['name', 'ASC']]
    });
    
    res.json(venues);
  } catch (error) {
    console.error('Error fetching venues:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Créer un lieu sûr
const createVenue = async (req, res) => {
  try {
    const { name, address, description, photo_url, is_active } = req.body;
    
    const venue = await Venue.create({
      name,
      address,
      description,
      photo_url,
      is_active
    });
    
    res.json(venue);
  } catch (error) {
    console.error('Error creating venue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mettre à jour un lieu sûr
const updateVenue = async (req, res) => {
  try {
    const { venueId } = req.params;
    const { name, address, description, photo_url, is_active } = req.body;
    
    const venue = await Venue.findByPk(venueId);
    
    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    
    await venue.update({
      name,
      address,
      description,
      photo_url,
      is_active
    });
    
    res.json(venue);
  } catch (error) {
    console.error('Error updating venue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Supprimer un lieu sûr
const deleteVenue = async (req, res) => {
  try {
    const { venueId } = req.params;
    
    const venue = await Venue.findByPk(venueId);
    
    if (!venue) {
      return res.status(404).json({ error: 'Venue not found' });
    }
    
    await venue.destroy();
    
    res.json({ message: 'Venue deleted successfully' });
  } catch (error) {
    console.error('Error deleting venue:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getUsers,
  getUserDetails,
  getReports,
  resolveReport,
  getVenues,
  createVenue,
  updateVenue,
  deleteVenue
};