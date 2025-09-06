// Modèle PremiumPlan avec Supabase
const supabase = require('../config/database');

// Fonction pour créer un plan premium
const createPremiumPlan = async (planData) => {
  const { data, error } = await supabase
    .from('premium_plans')
    .insert([planData])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

// Fonction pour trouver tous les plans premium actifs
const findAllActivePremiumPlans = async () => {
  const { data, error } = await supabase
    .from('premium_plans')
    .select('*')
    .eq('active', true)
    .order('price', { ascending: true });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

// Fonction pour trouver un plan premium par ID
const findPremiumPlanById = async (id) => {
  const { data, error } = await supabase
    .from('premium_plans')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

// Fonction pour mettre à jour un plan premium
const updatePremiumPlan = async (id, planData) => {
  const { data, error } = await supabase
    .from('premium_plans')
    .update(planData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

module.exports = {
  createPremiumPlan,
  findAllActivePremiumPlans,
  findPremiumPlanById,
  updatePremiumPlan
};