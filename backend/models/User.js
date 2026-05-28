const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  role: { type: String, enum: ['patient', 'pharmacie', 'admin'], required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  
  // Géolocalisation (uniquement pour les pharmacies)
  address: String,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] } // [Longitude, Latitude]
  },
  
  // Horaires (uniquement pour les pharmacies)
  schedule: { type: Object, default: {} },
  isOnDuty: { type: Boolean, default: false },
  
  createdAt: { type: Date, default: Date.now }
});

// Index géospatial pour les calculs de distance futurs
UserSchema.index({ location: '2dsphere' });

// Avant de sauvegarder, on hache le mot de passe s'il a été modifié
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Méthode pour comparer les mots de passe lors de la connexion
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);