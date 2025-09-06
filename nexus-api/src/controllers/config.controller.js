// Contrôleur de configuration
const { AppConfig } = require('../models');

// Récupérer la configuration de l'application
const getConfig = async (req, res) => {
  try {
    // Récupérer toutes les configurations
    const configs = await AppConfig.findAll();
    
    // Organiser les configurations par catégorie
    const configObject = {
      featureFlags: {},
      textLabels: {},
      engineParams: {},
      profilePrompts: []
    };
    
    configs.forEach(config => {
      // Feature flags
      if (config.key.startsWith('feature_')) {
        configObject.featureFlags[config.key] = config.value === 'true';
      }
      // Textes et labels
      else if (config.key.startsWith('text_') || 
               config.key === 'onboarding_welcome_title' || 
               config.key === 'like_button_label') {
        configObject.textLabels[config.key] = config.value;
      }
      // Paramètres du moteur
      else if (config.key.startsWith('param_') || 
               config.key === 'priorities_deck_size' || 
               config.key === 'message_cache_duration_days' || 
               config.key === 'profile_cache_duration_hours' || 
               config.key === 'verified_profile_boost') {
        // Convertir en nombre si possible
        const numValue = Number(config.value);
        configObject.engineParams[config.key] = isNaN(numValue) ? config.value : numValue;
      }
      // Prompts de profil
      else if (config.key.startsWith('profile_prompt_')) {
        configObject.profilePrompts.push({
          id: parseInt(config.key.split('_')[2]),
          text: config.value
        });
      }
    });
    
    // Trier les prompts par ID
    configObject.profilePrompts.sort((a, b) => a.id - b.id);
    
    res.json(configObject);
  } catch (error) {
    console.error('Error fetching config:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Mettre à jour la configuration de l'application
const updateConfig = async (req, res) => {
  try {
    const { featureFlags, textLabels, engineParams } = req.body;
    
    // Mettre à jour les feature flags
    if (featureFlags) {
      for (const [key, value] of Object.entries(featureFlags)) {
        await AppConfig.upsert({
          key: `feature_${key}`,
          value: value.toString(),
          description: `Feature flag: ${key}`
        });
      }
    }
    
    // Mettre à jour les textes et labels
    if (textLabels) {
      for (const [key, value] of Object.entries(textLabels)) {
        await AppConfig.upsert({
          key,
          value: value.toString(),
          description: `Text label: ${key}`
        });
      }
    }
    
    // Mettre à jour les paramètres du moteur
    if (engineParams) {
      for (const [key, value] of Object.entries(engineParams)) {
        await AppConfig.upsert({
          key: `param_${key}`,
          value: value.toString(),
          description: `Engine parameter: ${key}`
        });
      }
    }
    
    res.json({ message: 'Configuration updated successfully' });
  } catch (error) {
    console.error('Error updating config:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Réinitialiser la configuration de l'application
const resetConfig = async (req, res) => {
  try {
    // Supprimer toutes les configurations personnalisées
    await AppConfig.destroy({
      where: {
        key: {
          [Sequelize.Op.notIn]: [
            'onboarding_welcome_title',
            'like_button_label',
            'priorities_deck_size',
            'message_cache_duration_days',
            'profile_cache_duration_hours',
            'verified_profile_boost',
            'profile_prompt_1',
            'profile_prompt_2',
            'profile_prompt_3',
            'profile_prompt_4'
          ]
        }
      }
    });
    
    res.json({ message: 'Configuration reset successfully' });
  } catch (error) {
    console.error('Error resetting config:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getConfig,
  updateConfig,
  resetConfig
};