// Modèle Like avec Supabase
const supabase = require('../config/database');

// Fonction pour créer un like
const createLike = async (likeData) => {
  const { data, error } = await supabase
    .from('likes')
    .insert([likeData])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

// Fonction pour trouver un like par utilisateur et utilisateur liké
const findLike = async (user_id, liked_user_id) => {
  const { data, error } = await supabase
    .from('likes')
    .select('*')
    .eq('user_id', user_id)
    .eq('liked_user_id', liked_user_id)
    .single();
  
  if (error) {
    // Si l'erreur est "no rows returned", cela signifie que le like n'existe pas
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(error.message);
  }
  
  return data;
};

// Fonction pour vérifier si un utilisateur a liké un autre utilisateur
const isMutualLike = async (user_id, liked_user_id) => {
  // Vérifier si l'utilisateur liké a déjà liké l'utilisateur courant
  const mutualLike = await findLike(liked_user_id, user_id);
  return !!mutualLike;
};

module.exports = {
  createLike,
  findLike,
  isMutualLike
};