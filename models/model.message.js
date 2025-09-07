const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  expediteur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  destinataire: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  objet: {
    type: String,
    required: true,
    trim: true
  },
  contenu: {
    type: String,
    required: true
  },
  lu: {
    type: Boolean,
    default: false
  },
  dateEnvoi: {
    type: Date,
    default: Date.now
  },
  priorite: {
    type: String,
    enum: ['basse', 'moyenne', 'haute'],
    default: 'moyenne'
  },
  pieceJointe: {
    type: String,
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index pour optimiser les requêtes de messagerie
messageSchema.index({ expediteur: 1, dateEnvoi: -1 });
messageSchema.index({ destinataire: 1, dateEnvoi: -1 });
messageSchema.index({ lu: 1 });

// Populate automatique des expéditeurs et destinataires
messageSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'expediteur',
    select: 'nom email photo'
  }).populate({
    path: 'destinataire',
    select: 'nom email photo'
  });
  
  next();
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
