import React, { useState, useEffect } from 'react';

const Premium = () => {
  const [isMonetizationActive, setIsMonetizationActive] = useState(true);
  const [plans, setPlans] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPremiumData();
  }, []);

  const loadPremiumData = async () => {
    try {
      // Dans une implémentation réelle, vous feriez une requête API ici
      // Pour cette démonstration, nous simulons les données
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Données simulées
      const mockPlans = [
        { id: 1, name: 'Nexus Mensuel', price: 9.99, duration_days: 30 },
        { id: 2, name: 'Nexus Trimestriel', price: 24.99, duration_days: 90 },
        { id: 3, name: 'Nexus Annuel', price: 79.99, duration_days: 365 }
      ];
      
      const mockFeatures = [
        'Voir les likes reçus',
        'Filtres de recherche avancés',
        'Mode Incognito',
        'Boost de profil hebdomadaire'
      ];
      
      setPlans(mockPlans);
      setSelectedFeatures(mockFeatures);
    } catch (error) {
      console.error('Failed to load premium data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMonetization = () => {
    setIsMonetizationActive(!isMonetizationActive);
  };

  const handleFeatureToggle = (feature) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  const allFeatures = [
    'Voir les likes reçus',
    'Filtres de recherche avancés',
    'Mode Incognito',
    'Boost de profil hebdomadaire',
    'Profil en vedette',
    'Annulation de match',
    'Messages prioritaires'
  ];

  if (loading) {
    return <div className="premium-page">Chargement...</div>;
  }

  return (
    <div className="premium-page">
      <div className="page-header">
        <h1>Gestion de la monétisation</h1>
      </div>
      
      <div className="monetization-toggle">
        <h2>Activation globale</h2>
        <div className="toggle-switch">
          <label>
            <input
              type="checkbox"
              checked={isMonetizationActive}
              onChange={handleToggleMonetization}
            />
            <span className="slider"></span>
          </label>
          <span className="toggle-label">
            {isMonetizationActive ? 'Monétisation activée' : 'Monétisation désactivée'}
          </span>
        </div>
      </div>
      
      <div className="plans-section">
        <h2>Plans d'abonnement</h2>
        <div className="plans-grid">
          {plans.map(plan => (
            <div key={plan.id} className="plan-card">
              <h3>{plan.name}</h3>
              <div className="plan-price">
                <span className="amount">{plan.price.toFixed(2)}€</span>
                <span className="duration">/ {plan.duration_days} jours</span>
              </div>
              <button className="btn btn-secondary">Modifier</button>
              <button className="btn btn-danger">Supprimer</button>
            </div>
          ))}
        </div>
        <button className="btn btn-primary">Ajouter un plan</button>
      </div>
      
      <div className="features-section">
        <h2>Fonctionnalités Premium</h2>
        <div className="features-list">
          {allFeatures.map((feature, index) => (
            <div key={index} className="feature-item">
              <label>
                <input
                  type="checkbox"
                  checked={selectedFeatures.includes(feature)}
                  onChange={() => handleFeatureToggle(feature)}
                />
                {feature}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Premium;