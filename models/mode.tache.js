const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  message: { type: String, required: true },
  creeLe: { type: Date, default: Date.now }
});

const taskSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String },
  priorite: { type: String, enum: ['faible', 'moyenne', 'haute'], default: 'moyenne' },
  statut: { type: String, enum: ['a_faire', 'en_cours', 'termine'], default: 'a_faire' },
  dateEcheance: { type: Date },
  assigne: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  creePar: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  creeLe: { type: Date, default: Date.now },
  commentaires: [commentSchema],
  historique: [{
    action: { type: String, required: true },
    auteur: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    details: { type: String },
    date: { type: Date, default: Date.now }
  }]
});

// Indexes pour améliorer les performances
taskSchema.index({ creeLe: -1 }); // Index pour le tri par date de création
taskSchema.index({ statut: 1 }); // Index pour filtrer par statut
taskSchema.index({ priorite: 1 }); // Index pour filtrer par priorité
taskSchema.index({ assigne: 1 }); // Index pour filtrer par assigné
taskSchema.index({ creePar: 1 }); // Index pour filtrer par créateur
taskSchema.index({ titre: 'text', description: 'text' }); // Index de recherche textuelle
taskSchema.index({ dateEcheance: 1, statut: 1 }); // Index composé pour les tâches en retard

module.exports = mongoose.model('Task', taskSchema);
