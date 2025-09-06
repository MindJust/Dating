// Middleware d'authentification avec Supabase
const supabase = require('../config/database');
const { isAdmin } = require('../models/user.model');

// Middleware pour vérifier le token Supabase
const authenticate = async (req, res, next) => {
  try {
    // Récupérer le token depuis l'en-tête Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Access token is required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Vérifier le token avec Supabase
    const { data, error } = await supabase.auth.getUser(token);
    
    if (error || !data.user) {
      return res.status(401).json({ error: 'Invalid access token' });
    }
    
    // Récupérer l'utilisateur depuis la base de données
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid access token' });
    }
    
    // Attacher l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

// Middleware pour vérifier si l'utilisateur est un administrateur
const authorizeAdmin = async (req, res, next) => {
  try {
    // Vérifier si l'utilisateur a le rôle d'administrateur
    const userIsAdmin = await isAdmin(req.user.id);
    
    if (!userIsAdmin) {
      return res.status(403).json({ error: 'Access forbidden: Admins only' });
    }
    
    next();
  } catch (error) {
    console.error('Authorization error:', error);
    res.status(500).json({ error: 'Authorization failed' });
  }
};

module.exports = {
  authenticate,
  authorizeAdmin
};