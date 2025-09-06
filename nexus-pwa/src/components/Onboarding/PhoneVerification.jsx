import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useConfig } from '../../context/ConfigContext';

const PhoneVerification = ({ onNext }) => {
  const { sendSMSCode } = useAuth();
  const { config } = useConfig();
  const [phone_number, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!phone_number) {
      setError('Veuillez entrer votre numéro de téléphone');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await sendSMSCode(phone_number);
      onNext(phone_number);
    } catch (err) {
      setError('Échec de l\'envoi du code de vérification. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-step">
      <h2>{config?.textLabels?.onboarding_welcome_title || 'Bienvenue sur Nexus'}</h2>
      <p>Entrez votre numéro de téléphone pour commencer</p>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="tel"
            value={phone_number}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Numéro de téléphone"
            required
          />
        </div>
        
        <button type="submit" disabled={loading}>
          {loading ? 'Envoi...' : 'Continuer'}
        </button>
      </form>
    </div>
  );
};

export default PhoneVerification;