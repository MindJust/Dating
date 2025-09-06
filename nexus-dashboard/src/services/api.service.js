// Service API pour le Nexus Superadmin Dashboard

class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';
  }

  // Effectuer une requête API
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Définir le content-type par défaut
    if (!options.headers) {
      options.headers = {};
    }
    if (!options.headers['Content-Type'] && options.body) {
      options.headers['Content-Type'] = 'application/json';
    }
    
    // Ajouter le token d'authentification
    const token = localStorage.getItem('adminToken');
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
    
    // Convertir le body en JSON si nécessaire
    if (options.body && typeof options.body === 'object') {
      options.body = JSON.stringify(options.body);
    }
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
  
  // Récupérer la configuration de l'application
  async getConfig() {
    return this.request('/config');
  }
  
  // Mettre à jour la configuration de l'application
  async updateConfig(config) {
    return this.request('/config', {
      method: 'PUT',
      body: config
    });
  }
  
  // Réinitialiser la configuration de l'application
  async resetConfig() {
    return this.request('/config', {
      method: 'DELETE'
    });
  }
}

export default new ApiService();