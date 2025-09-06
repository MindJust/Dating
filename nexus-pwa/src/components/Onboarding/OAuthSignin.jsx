import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';

const OAuthSignin = () => {
  const { signInWithOAuth } = useAuth();
  const { config } = useConfig();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOAuthSignIn = async (provider) => {
    setLoading(true);
    setError('');
    
    try {
      await signInWithOAuth(provider);
    } catch (err) {
      setError('Échec de la connexion. Veuillez réessayer.');
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-step">
      <h2>{config?.textLabels?.onboarding_welcome_title || 'Bienvenue sur Nexus'}</h2>
      <p>Connectez-vous avec l'un de ces services</p>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="oauth-buttons">
        <button 
          className="oauth-button google"
          onClick={() => handleOAuthSignIn('google')}
          disabled={loading}
        >
          <span className="oauth-icon">G</span>
          Continuer avec Google
        </button>
        
        <button 
          className="oauth-button facebook"
          onClick={() => handleOAuthSignIn('facebook')}
          disabled={loading}
        >
          <span className="oauth-icon">f</span>
          Continuer avec Facebook
        </button>
        
        <button 
          className="oauth-button github"
          onClick={() => handleOAuthSignIn('github')}
          disabled={loading}
        >
          <span className="oauth-icon">G</span>
          Continuer avec GitHub
        </button>
      </div>
      
      <div className="divider">
        <span>ou</span>
      </div>
      
      <div className="auth-links">
        <a href="/signin">Se connecter avec email</a>
        <a href="/signup">S'inscrire avec email</a>
      </div>
    </div>
  );
};

export default OAuthSignin;