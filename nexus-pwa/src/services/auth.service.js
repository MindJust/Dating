// Service d'authentification pour l'application Nexus PWA avec Supabase
import { createClient } from '@supabase/supabase-js';

// Initialiser le client Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

class AuthService {
  // Inscription avec email et mot de passe
  async signUp(email, password, firstName) {
    try {
      // Inscrire l'utilisateur avec Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    }
  }

  // Connexion avec email et mot de passe
  async signIn(email, password) {
    try {
      // Connecter l'utilisateur avec Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  }

  // Connexion avec un fournisseur OAuth
  async signInWithOAuth(provider) {
    try {
      // Générer l'URL d'authentification OAuth
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('OAuth sign in failed:', error);
      throw error;
    }
  }

  // Déconnexion
  async signOut() {
    try {
      // Déconnecter l'utilisateur
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new Error(error.message);
      }

      return { message: 'Signed out successfully' };
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  }

  // Obtenir l'utilisateur actuel
  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Get current user failed:', error);
      throw error;
    }
  }

  // Écouter les changements d'état d'authentification
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export default new AuthService();