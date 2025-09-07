import React, { useState } from 'react';
import Task from './Task';

const TaskList = ({ tasks = [], onEdit, onDelete, onStatusChange, loading }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('creeLe');
  const [sortOrder, setSortOrder] = useState('desc');

  // S'assurer que tasks est un tableau
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  const filteredTasks = safeTasks.filter(task => {
    if (!task) return false;
    if (filter === 'all') return true;
    return task.statut === filter;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === 'dateEcheance' || sortBy === 'creeLe') {
      aValue = new Date(aValue || 0);
      bValue = new Date(bValue || 0);
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!Array.isArray(tasks) || tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune tâche trouvée</h3>
        <p className="mt-1 text-sm text-gray-500">Commencez par créer une nouvelle tâche.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres et tri */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Toutes ({tasks.length})
            </button>
            <button
              onClick={() => setFilter('a_faire')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'a_faire' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              À faire ({tasks.filter(t => t.statut === 'a_faire').length})
            </button>
            <button
              onClick={() => setFilter('en_cours')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'en_cours' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              En cours ({tasks.filter(t => t.statut === 'en_cours').length})
            </button>
            <button
              onClick={() => setFilter('termine')}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === 'termine' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Terminées ({tasks.filter(t => t.statut === 'termine').length})
            </button>
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="creeLe">Date de création</option>
              <option value="dateEcheance">Date d'échéance</option>
              <option value="priorite">Priorité</option>
              <option value="titre">Titre</option>
            </select>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Liste des tâches */}
      {sortedTasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h2m0-13h10a2 2 0 012 2v11a2 2 0 01-2 2H9m0-13v13" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'Aucune tâche' : `Aucune tâche ${filter === 'a_faire' ? 'à faire' : filter === 'en_cours' ? 'en cours' : 'terminée'}`}
          </h3>
          <p className="text-gray-500">
            {filter === 'all' ? 'Commencez par créer votre première tâche.' : 'Changez le filtre pour voir d\'autres tâches.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedTasks.map(task => (
            <Task
              key={task._id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
              onStatusChange={onStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
