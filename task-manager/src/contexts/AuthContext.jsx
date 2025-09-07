import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);

  // Vérifier si l'utilisateur est déjà connecté au chargement initial
  useEffect(() => {
    const checkAuthStatus = async () => {
      const savedToken = localStorage.getItem('authToken');
      if (!savedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/api/auth/me');
        const userData = response.data.user; // Accéder à response.data.user au lieu de response.data
        
        setUser({
          ...userData,
          id: userData._id || userData.id,
        });
      } catch (err) {
        console.error('Erreur de vérification du token:', err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []); // Exécuté une seule fois au montage

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  const login = async (email, motDePasse) => {
    try {
      const response = await api.post('/api/auth/login', { email, motDePasse });
      const { token: newToken, user: userData } = response.data;

      // Normalisation des données utilisateur
      const normalizedUser = { 
        ...userData,
        id: userData._id || userData.id,
      };

      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      setUser(normalizedUser);
      
      // Supprimer le rechargement automatique qui cause des problèmes
      // window.location.reload();
      
      return { success: true, user: normalizedUser };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur de connexion'
      };
    }
  };

  const register = async (userData) => {
    try {
      const isFormData = userData instanceof FormData;
      const config = isFormData 
        ? { headers: { 'Content-Type': 'multipart/form-data' } }
        : {};
      
      const response = await api.post('/api/auth/register', userData, config);
      const { token: newToken, user: newUser } = response.data;

      // Normalisation des données utilisateur
      const normalizedUser = { 
        ...newUser,
        id: newUser._id || newUser.id,
      };

      localStorage.setItem('authToken', newToken);
      setToken(newToken);
      setUser(normalizedUser);
      
      return { success: true, user: normalizedUser };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Erreur lors de l\'inscription'
      };
    }
  };

  const logout = () => {
    handleLogout();
  };
  
  // Calculer isAuthenticated en fonction de la présence du token
  const isAuthenticated = !!token;

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAdmin,
    isAuthenticated // Utilisation de la variable calculée
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
