// Modèle AppConfig avec Supabase
const supabase = require('../config/database');

// Fonction pour obtenir une valeur de configuration
const getConfigValue = async (key) => {
  const { data, error } = await supabase
    .from('app_config')
    .select('value')
    .eq('key', key)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data ? data.value : null;
};

// Fonction pour définir une valeur de configuration
const setConfigValue = async (key, value, description = '') => {
  const { data, error } = await supabase
    .from('app_config')
    .upsert({ key, value, description })
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

// Fonction pour obtenir toutes les configurations
const getAllConfig = async () => {
  const { data, error } = await supabase
    .from('app_config')
    .select('*');
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

module.exports = {
  getConfigValue,
  setConfigValue,
  getAllConfig
};