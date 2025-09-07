import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from '../api/axios';
import config from '../config';

const Header = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [profilePhoto, setProfilePhoto] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Helper function to construct image URL properly
  const getImageUrl = (photoPath) => {
    if (!photoPath) return '';
    const baseUrl = config.api.baseURL.replace(/\/$/, ''); // Remove trailing slash
    const path = photoPath.startsWith('/') ? photoPath : `/${photoPath}`;
    return `${baseUrl}${path}`;
  };

 // Charger la photo de profil
useEffect(() => {
  if (isAuthenticated && user?.id) {
    // Charger la photo de profil depuis l'API d'authentification
    const loadProfile = async () => {
      try {
        const response = await axios.get('/api/auth/me');
        if (response.data.user?.photo) {
          setProfilePhoto(response.data.user.photo);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du profil:', error);
      }
    };
    
    loadProfile();
  }
}, [isAuthenticated, user?.id]); // Utiliser user?.id au lieu de user entier pour éviter les re-renders

  const isActive = (path) => {
    return location.pathname === path ? 'text-blue-400 bg-blue-500/20 border border-blue-500/30' : 'text-slate-300 hover:text-white hover:bg-white/10';
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-2xl border-b border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h2m0-13h10a2 2 0 012 2v11a2 2 0 01-2 2H9m0-13v13" />
                </svg>
              </div>
              <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                <Link to="/" className="hover:text-blue-400 transition-colors">
                  <span className="hidden sm:inline">Task Manager Pro</span>
                  <span className="sm:hidden">TMP</span>
                </Link>
              </h1>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
            <Link
              to="/"
              className={`px-3 lg:px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${isActive('/')}`}
            >
              Accueil
            </Link>
            
            {isAuthenticated && (
              <Link
                to="/tasks"
                className={`px-3 lg:px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${isActive('/tasks')}`}
              >
                Tâches
              </Link>
            )}
            
            <Link
              to="/about"
              className={`px-3 lg:px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg ${isActive('/about')}`}
            >
              À propos
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3 lg:space-x-4 ml-4">
                <Link
                  to="/profile"
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors hidden lg:block"
                >
                  Mon Profil
                </Link>
                <button
                  type="button"
                  className="bg-white/10 backdrop-blur-sm flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:bg-white/20 transition-all duration-300 border border-white/20"
                  onClick={() => navigate('/profile')}
                >
                  <span className="sr-only">Ouvrir le menu utilisateur</span>
                  {profilePhoto ? (
                    <img 
                      className="h-8 w-8 lg:h-10 lg:w-10 rounded-full object-cover border-2 border-white/30" 
                      src={getImageUrl(profilePhoto)} 
                      alt={user?.nom || 'Utilisateur'}
                    />
                  ) : (
                    <div className="h-8 w-8 lg:h-10 lg:w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg text-xs lg:text-sm">
                      {user?.nom?.charAt(0) || user?.email?.charAt(0) || '?'}
                    </div>
                  )}
                </button>
                <button
                  onClick={logout}
                  className="px-3 lg:px-4 py-2 bg-red-500/20 text-red-300 text-sm font-medium rounded-lg hover:bg-red-500/30 hover:text-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 border border-red-500/30"
                >
                  <span className="hidden lg:inline">Déconnexion</span>
                  <span className="lg:hidden">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3 lg:space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 lg:px-4 py-2 rounded-lg hover:bg-white/10"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 lg:px-6 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <span className="hidden sm:inline">Inscription</span>
                  <span className="sm:hidden">S'inscrire</span>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="bg-white/10 backdrop-blur-sm inline-flex items-center justify-center p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-all duration-300 border border-white/20"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Ouvrir le menu principal</span>
              {!mobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-800/95 backdrop-blur-sm border-t border-slate-700">
            <Link
              to="/"
              className={`block px-3 py-2 text-base font-medium transition-all duration-300 rounded-lg ${isActive('/')}`}
              onClick={closeMobileMenu}
            >
              Accueil
            </Link>
            
            {isAuthenticated && (
              <Link
                to="/tasks"
                className={`block px-3 py-2 text-base font-medium transition-all duration-300 rounded-lg ${isActive('/tasks')}`}
                onClick={closeMobileMenu}
              >
                Tâches
              </Link>
            )}
            
            <Link
              to="/about"
              className={`block px-3 py-2 text-base font-medium transition-all duration-300 rounded-lg ${isActive('/about')}`}
              onClick={closeMobileMenu}
            >
              À propos
            </Link>

            {isAuthenticated ? (
              <div className="border-t border-slate-700 pt-4 pb-3">
                <div className="flex items-center px-3 mb-3">
                  {profilePhoto ? (
                    <img 
                      className="h-10 w-10 rounded-full object-cover border-2 border-white/30" 
                      src={getImageUrl(profilePhoto)} 
                      alt={user?.nom || 'Utilisateur'}
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                      {user?.nom?.charAt(0) || user?.email?.charAt(0) || '?'}
                    </div>
                  )}
                  <div className="ml-3">
                    <div className="text-base font-medium text-white">{user?.nom}</div>
                    <div className="text-sm font-medium text-slate-300">{user?.email}</div>
                  </div>
                </div>
                <div className="space-y-1">
                  <Link
                    to="/profile"
                    className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-lg"
                    onClick={closeMobileMenu}
                  >
                    Mon Profil
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="w-full text-left block px-3 py-2 text-base font-medium text-red-300 hover:text-red-200 hover:bg-red-500/20 transition-all duration-300 rounded-lg"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-t border-slate-700 pt-4 pb-3 space-y-1">
                <Link
                  to="/login"
                  className="block px-3 py-2 text-base font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-300 rounded-lg"
                  onClick={closeMobileMenu}
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg"
                  onClick={closeMobileMenu}
                >
                  Inscription
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
