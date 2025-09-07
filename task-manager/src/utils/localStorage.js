// Utilitaires pour la gestion du localStorage

export const localStorage = {
  // Sauvegarder des données
  setItem: (key, value) => {
    try {
      const serializedValue = JSON.stringify(value);
      window.localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde dans localStorage:', error);
    }
  },

  // Récupérer des données
  getItem: (key, defaultValue = null) => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Erreur lors de la lecture du localStorage:', error);
      return defaultValue;
    }
  },

  // Supprimer un élément
  removeItem: (key) => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error('Erreur lors de la suppression du localStorage:', error);
    }
  },

  // Vider tout le localStorage
  clear: () => {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Erreur lors du nettoyage du localStorage:', error);
    }
  },

  // Vérifier si une clé existe
  hasItem: (key) => {
    return window.localStorage.getItem(key) !== null;
  }
};

// Utilitaires spécifiques pour l'authentification
export const authStorage = {
  // Sauvegarder le token d'authentification
  setToken: (token) => {
    localStorage.setItem('authToken', token);
  },

  // Récupérer le token d'authentification
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  // Supprimer le token d'authentification
  removeToken: () => {
    localStorage.removeItem('authToken');
  },

  // Vérifier si l'utilisateur est connecté
  isAuthenticated: () => {
    return localStorage.hasItem('authToken');
  },

  // Sauvegarder les informations utilisateur
  setUser: (user) => {
    localStorage.setItem('user', user);
  },

  // Récupérer les informations utilisateur
  getUser: () => {
    return localStorage.getItem('user');
  },

  // Supprimer les informations utilisateur
  removeUser: () => {
    localStorage.removeItem('user');
  },

  // Déconnexion complète
  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
};

// Utilitaires pour les préférences utilisateur
export const preferencesStorage = {
  // Sauvegarder les préférences
  setPreferences: (preferences) => {
    localStorage.setItem('userPreferences', preferences);
  },

  // Récupérer les préférences
  getPreferences: () => {
    return localStorage.getItem('userPreferences', {
      theme: 'light',
      language: 'fr',
      tasksPerPage: 10,
      defaultSort: 'creeLe',
      defaultFilter: 'all'
    });
  },

  // Mettre à jour une préférence spécifique
  updatePreference: (key, value) => {
    const preferences = preferencesStorage.getPreferences();
    preferences[key] = value;
    preferencesStorage.setPreferences(preferences);
  }
};

export default localStorage;
