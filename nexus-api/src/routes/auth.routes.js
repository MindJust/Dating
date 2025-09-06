// Routes d'authentification avec Supabase
const express = require('express');
const { signUp, signIn, signInWithOAuth, signOut } = require('../controllers/auth.controller');

const router = express.Router();

// Inscription avec email et mot de passe
router.post('/signup', signUp);

// Connexion avec email et mot de passe
router.post('/signin', signIn);

// Connexion avec un fournisseur OAuth
router.post('/oauth', signInWithOAuth);

// Déconnexion
router.post('/signout', signOut);

module.exports = router;