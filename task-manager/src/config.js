// Configuration de l'application
const config = {
  // URL de base de l'API
  api: {
    // Utilisation de import.meta.env pour Vite au lieu de process.env
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    timeout: 30000, // 30 secondes
  },
  
  // Configuration de l'authentification
  auth: {
    tokenName: 'authToken',
    refreshTokenName: 'refreshToken',
    tokenExpiry: 24 * 60 * 60 * 1000, // 24 heures en millisecondes
    // Utilisation de import.meta.env pour les variables d'environnement Vite
    googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
    facebookAppId: import.meta.env.VITE_FACEBOOK_APP_ID || ''
  },
  
  // Configuration des messages
  messages: {
    itemsPerPage: 20,
    maxAttachmentSize: 5 * 1024 * 1024, // 5MB en octets
    allowedFileTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'text/plain'
    ],
  },
  
  // Configuration des tâches
  tasks: {
    itemsPerPage: 10,
    priorities: [
      { value: 'basse', label: 'Basse', color: 'bg-gray-200 text-gray-800' },
      { value: 'moyenne', label: 'Moyenne', color: 'bg-blue-100 text-blue-800' },
      { value: 'haute', label: 'Haute', color: 'bg-yellow-100 text-yellow-800' },
      { value: 'critique', label: 'Critique', color: 'bg-red-100 text-red-800' },
    ],
    statuses: [
      { value: 'a_faire', label: 'À faire', color: 'bg-gray-100 text-gray-800' },
      { value: 'en_cours', label: 'En cours', color: 'bg-blue-100 text-blue-800' },
      { value: 'en_revue', label: 'En revue', color: 'bg-yellow-100 text-yellow-800' },
      { value: 'termine', label: 'Terminé', color: 'bg-green-100 text-green-800' },
    ],
  },
  
  // Configuration des notifications
  notifications: {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  },
  
  // Configuration des thèmes
  themes: {
    light: {
      primary: '#3b82f6',
      secondary: '#6b7280',
      success: '#10b981',
      danger: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6',
      light: '#f3f4f6',
      dark: '#111827',
    },
    dark: {
      primary: '#60a5fa',
      secondary: '#9ca3af',
      success: '#34d399',
      danger: '#f87171',
      warning: '#fbbf24',
      info: '#60a5fa',
      light: '#4b5563',
      dark: '#f9fafb',
    },
  },
};

export default config;
