import axios from 'axios';

// Configuration de l'URL de base selon l'environnement
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://gestionequipe-2.onrender.com/api';

// Création d'une instance Axios personnalisée
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false, // Désactivé car nous gérons manuellement les en-têtes
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Ajout d'en-têtes CORS pour les requêtes non-simples
    if (config.method !== 'get' && config.method !== 'head') {
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
    }
    
    return config;
  },
  (error) => {
    console.error('Erreur dans l\'intercepteur de requête:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => {
    // Vous pouvez ajouter ici un traitement global des réponses réussies si nécessaire
    return response;
  },
  (error) => {
    console.error('Erreur API:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
      },
    });

    // Gestion des erreurs 401 (non autorisé)
    if (error.response && error.response.status === 401) {
      console.log('Déconnexion en raison d\'une erreur 401');
      localStorage.removeItem('authToken');
      // Éviter les boucles de redirection
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    // Pour les autres erreurs, renvoyer une réponse plus descriptive
    if (error.response) {
      // Le serveur a répondu avec un statut hors de la plage 2xx
      return Promise.reject({
        message: error.response.data?.message || 'Une erreur est survenue',
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      // La requête a été faite mais aucune réponse n'a été reçue
      return Promise.reject({
        message: 'Aucune réponse du serveur. Vérifiez votre connexion internet.',
        isNetworkError: true
      });
    } else {
      // Une erreur s'est produite lors de la configuration de la requête
      return Promise.reject({
        message: 'Erreur de configuration de la requête: ' + error.message
      });
    }
  }
);

export default api;
