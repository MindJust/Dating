// Contrôleur d'authentification avec Supabase
const supabase = require('../config/database');

// Inscription avec email et mot de passe
const signUp = async (req, res) => {
  try {
    const { email, password, first_name } = req.body;
    
    // Valider les paramètres
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Inscrire l'utilisateur avec Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    // Créer l'utilisateur dans la table users
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: data.user.id,
          email: email,
          first_name: first_name || 'Nouvel utilisateur',
          trust_level: 1
        }
      ])
      .select()
      .single();
    
    if (userError) {
      return res.status(500).json({ error: userError.message });
    }
    
    // Créer un profil vide pour l'utilisateur
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          user_id: user.id
        }
      ]);
    
    if (profileError) {
      return res.status(500).json({ error: profileError.message });
    }
    
    res.json({
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        trust_level: user.trust_level
      }
    });
  } catch (error) {
    console.error('Error signing up:', error);
    res.status(500).json({ error: 'Failed to sign up' });
  }
};

// Connexion avec email et mot de passe
const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Valider les paramètres
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Connecter l'utilisateur avec Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    // Récupérer les informations de l'utilisateur
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (userError) {
      return res.status(500).json({ error: userError.message });
    }
    
    res.json({
      session: data.session,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        trust_level: user.trust_level,
        is_premium: user.is_premium,
        premium_expires_at: user.premium_expires_at
      }
    });
  } catch (error) {
    console.error('Error signing in:', error);
    res.status(500).json({ error: 'Failed to sign in' });
  }
};

// Connexion avec un fournisseur OAuth (Google, Facebook, etc.)
const signInWithOAuth = async (req, res) => {
  try {
    const { provider } = req.body;
    
    // Valider le fournisseur
    if (!provider) {
      return res.status(400).json({ error: 'Provider is required' });
    }
    
    // Vérifier que REDIRECT_URL est défini en production
    if (process.env.NODE_ENV === 'production' && !process.env.REDIRECT_URL) {
      return res.status(500).json({ error: 'OAuth redirect URL not configured' });
    }
    
    // Générer l'URL d'authentification OAuth
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: process.env.REDIRECT_URL || 'http://localhost:5173'
      }
    });
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json({ url: data.url });
  } catch (error) {
    console.error('Error signing in with OAuth:', error);
    res.status(500).json({ error: 'Failed to sign in with OAuth' });
  }
};

// Déconnexion
const signOut = async (req, res) => {
  try {
    // Déconnecter l'utilisateur
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.json({ message: 'Signed out successfully' });
  } catch (error) {
    console.error('Error signing out:', error);
    res.status(500).json({ error: 'Failed to sign out' });
  }
};

module.exports = {
  signUp,
  signIn,
  signInWithOAuth,
  signOut
};