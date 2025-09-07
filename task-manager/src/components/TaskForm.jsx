import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMembers } from '../hooks/useMembers';

const TaskForm = ({ task, onSubmit, onCancel, loading }) => {
  const { isAdmin } = useAuth();
  const { members } = useMembers();
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    priorite: 'moyenne',
    statut: 'a_faire',
    dateEcheance: '',
    assigne: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setFormData({
        titre: task.titre || '',
        description: task.description || '',
        priorite: task.priorite || 'moyenne',
        statut: task.statut || 'a_faire',
        dateEcheance: task.dateEcheance ? new Date(task.dateEcheance).toISOString().split('T')[0] : '',
        assigne: task.assigne?._id || ''
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.titre.trim()) {
      newErrors.titre = 'Le titre est requis';
    }
    
    if (formData.dateEcheance && new Date(formData.dateEcheance) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.dateEcheance = 'La date d\'échéance ne peut pas être dans le passé';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const submitData = {
      ...formData,
      dateEcheance: formData.dateEcheance || null,
      assigne: formData.assigne || null
    };

    onSubmit(submitData);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay Background */}
      <div className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity duration-300"></div>
      
      {/* Modal Container */}
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-300 sm:my-8 sm:w-full sm:max-w-4xl">
          
          {/* Decorative Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div 
              className="absolute inset-0"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}
            ></div>
          </div>

          {/* Header */}
          <div className="relative bg-gradient-to-r from-emerald-600/20 to-green-600/20 px-8 py-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
                  <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div className="text-left">
                  <h3 className="text-2xl font-bold text-white">
                    {task ? '✏️ Modifier la Tâche' : '✨ Nouvelle Tâche'}
                  </h3>
                  <p className="mt-1 text-sm text-emerald-300">
                    {task ? 'Modifiez les détails de cette tâche' : 'Créez une nouvelle tâche pour votre équipe'}
                  </p>
                </div>
              </div>
              <button
                onClick={onCancel}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition-all duration-200 hover:bg-white/20 hover:scale-110"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="relative px-8 py-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Title Field */}
              <div className="space-y-2">
                <label htmlFor="titre" className="block text-sm font-semibold text-white">
                  📝 Titre de la Tâche *
                </label>
                <input
                  type="text"
                  id="titre"
                  name="titre"
                  value={formData.titre}
                  onChange={handleChange}
                  className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.titre ? 'border-red-500/50 bg-red-500/10' : 'border-white/20 hover:border-emerald-500/50'
                  }`}
                  placeholder="Ex: Développer la nouvelle fonctionnalité..."
                />
                {errors.titre && (
                  <div className="flex items-center space-x-2 text-red-300 text-sm">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{errors.titre}</span>
                  </div>
                )}
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-semibold text-white">
                  📄 Description Détaillée
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-slate-400 backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:border-emerald-500/50 resize-none"
                  placeholder="Décrivez en détail les objectifs, étapes et livrables attendus..."
                />
              </div>

              {/* Priority and Status Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="priorite" className="block text-sm font-semibold text-white">
                    ⚡ Priorité
                  </label>
                  <select
                    id="priorite"
                    name="priorite"
                    value={formData.priorite}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:border-emerald-500/50"
                  >
                    <option value="faible" className="bg-slate-800 text-white">🟢 Faible</option>
                    <option value="moyenne" className="bg-slate-800 text-white">🟡 Moyenne</option>
                    <option value="haute" className="bg-slate-800 text-white">🔴 Haute</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="statut" className="block text-sm font-semibold text-white">
                    📊 Statut
                  </label>
                  <select
                    id="statut"
                    name="statut"
                    value={formData.statut}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:border-emerald-500/50"
                  >
                    <option value="a_faire" className="bg-slate-800 text-white">📋 À faire</option>
                    <option value="en_cours" className="bg-slate-800 text-white">⏳ En cours</option>
                    <option value="termine" className="bg-slate-800 text-white">✅ Terminé</option>
                  </select>
                </div>
              </div>

              {/* Due Date */}
              <div className="space-y-2">
                <label htmlFor="dateEcheance" className="block text-sm font-semibold text-white">
                  📅 Date d'Échéance
                </label>
                <input
                  type="date"
                  id="dateEcheance"
                  name="dateEcheance"
                  value={formData.dateEcheance}
                  onChange={handleChange}
                  className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-white backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    errors.dateEcheance ? 'border-red-500/50 bg-red-500/10' : 'border-white/20 hover:border-emerald-500/50'
                  }`}
                />
                {errors.dateEcheance && (
                  <div className="flex items-center space-x-2 text-red-300 text-sm">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{errors.dateEcheance}</span>
                  </div>
                )}
              </div>

              {/* Assignment Section for Admins */}
              {isAdmin && (
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-white">
                    👥 Assigner à
                  </label>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                    <select
                      multiple
                      value={formData.assigne || []}
                      onChange={(e) => {
                        const selectedValues = Array.from(e.target.selectedOptions, option => option.value);
                        setFormData({ ...formData, assigne: selectedValues });
                      }}
                      className="w-full rounded-lg border border-white/20 bg-white/10 p-3 text-white backdrop-blur-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 hover:border-emerald-500/50 h-32"
                    >
                      {Array.isArray(members) && members.map((member) => (
                        <option key={member._id} value={member._id} className="bg-slate-800 text-white py-1">
                          👤 {member.nom} ({member.email})
                        </option>
                      ))}
                    </select>
                    <p className="mt-2 text-xs text-slate-400">
                      💡 Maintenez Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs membres
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onCancel}
                  className="inline-flex justify-center rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-300 backdrop-blur-sm transition-all duration-200 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-slate-500"
                >
                  ❌ Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-emerald-700 hover:to-green-700 hover:shadow-xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      💾 Enregistrement...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {task ? '✏️ Modifier' : '✨ Créer la Tâche'}
                    </div>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
