const jwt = require('jsonwebtoken');
const User = require('../models/model.admin');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token manquant ou mal formaté' });
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }
    
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Accès refusé. Droits administrateur requis.' });
    }
    
    req.user = { id: user._id, email: user.email, role: user.role };
    next();
  } catch (err) { 
    console.error('Admin middleware error:', err);
    return res.status(403).json({ error: 'Token invalide' });
  }
};
