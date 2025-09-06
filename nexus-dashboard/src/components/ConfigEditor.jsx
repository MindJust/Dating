import React, { useState, useEffect } from 'react';
import ApiService from '../services/api.service';

const ConfigEditor = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Charger la configuration au montage du composant
  useEffect(() => {
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

    loadConfig();
  }, []);

  // Gérer les changements dans les champs de texte
  const handleTextChange = (key, value) => {
    setConfig({
      ...config,
      textLabels: {
        ...config.textLabels,
        [key]: value
      }
    });
  };

  // Gérer les changements dans les feature flags
  const handleFlagChange = (key, value) => {
    setConfig({
      ...config,
      featureFlags: {
        ...config.featureFlags,
        [key]: value
      }
    });
  };

  // Gérer les changements dans les paramètres du moteur
  const handleEngineParamChange = (key, value) => {
    setConfig({
      ...config,
      engineParams: {
        ...config.engineParams,
        [key]: Number(value)
      }
    });
  };

  // Sauvegarder la configuration
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

  // Réinitialiser la configuration
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
    return <div>Chargement de la configuration...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!config) {
    return <div>Aucune configuration disponible.</div>;
  }

  return (
    <div className="config-editor">
      <h2>Éditeur de Configuration</h2>
      
      <div className="config-section">
        <h3>Feature Flags</h3>
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
      
      <div className="config-section">
        <h3>Textes & Labels</h3>
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
      
      <div className="config-section">
        <h3>Paramètres du Moteur</h3>
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
      
      <div className="config-actions">
        <button onClick={handleSave} disabled={saving}>
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
        <button onClick={handleReset}>Réinitialiser</button>
      </div>
    </div>
  );
};

export default ConfigEditor;