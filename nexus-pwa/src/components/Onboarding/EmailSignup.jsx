import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useConfig } from '../../context/ConfigContext';

const EmailSignup = () => {
  const { signUp } = useAuth();
  const { config } = useConfig();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password || !firstName) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await signUp(email, password, firstName);
      navigate('/discovery');
    } catch (err) {
      setError('Échec de l\'inscription. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-step">
      <h2>{config?.textLabels?.onboarding_welcome_title || 'Bienvenue sur Nexus'}</h2>
      <p>Créez votre compte pour commencer</p>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Prénom"
            required
          />
        </div>
        
        <div className="form-group">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adresse email"
            required
          />
        </div>
        
        <div className="form-group">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Inscription...' : 'S\'inscrire'}
        </button>
      </form>
    </div>
  );
};

export default EmailSignup;