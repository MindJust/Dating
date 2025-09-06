// Contrôleur de découverte
const { User, Profile, Match, Like } = require('../models');
const { Op } = require('sequelize');

// Récupérer le flux de découverte
const getDiscoveryFeed = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;
    
    // Récupérer l'ID de l'utilisateur courant
    const userId = req.user.id;
    
    // Trouver les utilisateurs qui n'ont pas encore été likés ou passés
    // et qui ne sont pas l'utilisateur courant
    const users = await User.findAndCountAll({
      where: {
        id: {
          [Op.ne]: userId
        },
        status: 'active'
      },
      include: [{
        model: Profile,
        as: 'profile'
      }],
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      profiles: users.rows.map(user => ({
        id: user.id,
        first_name: user.first_name,
        trust_level: user.trust_level,
        photos: user.profile?.photos || [],
        prompts: user.profile?.prompts || [],
        tags: user.profile?.tags || []
      })),
      totalPages: Math.ceil(users.count / limit),
      currentPage: parseInt(page),
      hasMore: offset + users.rows.length < users.count
    });
  } catch (error) {
    console.error('Error fetching discovery feed:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Récupérer les priorités du jour
const getDiscoveryPriorities = async (req, res) => {
  try {
    // Récupérer l'ID de l'utilisateur courant
    const userId = req.user.id;
    
    // Trouver les utilisateurs vérifiés (trust_level = 3) actifs
    const users = await User.findAll({
      where: {
        id: {
          [Op.ne]: userId
        },
        trust_level: 3,
        status: 'active'
      },
      include: [{
        model: Profile,
        as: 'profile'
      }],
      limit: 3, // Nombre de profils dans le deck "Priorités"
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      profiles: users.map(user => ({
        id: user.id,
        first_name: user.first_name,
        trust_level: user.trust_level,
        photos: user.profile?.photos || [],
        prompts: user.profile?.prompts || [],
        tags: user.profile?.tags || []
      }))
    });
  } catch (error) {
    console.error('Error fetching discovery priorities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Envoyer une action de découverte (like, pass)
const sendDiscoveryAction = async (req, res) => {
  try {
    const { action, profile_id } = req.body;
    const userId = req.user.id;
    
    // Vérifier si l'utilisateur cible existe
    const targetUser = await User.findByPk(profile_id);
    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Si l'action est "like", vérifier si c'est un match réciproque
    if (action === 'like') {
      // Vérifier si l'utilisateur a déjà liké ce profil
      const existingLike = await Like.findLike(userId, profile_id);
      
      if (!existingLike) {
        // Enregistrer le like
        await Like.createLike({
          user_id: userId,
          liked_user_id: profile_id
        });
      }
      
      // Vérifier si c'est un match réciproque
      const isMatch = await Like.isMutualLike(userId, profile_id);
      
      if (isMatch) {
        // Créer un match
        const match = await Match.create({
          user1_id: userId,
          user2_id: profile_id
        });
        
        res.json({
          match: true,
          matchId: match.id
        });
      } else {
        res.json({
          match: false
        });
      }
    } else {
      // Action "pass" - aucune action supplémentaire nécessaire
      res.json({
        match: false
      });
    }
  } catch (error) {
    console.error('Error sending discovery action:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getDiscoveryFeed,
  getDiscoveryPriorities,
  sendDiscoveryAction
};