const User = require("../models/model.admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Fonction utilitaire pour formater la réponse utilisateur
const formatUserResponse = (user) => ({
  _id: user._id,
  email: user.email,
  nom: user.nom,
  poste: user.poste,
  role: user.role,
  photo: user.photo || null
});

// Inscription d'un nouvel utilisateur
exports.register = async (req, res) => {
  try {
    console.log('Début du processus d\'inscription');
    
    // Validation des entrées
    const email = req.body.email ? req.body.email.toLowerCase().trim() : null;
    const { motDePasse, nom, poste } = req.body;
    const role = 'membre'; // Forcer le rôle 'membre' pour toutes les nouvelles inscriptions

    // Vérification des champs obligatoires
    if (!email || !motDePasse || !nom) {
      console.error('Champs manquants', { email: !!email, nom: !!nom });
      return res.status(400).json({ 
        success: false,
        error: "Email, nom et mot de passe sont requis" 
      });
    }

    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "Format d'email invalide"
      });
    }

    // Vérification de la longueur du mot de passe
    if (motDePasse.length < 6) {
      return res.status(400).json({
        success: false,
        error: "Le mot de passe doit contenir au moins 6 caractères"
      });
    }

    // Vérification de l'existence de l'utilisateur
    const exist = await User.findOne({ email });
    if (exist) {
      return res.status(409).json({ 
        success: false,
        error: "Un utilisateur avec cet email existe déjà" 
      });
    }

    // Création du nouvel utilisateur avec le rôle forcé à 'membre'
    const user = new User({
      email,
      motDePasse, // Le hachage sera fait automatiquement par le middleware du modèle
      nom: nom.trim(),
      poste: poste ? poste.trim() : '',
      role: 'membre', // Toujours définir le rôle comme 'membre'
      photo: req.file ? `/uploads/${req.file.filename}` : ''
    });

    await user.save();
    console.log('Utilisateur enregistré avec succès:', user.email);

    // Génération du token JWT
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: "7d" }
    );

    // Réponse avec les données utilisateur formatées
    res.status(201).json({
      success: true,
      message: "Inscription réussie",
      user: formatUserResponse(user),
      token
    });

  } catch (err) {
    console.error("Erreur lors de l'inscription:", err);
    res.status(500).json({ 
      success: false,
      error: "Une erreur est survenue lors de l'inscription" 
    });
  }
};

// Connexion d'un utilisateur
exports.login = async (req, res) => {
  try {
    console.log('Tentative de connexion');
    
    // Validation des entrées
    const email = req.body.email ? req.body.email.toLowerCase().trim() : null;
    const { motDePasse } = req.body;

    if (!email || !motDePasse) {
      return res.status(400).json({ 
        success: false,
        error: "L'email et le mot de passe sont requis" 
      });
    }

    // Recherche de l'utilisateur
    const user = await User.findOne({ email }).select('+motDePasse');
    
    if (!user) {
      console.log('Tentative de connexion échouée: utilisateur non trouvé', email);
      return res.status(401).json({ 
        success: false,
        error: "Identifiants invalides" 
      });
    }

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(motDePasse, user.motDePasse);
    
    if (!isMatch) {
      console.log('Tentative de connexion échouée: mot de passe incorrect pour', email);
      return res.status(401).json({ 
        success: false,
        error: "Identifiants invalides" 
      });
    }

    // Génération du token JWT
    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: "24h" }
    );

    console.log('Connexion réussie pour:', user.email);
    
    // Réponse avec les données utilisateur formatées
    res.json({ 
      success: true,
      message: "Connexion réussie",
      user: formatUserResponse(user),
      token 
    });

  } catch (err) {
    console.error("Erreur lors de la connexion:", err);
    res.status(500).json({ 
      success: false,
      error: "Une erreur est survenue lors de la connexion" 
    });
  }
};

// Récupération du profil de l'utilisateur connecté
exports.getProfile = async (req, res) => {
  try {
    console.log('Récupération du profil pour l\'utilisateur ID:', req.user?.id);
    
    if (!req.user?.id) {
      console.error('ID utilisateur manquant dans la requête');
      return res.status(401).json({
        success: false,
        error: 'Non autorisé. Veuillez vous reconnecter.'
      });
    }

    const user = await User.findById(req.user.id).select('-motDePasse');
    
    if (!user) {
      console.error('Utilisateur non trouvé avec l\'ID:', req.user.id);
      return res.status(404).json({
        success: false,
        error: 'Utilisateur non trouvé'
      });
    }

    console.log('Profil récupéré avec succès pour:', user.email);
    res.json({
      success: true,
      user: formatUserResponse(user)
    });
    
  } catch (err) {
    console.error('Erreur lors de la récupération du profil:', err);
    res.status(500).json({
      success: false,
      error: 'Une erreur est survenue lors de la récupération du profil'
    });
  }
};

// Récupération de tous les utilisateurs (pour tous les utilisateurs authentifiés)
exports.getAllUsers = async (req, res) => {
  try {
    console.log('Récupération de tous les utilisateurs');
    
    // Tous les utilisateurs authentifiés peuvent voir la liste des membres
    // (restriction admin supprimée pour permettre l'assignation de tâches)
    
    const users = await User.find().select('-motDePasse');
    
    console.log(`Récupération réussie de ${users.length} utilisateurs`);
    res.json({
      success: true,
      count: users.length,
      users: users.map(user => formatUserResponse(user))
    });
    
  } catch (err) {
    console.error('Erreur lors de la récupération des utilisateurs:', err);
    res.status(500).json({
      success: false,
      error: 'Une erreur est survenue lors de la récupération des utilisateurs'
    });
  }
};
