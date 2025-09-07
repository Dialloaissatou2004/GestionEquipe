import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to construct image URL properly
  const getImageUrl = (photoPath) => {
    if (!photoPath) return '';
    const baseUrl = 'http://localhost:5000';
    const path = photoPath.startsWith('/') ? photoPath : `/${photoPath}`;
    return `${baseUrl}${path}`;
  };

  useEffect(() => {
    const fetchUserTasks = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:5000/api/tasks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(response.data.tasks || []);
      } catch (error) {
        console.error('Erreur récupération tâches:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserTasks();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 relative overflow-hidden flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800"></div>
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
        <div className="relative z-10 text-white text-lg sm:text-xl">Chargement...</div>
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
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Page Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">Mon Profil</h1>
          <p className="text-slate-300 text-sm sm:text-base">Gérez vos informations et suivez vos tâches</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8 border border-white/20">
          <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-4 sm:space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              {user.photo ? (
                <img
                  src={getImageUrl(user.photo)}
                  alt="Photo de profil"
                  className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-xl sm:rounded-2xl object-cover border-4 border-white/30 shadow-xl"
                />
              ) : (
                <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center border-4 border-white/30 shadow-xl">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                    {user.nom ? user.nom.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
              )}
            </div>
            
            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left w-full">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-3 sm:mb-4 break-words">{user.nom}</h2>
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex items-center justify-center lg:justify-start text-slate-300 text-sm sm:text-base">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                  <span className="break-all">{user.email}</span>
                </div>
                {user.poste && (
                  <div className="flex items-center justify-center lg:justify-start text-slate-300 text-sm sm:text-base">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <span className="break-words">{user.poste}</span>
                  </div>
                )}
              </div>
              <div className="flex justify-center lg:justify-start">
                <span className={`inline-flex items-center px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold shadow-lg ${
                  user.role === 'admin' 
                    ? 'bg-gradient-to-r from-red-500 to-pink-600 text-white' 
                    : 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
                }`}>
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {user.role === 'admin' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    )}
                  </svg>
                  {user.role === 'admin' ? 'Administrateur' : 'Membre'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-white/20">
          <div className="flex items-center mb-4 sm:mb-6">
            <svg className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-emerald-400 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">Mes Tâches</h2>
          </div>
          
          {loading ? (
            <div className="text-center py-8 sm:py-12">
              <div className="inline-flex items-center text-slate-300">
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 sm:h-8 sm:w-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm sm:text-base">Chargement des tâches...</span>
              </div>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-slate-600/50 rounded-xl sm:rounded-2xl mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <p className="text-slate-300 text-base sm:text-lg">Aucune tâche assignée</p>
              <p className="text-slate-400 text-xs sm:text-sm mt-2">Vos tâches apparaîtront ici une fois assignées</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:gap-6">
              {tasks.map((task) => (
                <div key={task._id} className="bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-4 sm:p-6 border border-white/20 hover:bg-white/15 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 space-y-2 sm:space-y-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-white break-words pr-0 sm:pr-4">{task.titre}</h3>
                    <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold shadow-sm flex-shrink-0 ${
                      task.statut === 'termine' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                      task.statut === 'en_cours' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                      'bg-slate-500/20 text-slate-300 border border-slate-500/30'
                    }`}>
                      {task.statut === 'termine' ? '✓ Terminé' :
                       task.statut === 'en_cours' ? '⏳ En cours' : '📋 À faire'}
                    </span>
                  </div>
                  
                  {task.description && (
                    <p className="text-slate-300 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base break-words">{task.description}</p>
                  )}
                  
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0 text-xs sm:text-sm">
                    <div className="flex items-center text-slate-400">
                      <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="break-words">Priorité: <span className={`ml-1 font-medium ${
                        task.priorite === 'haute' ? 'text-red-400' :
                        task.priorite === 'moyenne' ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {task.priorite === 'haute' ? 'Haute' :
                         task.priorite === 'moyenne' ? 'Moyenne' : 'Faible'}
                      </span></span>
                    </div>
                    {task.dateEcheance && (
                      <div className="flex items-center text-slate-400">
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="break-words">Échéance: <span className="ml-1 font-medium text-slate-300">
                          {new Date(task.dateEcheance).toLocaleDateString()}
                        </span></span>
                      </div>
                    )}
                  </div>
                  
                  {task.commentaires && task.commentaires.length > 0 && (
                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/20">
                      <div className="flex items-center text-slate-400 text-xs sm:text-sm">
                        <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        {task.commentaires.length} commentaire{task.commentaires.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
