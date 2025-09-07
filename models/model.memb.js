const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  poste: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  photo: { type: String }
});

module.exports = mongoose.model('Member', memberSchema);
