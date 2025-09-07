const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: [true, 'L\'email est requis'],
    unique: true, 
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Veuillez entrer un email valide']
  },
  motDePasse: { 
    type: String, 
    required: [true, 'Le mot de passe est requis'],
    minlength: [6, 'Le mot de passe doit contenir au moins 6 caractères'],
    select: false
  },
  nom: { 
    type: String, 
    required: [true, 'Le nom est requis'],
    trim: true
  },
  poste: { 
    type: String, 
    default: '',
    trim: true
  },
  role: { 
    type: String, 
    enum: {
      values: ['admin', 'membre'],
      message: 'Le rôle doit être soit admin, soit membre'
    }, 
    default: 'membre' 
  },
  photo: { 
    type: String, 
    default: '' 
  },
  derniereConnexion: {
    type: Date
  },
  actif: {
    type: Boolean,
    default: true,
    select: false
  },
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    push: {
      type: Boolean,
      default: true
    }
  },
  preferences: {
    theme: {
      type: String,
      enum: ['clair', 'sombre', 'systeme'],
      default: 'systeme'
    },
    langue: {
      type: String,
      default: 'fr'
    }
  }
}, {
  timestamps: true
});

// Hachage du mot de passe avant la sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('motDePasse')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.motDePasse = await bcrypt.hash(this.motDePasse, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparerMotDePasse = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.motDePasse);
};

// Middleware pour ne pas retourner les utilisateurs inactifs dans les requêtes find
userSchema.pre(/^find/, function(next) {
  this.find({ actif: { $ne: false } });
  next();
});

// Méthode pour obtenir le nom complet de l'utilisateur
userSchema.virtual('nomComplet').get(function() {
  return this.nom.trim();
});

// Index supprimé car déjà défini par unique: true dans le schéma
// userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('user', userSchema);
