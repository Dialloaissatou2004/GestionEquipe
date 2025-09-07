import React from 'react';
import { useMembers } from '../hooks/useMembers';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const About = () => {
  const { members, loading, error } = useMembers();
  const { isAuthenticated } = useAuth();

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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">À propos de Task Manager Pro</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Une solution d'entreprise moderne et intuitive pour gérer vos tâches et améliorer votre productivité.
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-2xl p-8 mb-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-6">Notre Mission</h2>
          <p className="text-slate-300 mb-6 leading-relaxed">
            Task Manager Pro a été conçu pour simplifier la gestion de vos tâches quotidiennes en entreprise. 
            Notre objectif est de vous fournir un outil puissant mais simple d'utilisation 
            qui vous aide à rester organisé et productif dans un environnement professionnel.
          </p>
          
          <h2 className="text-2xl font-semibold text-white mb-6">Fonctionnalités Principales</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center mr-4 border border-blue-500/30">
                <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Création de tâches</h3>
                <p className="text-slate-300 text-sm">
                  Créez facilement de nouvelles tâches avec titre, description, priorité et échéance.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center mr-4 border border-green-500/30">
                <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Suivi des statuts</h3>
                <p className="text-slate-300 text-sm">
                  Suivez l'avancement de vos tâches : à faire, en cours, terminé.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center mr-4 border border-yellow-500/30">
                <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Gestion des priorités</h3>
                <p className="text-slate-300 text-sm">
                  Définissez des niveaux de priorité pour organiser vos tâches importantes.
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center mr-4 border border-purple-500/30">
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Filtrage et tri</h3>
                <p className="text-slate-300 text-sm">
                  Filtrez et triez vos tâches selon différents critères pour une meilleure organisation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-2xl p-8 mb-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-6">Technologies Utilisées</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 border border-blue-500/30">
                <span className="text-2xl font-bold text-blue-400">R</span>
              </div>
              <h3 className="font-semibold text-white">React</h3>
              <p className="text-sm text-slate-300">Interface utilisateur</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 border border-purple-500/30">
                <span className="text-2xl font-bold text-purple-400">V</span>
              </div>
              <h3 className="font-semibold text-white">Vite</h3>
              <p className="text-sm text-slate-300">Build tool</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 border border-cyan-500/30">
                <span className="text-2xl font-bold text-cyan-400">T</span>
              </div>
              <h3 className="font-semibold text-white">Tailwind</h3>
              <p className="text-sm text-slate-300">Styles CSS</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3 border border-green-500/30">
                <span className="text-2xl font-bold text-green-400">N</span>
              </div>
              <h3 className="font-semibold text-white">Node.js</h3>
              <p className="text-sm text-slate-300">Backend API</p>
            </div>
          </div>
        </div>

        {/* Members List - Always visible with debug info */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl shadow-2xl p-8 mb-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-6">Notre Équipe</h2>
          
          {/* Debug info */}
          <div className="mb-4 text-sm text-slate-400">
            <p>Authentifié: {isAuthenticated ? 'Oui' : 'Non'}</p>
            <p>Chargement: {loading ? 'Oui' : 'Non'}</p>
            <p>Nombre de membres: {Array.isArray(members) ? members.length : 'N/A'}</p>
            {error && <p>Erreur: {error.message}</p>}
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            </div>
          ) : Array.isArray(members) && members.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member) => (
                <div key={member._id} className="bg-white/5 backdrop-blur-sm rounded-lg p-6 text-center border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className="w-16 h-16 mx-auto mb-4 relative">
                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={member.nom || 'Membre'}
                        className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
                        onError={(e) => {
                          // Fallback to gradient avatar if image fails to load
                          e.target.style.display = 'none';
                          e.target.nextElementSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className={`w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center ${
                        member.photo ? 'hidden' : 'flex'
                      }`}
                    >
                      <span className="text-white text-xl font-bold">
                        {member.nom ? member.nom.charAt(0).toUpperCase() : member.email ? member.email.charAt(0).toUpperCase() : '?'}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-white mb-1">{member.nom || 'Nom non défini'}</h3>
                  <p className="text-sm text-slate-300 mb-2">{member.poste || 'Poste non défini'}</p>
                  <p className="text-xs text-slate-400">{member.email}</p>
                  <div className="mt-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      member.role === 'admin' 
                        ? 'bg-red-500/20 text-red-300 border border-red-500/30' 
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {member.role === 'admin' ? 'Administrateur' : 'Membre'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-slate-400 mb-4">
                {!isAuthenticated 
                  ? "Veuillez vous connecter pour voir l'équipe" 
                  : "Aucun membre trouvé."
                }
              </p>
              {!isAuthenticated && (
                <Link
                  to="/login"
                  className="inline-flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg"
                >
                  Se connecter
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-xl shadow-2xl p-8 text-center border border-white/20">
          <h2 className="text-2xl font-semibold text-white mb-4">Besoin d'aide ?</h2>
          <p className="mb-6 text-slate-300">
            Si vous avez des questions ou des suggestions, n'hésitez pas à nous contacter.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@taskmanager.com"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Nous contacter
            </a>
            <a
              href="#"
              className="border border-white/30 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            >
              Documentation
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
