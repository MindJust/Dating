import React, { createContext, useState, useEffect, useContext } from 'react';
import ApiService from '../services/api.service';

const ConfigContext = createContext();

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};

export const ConfigProvider = ({ children }) => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getConfig();
        setConfig(data);
      } catch (err) {
        setError(err);
        console.error('Failed to load config:', err);
      } finally {
        setLoading(false);
      }
    };

    loadConfig();
  }, []);

  const value = {
    config,
    loading,
    error,
    setConfig
  };

  return (
    <ConfigContext.Provider value={value}>
      {children}
    </ConfigContext.Provider>
  );
};