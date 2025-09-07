import { useState, useEffect, useCallback, useMemo } from 'react';
import api from '../api/axios'; // Utiliser l'instance axios configurée

const API_BASE_URL = '/api';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);

  // Configuration axios avec token d'authentification
  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  // Cache simple pour éviter les requêtes répétées
  const shouldRefetch = useCallback(() => {
    if (!lastFetch) return true;
    const now = Date.now();
    const CACHE_DURATION = 30000; // 30 secondes
    return (now - lastFetch) > CACHE_DURATION;
  }, [lastFetch]);

  // Récupérer les tâches avec pagination et filtrage optimisé
  const fetchTasks = useCallback(async (page = 1, limit = 20) => {
    try {
      // Éviter les requêtes répétées si les données sont récentes
      if (page === 1 && !shouldRefetch() && tasks.length > 0) {
        return { tasks, pagination: {} };
      }

      setLoading(true);
      setError(null);
      
      const response = await api.get(`${API_BASE_URL}/tasks`, {
        params: { page, limit },
        headers: getAuthHeaders(),
        timeout: 8000 // Réduire le timeout à 8 secondes
      });
      
      // Gérer la réponse paginée
      if (response.data && response.data.tasks) {
        setLastFetch(Date.now());
        return {
          tasks: response.data.tasks,
          pagination: response.data.pagination || {}
        };
      }
      
      throw new Error('Format de réponse inattendu');
    } catch (err) {
      console.error('Erreur lors de la récupération des tâches:', err);
      const errorMessage = err.code === 'ECONNABORTED' 
        ? 'Timeout: Le serveur met trop de temps à répondre'
        : err.response?.data?.error || 'Erreur de connexion au serveur. Vérifiez que le backend est démarré sur le port 5000.';
      
      setError(errorMessage);
      return { tasks: [], pagination: {} };
    } finally {
      setLoading(false);
    }
  }, [getAuthHeaders, shouldRefetch, tasks]);

  // Créer une nouvelle tâche avec mise à jour optimiste
  const createTask = useCallback(async (taskData) => {
    try {
      const response = await api.post(`${API_BASE_URL}/tasks`, taskData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });
      
      const newTask = response.data;
      setTasks(prevTasks => [newTask, ...prevTasks]);
      setLastFetch(Date.now()); // Mettre à jour le cache
      return newTask;
    } catch (err) {
      console.error('Erreur lors de la création de la tâche:', err);
      throw new Error(
        err.response?.data?.error || 
        'Erreur lors de la création de la tâche'
      );
    }
  }, [getAuthHeaders]);

  // Mettre à jour une tâche avec mise à jour optimiste
  const updateTask = useCallback(async (taskId, taskData) => {
    try {
      // Mise à jour optimiste
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId ? { ...task, ...taskData } : task
        )
      );

      const response = await api.put(`${API_BASE_URL}/tasks/${taskId}`, taskData, {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });
      
      const updatedTask = response.data;
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId ? updatedTask : task
        )
      );
      setLastFetch(Date.now());
      return updatedTask;
    } catch (err) {
      console.error('Erreur lors de la modification de la tâche:', err);
      // Revert optimistic update on error
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task._id === taskId ? task : task
        )
      );
      throw new Error(
        err.response?.data?.error || 
        'Erreur lors de la modification de la tâche'
      );
    }
  }, [getAuthHeaders]);

  // Supprimer une tâche avec mise à jour optimiste
  const deleteTask = useCallback(async (taskId) => {
    try {
      // Mise à jour optimiste
      const taskToDelete = tasks.find(task => task._id === taskId);
      setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));

      await api.delete(`${API_BASE_URL}/tasks/${taskId}`, {
        headers: getAuthHeaders(),
        timeout: 5000
      });
      
      setLastFetch(Date.now());
    } catch (err) {
      console.error('Erreur lors de la suppression de la tâche:', err);
      // Revert optimistic update on error
      if (taskToDelete) {
        setTasks(prevTasks => [...prevTasks, taskToDelete]);
      }
      throw new Error(
        err.response?.data?.error || 
        'Erreur lors de la suppression de la tâche'
      );
    }
  }, [getAuthHeaders, tasks]);

  // Mettre à jour le statut d'une tâche
  const updateTaskStatus = useCallback(async (taskId, newStatus) => {
    try {
      const task = tasks.find(t => t._id === taskId);
      if (!task) return;

      const updatedTaskData = { ...task, statut: newStatus };
      await updateTask(taskId, updatedTaskData);
    } catch (err) {
      console.error('Erreur lors du changement de statut:', err);
      throw err;
    }
  }, [tasks, updateTask]);

  // Récupérer les détails d'une tâche
  const getTaskById = useCallback(async (taskId) => {
    try {
      const response = await api.get(`${API_BASE_URL}/tasks/${taskId}`, {
        headers: getAuthHeaders(),
        timeout: 5000
      });
      return response.data;
    } catch (err) {
      console.error('Erreur lors de la récupération de la tâche:', err);
      throw new Error(
        err.response?.data?.error || 
        'Erreur lors de la récupération de la tâche'
      );
    }
  }, [getAuthHeaders]);

  // Filtrer les tâches par statut (memoized)
  const getTasksByStatus = useCallback((status) => {
    return tasks.filter(task => task.statut === status);
  }, [tasks]);

  // Filtrer les tâches par priorité (memoized)
  const getTasksByPriority = useCallback((priority) => {
    return tasks.filter(task => task.priorite === priority);
  }, [tasks]);

  // Obtenir les statistiques des tâches (memoized)
  const getTaskStats = useMemo(() => {
    return {
      total: tasks.length,
      aFaire: tasks.filter(t => t.statut === 'a_faire').length,
      enCours: tasks.filter(t => t.statut === 'en_cours').length,
      termine: tasks.filter(t => t.statut === 'termine').length,
      hautepriorite: tasks.filter(t => t.priorite === 'haute').length,
      enRetard: tasks.filter(t => 
        t.dateEcheance && 
        new Date(t.dateEcheance) < new Date() && 
        t.statut !== 'termine'
      ).length
    };
  }, [tasks]);

  // Charger les tâches au montage du composant
  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    fetchTasks: useCallback((page = 1, limit = 20) => 
      fetchTasks(page, limit)
        .then(({ tasks: newTasks, pagination }) => {
          setTasks(prev => page === 1 ? newTasks : [...prev, ...newTasks]);
          return { tasks: newTasks, pagination };
        }), [fetchTasks]),
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    getTaskById,
    getTasksByStatus,
    getTasksByPriority,
    getTaskStats,
    refreshTasks: useCallback(() => {
      setLastFetch(null); // Force refresh
      return fetchTasks();
    }, [fetchTasks])
  };
};
