// Modèle Profile avec Supabase
const supabase = require('../config/database');

// Fonction pour créer un profil
const createProfile = async (profileData) => {
  const { data, error } = await supabase
    .from('profiles')
    .insert([profileData])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

// Fonction pour trouver un profil par user_id
const findProfileByUserId = async (user_id) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user_id)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

// Fonction pour mettre à jour un profil
const updateProfile = async (user_id, profileData) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(profileData)
    .eq('user_id', user_id)
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

module.exports = {
  createProfile,
  findProfileByUserId,
  updateProfile
};