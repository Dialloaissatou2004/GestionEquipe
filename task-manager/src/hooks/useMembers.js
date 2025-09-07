import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const useMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configuration axios avec token d'authentification
  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Récupérer tous les membres
  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/auth/users`, {
        headers: getAuthHeaders()
      });
      
      // La réponse contient { success: true, count: number, users: array }
      const membersData = response.data.users || response.data || [];
      
      setMembers(Array.isArray(membersData) ? membersData : []);
    } catch (err) {
      console.error('❌ Error fetching members:', err);
      console.error('📋 Error response:', err.response?.data);
      console.error('🔍 Error status:', err.response?.status);
      
      setError(
        err.response?.data?.error || 
        'Erreur de connexion au serveur.'
      );
      setMembers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les membres au montage du composant
  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return {
    members,
    loading,
    error,
    refreshMembers: fetchMembers
  };
};
