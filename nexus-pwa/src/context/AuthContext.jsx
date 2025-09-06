import React, { createContext, useState, useContext, useEffect } from 'react';
import AuthService from '../services/auth.service';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier l'état d'authentification actuel
    const checkAuthState = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuthState();
    
    // Écouter les changements d'état d'authentification
    const { data: authListener } = AuthService.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user || null);
      }
    );
    
    // Nettoyer l'écouteur
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email, password, firstName) => {
    try {
      const data = await AuthService.signUp(email, password, firstName);
      setUser(data.user);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      const data = await AuthService.signIn(email, password);
      setUser(data.user);
      setSession(data.session);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const signInWithOAuth = async (provider) => {
    try {
      const data = await AuthService.signInWithOAuth(provider);
      // La redirection se fera automatiquement
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthService.signOut();
      setUser(null);
      setSession(null);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signInWithOAuth,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};