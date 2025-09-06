// Modèle User avec Supabase
const supabase = require('../config/database');

// Fonction pour créer un utilisateur
const createUser = async (userData) => {
  const { data, error } = await supabase
    .from('users')
    .insert([userData])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

// Fonction pour trouver un utilisateur par ID
const findUserById = async (id) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

// Fonction pour trouver un utilisateur par email
const findUserByEmail = async (email) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

// Fonction pour mettre à jour un utilisateur
const updateUser = async (id, userData) => {
  const { data, error } = await supabase
    .from('users')
    .update(userData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

// Fonction pour vérifier si un utilisateur est un administrateur
const isAdmin = async (id) => {
  const { data, error } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', id)
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data.is_admin || false;
};

module.exports = {
  createUser,
  findUserById,
  findUserByEmail,
  updateUser,
  isAdmin
};