// Contrôleur de monétisation
const { User, PremiumPlan } = require('../models');

// Récupérer les plans premium
const getPremiumPlans = async (req, res) => {
  try {
    // Récupérer les plans premium depuis la base de données
    const plans = await PremiumPlan.findAllActivePremiumPlans();
    
    res.json(plans);
  } catch (error) {
    console.error('Error fetching premium plans:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// S'abonner à un plan premium
const subscribeToPremium = async (req, res) => {
  try {
    const { plan_id } = req.body;
    const userId = req.user.id;
    
    // Récupérer l'utilisateur
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Récupérer le plan premium
    const plan = await PremiumPlan.findPremiumPlanById(plan_id);
    
    if (!plan) {
      return res.status(400).json({ error: 'Invalid plan ID' });
    }
    
    // Calculer la date d'expiration
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + plan.duration_days);
    
    // Mettre à jour l'utilisateur
    await user.update({
      is_premium: true,
      premium_expires_at: expiresAt
    });
    
    res.json({
      message: 'Subscription successful',
      user: {
        id: user.id,
        is_premium: user.is_premium,
        premium_expires_at: user.premium_expires_at
      }
    });
  } catch (error) {
    console.error('Error subscribing to premium:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getPremiumPlans,
  subscribeToPremium
};