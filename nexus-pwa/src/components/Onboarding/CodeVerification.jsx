import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const CodeVerification = ({ phone_number }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (code.length !== 6) {
      setError('Le code doit contenir 6 chiffres');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await login(phone_number, code);
      navigate('/discovery');
    } catch (err) {
      setError('Code de vérification incorrect. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-step">
      <h2>Vérification</h2>
      <p>Nous avons envoyé un code à {phone_number}</p>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Entrez le code à 6 chiffres"
            maxLength="6"
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Vérification...' : 'Continuer'}
        </button>
      </form>
    </div>
  );
};

export default CodeVerification;