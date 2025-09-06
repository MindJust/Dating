// Modèle Message avec Supabase
const supabase = require('../config/database');

// Fonction pour créer un message
const createMessage = async (messageData) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([messageData])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

// Fonction pour trouver les messages d'un match
const findMessagesByMatchId = async (match_id) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('match_id', match_id)
    .order('created_at', { ascending: true });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

// Fonction pour mettre à jour le statut d'un message
const updateMessageStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('messages')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

module.exports = {
  createMessage,
  findMessagesByMatchId,
  updateMessageStatus
};