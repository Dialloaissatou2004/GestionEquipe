import React from 'react';

const Task = ({ task = {}, onEdit, onDelete, onStatusChange }) => {
  // Vérifier si la tâche est valide
  if (!task || typeof task !== 'object') {
    console.warn('Tâche invalide reçue:', task);
    return null; // Ne pas rendre le composant si la tâche n'est pas valide
  }
  const getPriorityColor = (priorite) => {
    if (!priorite) return 'bg-gray-100 text-gray-800 border-gray-200';
    
    switch (priorite.toLowerCase()) {
      case 'haute':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'moyenne':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'faible':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (statut) => {
    if (!statut) return 'bg-gray-400';
    
    switch (statut.toLowerCase()) {
      case 'termine':
        return 'bg-green-500';
      case 'en_cours':
      case 'en cours':
        return 'bg-blue-500';
      case 'a_faire':
      case 'a faire':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (statut) => {
    if (!statut) return 'Non défini';
    
    switch (statut.toLowerCase()) {
      case 'termine':
      case 'terminé':
        return 'Terminé';
      case 'en_cours':
      case 'en cours':
        return 'En cours';
      case 'a_faire':
      case 'a faire':
        return 'À faire';
      default:
        return statut;
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Non définie';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex-1">{task.titre}</h3>
        <div className="flex space-x-2 ml-4">
          <button
            onClick={() => onEdit(task)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="Modifier"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(task._id)}
            className="text-red-600 hover:text-red-800 transition-colors"
            title="Supprimer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <p className="text-gray-600 mb-4">{task.description || 'Aucune description'}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priorite)}`}>
          {task.priorite?.charAt(0).toUpperCase() + task.priorite?.slice(1)}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(task.statut)}`}>
          {getStatusText(task.statut)}
        </span>
      </div>

      <div className="text-sm text-gray-500 space-y-1">
        <div className="flex justify-between">
          <span>Échéance:</span>
          <span className={task.dateEcheance && new Date(task.dateEcheance) < new Date() ? 'text-red-600 font-medium' : ''}>
            {formatDate(task.dateEcheance)}
          </span>
        </div>
        {task.assigne && (
          <div className="flex justify-between">
            <span>Assigné à:</span>
            <span>{task.assigne.nom}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Créé le:</span>
          <span>{formatDate(task.creeLe)}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <select
          value={task.statut}
          onChange={(e) => onStatusChange(task._id, e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="a_faire">À faire</option>
          <option value="en_cours">En cours</option>
          <option value="termine">Terminé</option>
        </select>
      </div>
    </div>
  );
};

export default Task;
