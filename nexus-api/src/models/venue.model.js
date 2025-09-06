// Modèle Venue avec Supabase
const supabase = require('../config/database');

// Fonction pour créer un lieu
const createVenue = async (venueData) => {
  const { data, error } = await supabase
    .from('venues')
    .insert([venueData])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

// Fonction pour trouver tous les lieux actifs
const findActiveVenues = async () => {
  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .eq('is_active', true);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

// Fonction pour mettre à jour un lieu
const updateVenue = async (id, venueData) => {
  const { data, error } = await supabase
    .from('venues')
    .update(venueData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

module.exports = {
  createVenue,
  findActiveVenues,
  updateVenue
};