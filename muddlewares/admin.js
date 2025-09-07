const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Vérifier la présence du header d'autorisation
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    if (!authHeader) {
      console.error('Aucun token fourni');
      return res.status(401).json({ 
        success: false,
        error: 'Accès refusé. Aucun token fourni.'
      });
    }

    // Vérifier le format du token
    if (!authHeader.startsWith('Bearer ')) {
      console.error('Format de token invalide');
      return res.status(401).json({ 
        success: false,
        error: 'Format de token invalide. Utilisez le format: Bearer <token>'
      });
    }

    // Extraire le token
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      console.error('Token manquant');
      return res.status(401).json({ 
        success: false,
        error: 'Token manquant dans la requête.'
      });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret-key');
    
    if (!decoded) {
      console.error('Échec de la vérification du token');
      return res.status(401).json({ 
        success: false,
        error: 'Échec de la vérification du token.'
      });
    }

    // Ajouter les informations utilisateur à la requête
    req.user = { 
      id: decoded.id, 
      email: decoded.email, 
      role: decoded.role 
    };

    console.log('Utilisateur authentifié:', { 
      id: decoded.id, 
      email: decoded.email, 
      role: decoded.role 
    });
    
    next();
  } catch (error) { 
    console.error('Erreur d\'authentification:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        error: 'Session expirée. Veuillez vous reconnecter.'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false,
        error: 'Token invalide. Veuillez vous reconnecter.'
      });
    }
    
    // Pour les autres types d'erreurs
    return res.status(500).json({ 
      success: false,
      error: 'Erreur lors de l\'authentification.'
    });
  }
};
