// Configuration de Supabase
const { createClient } = require('@supabase/supabase-js');

// Créer le client Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = supabase;