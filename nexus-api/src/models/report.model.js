// Modèle Report avec Supabase
const supabase = require('../config/database');

// Fonction pour créer un signalement
const createReport = async (reportData) => {
  const { data, error } = await supabase
    .from('reports')
    .insert([reportData])
    .select()
    .single();
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

// Fonction pour trouver les signalements par statut
const findReportsByStatus = async (status) => {
  const { data, error } = await supabase
    .from('reports')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

// Fonction pour mettre à jour le statut d'un signalement
const updateReportStatus = async (id, status) => {
  const { data, error } = await supabase
    .from('reports')
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
  createReport,
  findReportsByStatus,
  updateReportStatus
};