import React, { useState, useEffect } from 'react';
import { useConfig } from '../../context/ConfigContext';
import ApiService from '../../services/api.service';

const PremiumPlans = () => {
  const { config } = useConfig();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    if (!config?.featureFlags?.isMonetizationActive) return;
    
    setLoading(true);
    
    try {
      const data = await ApiService.getPremiumPlans();
      setPlans(data);
    } catch (error) {
      console.error('Failed to load premium plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId) => {
    try {
      await ApiService.subscribeToPremium(planId);
      alert('Abonnement réussi !');
    } catch (error) {
      console.error('Failed to subscribe:', error);
      alert('Échec de l\'abonnement. Veuillez réessayer.');
    }
  };

  if (!config?.featureFlags?.isMonetizationActive) {
    return (
      <div className="premium-plans">
        <h2>Nexus Premium</h2>
        <div className="info-message">
          <p>La fonctionnalité Premium est actuellement désactivée.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="premium-plans">
      <h2>Nexus Premium</h2>
      
      {loading && (
        <div className="loading">Chargement...</div>
      )}
      
      <div className="plans-list">
        {plans.map(plan => (
          <div key={plan.id} className="plan-card">
            <h3>{plan.name}</h3>
            <div className="plan-price">
              <span className="amount">{plan.price}</span>
              <span className="duration">/ {plan.duration_days} jours</span>
            </div>
            <ul className="plan-features">
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button 
              className="subscribe-button"
              onClick={() => handleSubscribe(plan.id)}
            >
              S'abonner
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PremiumPlans;