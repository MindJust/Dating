// Modèle Match avec Supabase
const supabase = require('../config/database');

// Fonction pour créer un match
const createMatch = async (matchData) => {
  const { data, error } = await supabase
    .from('matches')
    .insert([matchData])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

// Fonction pour trouver un match par ID
const findMatchById = async (id) => {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

// Fonction pour trouver les matchs d'un utilisateur
const findMatchesByUserId = async (user_id) => {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .or(`user1_id.eq.${user_id},user2_id.eq.${user_id}`)
    .eq('status', 'active');
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

module.exports = {
  createMatch,
  findMatchById,
  findMatchesByUserId
};