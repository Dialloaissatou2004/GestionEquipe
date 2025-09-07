import React, { useState, useCallback, useRef, useEffect } from 'react';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import { useTasks } from '../hooks/useTasks';
import { useAuth } from '../contexts/AuthContext';
import { debounce } from 'lodash';

const TASKS_PER_PAGE = 10;

const Tasks = () => {
  const { user } = useAuth();
  const {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus
  } = useTasks();

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const loadingRef = useRef(false);

  // Fonction de chargement des tâches
  const loadMoreTasksFn = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;
    
    loadingRef.current = true;
    try {
      const { pagination } = await fetchTasks(page + 1, TASKS_PER_PAGE);
      setPage(p => p + 1);
      setHasMore(pagination.currentPage < pagination.totalPages);
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error);
    } finally {
      loadingRef.current = false;
    }
  }, [fetchTasks, page, hasMore]);

  // Debounce le chargement des tâches
  const loadMoreTasks = useCallback(
    debounce(() => loadMoreTasksFn(), 300),
    [loadMoreTasksFn]
  );

  // Référence pour l'observateur d'intersection
  const lastTaskElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreTasks();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMoreTasks]);

  // Charger les tâches initiales
  useEffect(() => {
    fetchTasks(1, TASKS_PER_PAGE * page);
  }, []); // Dépendance vide - exécuté une seule fois au montage

  const handleCreateTask = async (taskData) => {
    setFormLoading(true);
    try {
      await createTask(taskData);
      setShowForm(false);
    } catch (error) {
      console.error('Erreur lors de la création de la tâche:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdateTask = async (taskData) => {
    if (!editingTask) return;
    
    setFormLoading(true);
    try {
      await updateTask(editingTask._id, taskData);
      setEditingTask(null);
      setShowForm(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la tâche:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      try {
        await deleteTask(taskId);
      } catch (error) {
        console.error('Erreur lors de la suppression de la tâche:', error);
      }
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 relative overflow-hidden">
        {/* Professional background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800"></div>
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-500/20 backdrop-blur-sm border border-red-500/30 rounded-xl p-6 text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Erreur de chargement</h2>
            <p className="text-red-300 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Professional background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800"></div>
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Gestion des Tâches</h1>
              <p className="text-slate-300">Organisez et suivez vos projets efficacement</p>
            </div>
            {user?.role === 'admin' && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Nouvelle Tâche</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-orange-500/20 rounded-xl border border-orange-500/30">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-300">À faire</p>
                <p className="text-2xl font-bold text-white">
                  {Array.isArray(tasks) ? tasks.filter(t => t && t.statut === 'a_faire').length : 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-300">En cours</p>
                <p className="text-2xl font-bold text-white">
                  {Array.isArray(tasks) ? tasks.filter(t => t && t.statut === 'en_cours').length : 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-xl border border-white/20 hover:bg-white/15 transition-all duration-300">
            <div className="flex items-center">
              <div className="p-3 bg-green-500/20 rounded-xl border border-green-500/30">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-300">Terminées</p>
                <p className="text-2xl font-bold text-white">
                  {Array.isArray(tasks) ? tasks.filter(t => t && t.statut === 'termine').length : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Liste des tâches</h2>
              <div className="flex space-x-2">
                <span className="text-sm text-slate-300">
                  {Array.isArray(tasks) ? tasks.length : 0} tâche{Array.isArray(tasks) && tasks.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {loading && tasks.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <TaskList
                  tasks={tasks}
                  loading={loading}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                  lastTaskRef={lastTaskElementRef}
                />
                {loading && (
                  <div className="flex justify-center my-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Task Form */}
      {(showForm || editingTask) && (
        <TaskForm
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          task={editingTask}
          loading={formLoading}
          onCancel={handleCloseForm}
        />
      )}
    </div>
  );
};

export default Tasks;
