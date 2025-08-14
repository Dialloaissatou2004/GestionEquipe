const mongoose = require('mongoose');

const schemaTache = new mongoose.Schema({
  titre: { type: String, required: true },
  description: { type: String, default: '' },
  assigne: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
  priorite: { type: String, enum: ['faible', 'moyenne', 'haute'], default: 'moyenne' },
  statut: { type: String, enum: ['a_faire', 'en_cours', 'termine'], default: 'a_faire' },
  dateEcheance: { type: Date },
  creePar: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  creeLe: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tache', schemaTache);
