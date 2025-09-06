// Contrôleur des utilisateurs
const { User, Profile } = require('../models');

// Récupérer le profil de l'utilisateur courant
const getCurrentUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Récupérer l'utilisateur avec son profil
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
    console.error('Error fetching current user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mettre à jour le profil de l'utilisateur courant
const updateCurrentUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { first_name, photos, prompts, tags, intention } = req.body;
    
    // Mettre à jour l'utilisateur
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    if (first_name) {
      await user.update({ first_name });
    }
    
    // Mettre à jour le profil
    const profile = await Profile.findByPk(userId);
    
    if (profile) {
      await profile.update({
        photos,
        prompts,
        tags,
        intention
      });
    } else {
      // Créer un profil si aucun n'existe
      await Profile.create({
        user_id: userId,
        photos,
        prompts,
        tags,
        intention
      });
    }
    
    // Récupérer l'utilisateur mis à jour avec son profil
    const updatedUser = await User.findByPk(userId, {
      include: [{
        model: Profile,
        as: 'profile'
      }]
    });
    
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating current user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mettre à jour le niveau de confiance d'un utilisateur
const updateUserTrustLevel = async (req, res) => {
  try {
    const { userId } = req.params;
    const { trust_level } = req.body;
    
    // Valider le niveau de confiance
    if (![1, 2, 3].includes(trust_level)) {
      return res.status(400).json({ error: 'Invalid trust level. Must be 1, 2, or 3.' });
    }
    
    // Mettre à jour l'utilisateur
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    await user.update({ trust_level });
    
    res.json({
      message: 'User trust level updated successfully',
      user: {
        id: user.id,
        trust_level: user.trust_level
      }
    });
  } catch (error) {
    console.error('Error updating user trust level:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getCurrentUserProfile,
  updateCurrentUserProfile,
  updateUserTrustLevel
};