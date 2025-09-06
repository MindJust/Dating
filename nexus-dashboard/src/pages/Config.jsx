import React, { useState, useEffect } from 'react';
import ApiService from '../services/api.service';

const Config = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadConfig();
  }, []);

  const loadConfig = async () => {
    try {
      const data = await ApiService.getConfig();
      setConfig(data);
    } catch (err) {
      setError('Erreur lors du chargement de la configuration.');
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (key, value) => {
    setConfig({
      ...config,
      textLabels: {
        ...config.textLabels,
        [key]: value
      }
    });
  };

  const handleFlagChange = (key, value) => {
    setConfig({
      ...config,
      featureFlags: {
        ...config.featureFlags,
        [key]: value
      }
    });
  };

  const handleEngineParamChange = (key, value) => {
    setConfig({
      ...config,
      engineParams: {
        ...config.engineParams,
        [key]: Number(value)
      }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    
    try {
      await ApiService.updateConfig(config);
      alert('Configuration sauvegardée avec succès.');
    } catch (err) {
      setError('Erreur lors de la sauvegarde de la configuration.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser la configuration ?')) {
      try {
        await ApiService.resetConfig();
        // Recharger la configuration après réinitialisation
        const data = await ApiService.getConfig();
        setConfig(data);
        alert('Configuration réinitialisée avec succès.');
      } catch (err) {
        setError('Erreur lors de la réinitialisation de la configuration.');
      }
    }
  };

  if (loading) {
    return <div className="config-page">Chargement de la configuration...</div>;
  }

  if (error) {
    return <div className="config-page error">{error}</div>;
  }

  if (!config) {
    return <div className="config-page">Aucune configuration disponible.</div>;
  }

  return (
    <div className="config-page">
      <div className="page-header">
        <h1>Configuration de l'application</h1>
      </div>
      
      <div className="config-section">
        <h2>Feature Flags</h2>
        <div className="config-grid">
          {Object.entries(config.featureFlags).map(([key, value]) => (
            <div key={key} className="config-item">
              <label>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handleFlagChange(key, e.target.checked)}
                />
                {key}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="config-section">
        <h2>Textes & Labels</h2>
        <div className="config-grid">
          {Object.entries(config.textLabels).map(([key, value]) => (
            <div key={key} className="config-item">
              <label>
                {key}:
                <input
                  type="text"
                  value={value}
                  onChange={(e) => handleTextChange(key, e.target.value)}
                />
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="config-section">
        <h2>Paramètres du Moteur</h2>
        <div className="config-grid">
          {Object.entries(config.engineParams).map(([key, value]) => (
            <div key={key} className="config-item">
              <label>
                {key}:
                <input
                  type="number"
                  value={value}
                  onChange={(e) => handleEngineParamChange(key, e.target.value)}
                />
              </label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="config-actions">
        <button 
          className="btn btn-primary" 
          onClick={handleSave} 
          disabled={saving}
        >
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
        <button className="btn btn-secondary" onClick={handleReset}>
          Réinitialiser
        </button>
      </div>
    </div>
  );
};

export default Config;