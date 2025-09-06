// Service API pour l'application Nexus PWA avec Supabase
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

// Initialiser le client Supabase
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api/v1';
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000
    });
    
    // Intercepteur pour ajouter le token d'authentification
    this.client.interceptors.request.use(
      async (config) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          config.headers.Authorization = `Bearer ${session.access_token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    
    // Intercepteur pour gérer les erreurs d'authentification
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Vérifier si l'utilisateur est toujours connecté
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            // Réessayer la requête originale avec le nouveau token
            error.config.headers.Authorization = `Bearer ${session.access_token}`;
            return this.client.request(error.config);
          } else {
            // Déconnecter l'utilisateur
            localStorage.removeItem('user');
            window.location.href = '/onboarding';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Effectuer une requête API
  async request(endpoint, options = {}) {
    try {
      const response = await this.client.request({
        url: endpoint,
        ...options
      });
      return response.data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
  
  // Récupérer la configuration de l'application
  async getConfig() {
    return this.request('/config');
  }
  
  // Récupérer le flux de découverte
  async getDiscoveryFeed(page = 1) {
    return this.request(`/discovery/feed?page=${page}`);
  }
  
  // Récupérer les priorités du jour
  async getDiscoveryPriorities() {
    return this.request('/discovery/priorities');
  }
  
  // Envoyer une action de découverte (like, pass)
  async sendDiscoveryAction(action, profileId) {
    return this.request('/discovery/actions', {
      method: 'POST',
      data: { action, profile_id: profileId }
    });
  }
  
  // Récupérer les matchs
  async getMatches() {
    return this.request('/matches');
  }
  
  // Récupérer les messages d'un match
  async getMessages(matchId) {
    return this.request(`/matches/${matchId}/messages`);
  }
  
  // Envoyer un message
  async sendMessage(matchId, content) {
    return this.request(`/matches/${matchId}/messages`, {
      method: 'POST',
      data: { content }
    });
  }
  
  // Récupérer le profil de l'utilisateur courant
  async getCurrentUserProfile() {
    return this.request('/users/me');
  }
  
  // Mettre à jour le profil de l'utilisateur courant
  async updateCurrentUserProfile(data) {
    return this.request('/users/me', {
      method: 'PUT',
      data
    });
  }
  
  // Récupérer un profil utilisateur
  async getUserProfile(userId) {
    return this.request(`/users/${userId}`);
  }
  
  // Rafraîchir le token JWT
  async refreshToken(refreshToken) {
    return this.request('/auth/refresh', {
      method: 'POST',
      data: { refreshToken }
    });
  }
  
  // Récupérer les lieux sûrs
  async getSafetyVenues() {
    return this.request('/safety/venues');
  }
  
  // Signaler un utilisateur
  async reportUser(reportedId, reason, details) {
    return this.request('/safety/reports', {
      method: 'POST',
      data: { reported_id: reportedId, reason, details }
    });
  }
  
  // Récupérer les plans premium
  async getPremiumPlans() {
    return this.request('/premium/plans');
  }
  
  // S'abonner à un plan premium
  async subscribeToPremium(planId) {
    return this.request('/premium/subscribe', {
      method: 'POST',
      data: { plan_id: planId }
    });
  }
  
  // Supabase Storage: Upload d'un fichier
  async uploadFile(bucketName, filePath, file, fileOptions = {}) {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        ...fileOptions
      });
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  }
  
  // Supabase Storage: Obtenir l'URL publique d'un fichier
  async getPublicUrl(bucketName, filePath) {
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  }
  
  // Supabase Storage: Télécharger un fichier
  async downloadFile(bucketName, filePath) {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .download(filePath);
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  }
  
  // Supabase Storage: Supprimer un fichier
  async deleteFile(bucketName, filePath) {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .remove([filePath]);
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  }
  
  // Supabase Database: Obtenir la configuration de l'application
  async getAppConfig() {
    const { data, error } = await supabase
      .from('app_config')
      .select('*');
    
    if (error) {
      throw new Error(error.message);
    }
    
    // Convertir le tableau en objet avec les clés comme propriétés
    const config = {};
    data.forEach(item => {
      config[item.key] = item.value;
    });
    
    return config;
  }
  
  // Supabase Database: Obtenir le profil de l'utilisateur courant
  async getCurrentUserProfileFromDB() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }
    
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        profiles(*)
      `)
      .eq('id', user.id)
      .single();
    
    if (error) {
      throw new Error(error.message);
    }
    
    return data;
  }
}

export default new ApiService();