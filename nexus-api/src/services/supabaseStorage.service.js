// Service de stockage avec Supabase Storage
const supabase = require('../config/database');

// Fonction pour uploader un fichier
const uploadFile = async (bucketName, filePath, fileBuffer, fileOptions = {}) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filePath, fileBuffer, {
      cacheControl: '3600',
      upsert: false,
      ...fileOptions
    });
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

// Fonction pour télécharger un fichier
const downloadFile = async (bucketName, filePath) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .download(filePath);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

// Fonction pour obtenir l'URL publique d'un fichier
const getPublicUrl = async (bucketName, filePath) => {
  const { data } = await supabase.storage
    .from(bucketName)
    .getPublicUrl(filePath);
  
  return data.publicUrl;
};

// Fonction pour supprimer un fichier
const deleteFile = async (bucketName, filePath) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .remove([filePath]);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

// Fonction pour lister les fichiers d'un bucket
const listFiles = async (bucketName, options = {}) => {
  const { data, error } = await supabase.storage
    .from(bucketName)
    .list(null, options);
  
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

module.exports = {
  uploadFile,
  downloadFile,
  getPublicUrl,
  deleteFile,
  listFiles
};