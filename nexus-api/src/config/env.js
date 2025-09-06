// Module de validation des variables d'environnement
require('dotenv').config();

// Validation des variables d'environnement
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'JWT_SECRET',
  'REFRESH_TOKEN_SECRET'
];

// Variables requises en production
const requiredInProduction = [
  'REDIRECT_URL',
  'CORS_ORIGIN'
];

const validateEnvVars = () => {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (process.env.NODE_ENV === 'production') {
    const missingProd = requiredInProduction.filter(envVar => !process.env[envVar]);
    if (missingProd.length > 0) {
      throw new Error(`Missing required environment variables in production: ${missingProd.join(', ')}`);
    }
  }
};

module.exports = { validateEnvVars };