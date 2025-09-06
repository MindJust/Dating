import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/discovery');
    } else {
      navigate('/onboarding');
    }
  };

  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Nexus</h1>
        <p>La plateforme de rencontres du futur</p>
        <button className="cta-button" onClick={handleGetStarted}>
          Commencer
        </button>
      </div>
      
      <div className="features-section">
        <div className="feature">
          <h3>🔒 Sécurité</h3>
          <p>Trousse de sécurité intégrée pour des rencontres en toute confiance</p>
        </div>
        
        <div className="feature">
          <h3>🔄 Découverte</h3>
          <p>Double moteur de découverte pour trouver les profils qui comptent</p>
        </div>
        
        <div className="feature">
          <h3>📶 Hors-ligne</h3>
          <p>Accédez à vos conversations même sans connexion internet</p>
        </div>
      </div>
    </div>
  );
};

export default Home;