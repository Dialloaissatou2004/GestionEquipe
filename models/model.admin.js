const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  motDePasse: { type: String, required: true },
  role: { type: String, enum: ['admin','user'], default: 'admin' }
});

userSchema.pre('save', async function(next){
  if (this.isModified('motDePasse')) this.motDePasse = await bcrypt.hash(this.motDePasse, 10);
  next();
});

module.exports = mongoose.model('user', userSchema);
