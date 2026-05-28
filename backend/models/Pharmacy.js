const mongoose = require('mongoose');

const PharmacySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  managerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  
  // Géolocalisation pour la carte côté patient
  location: {
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true }
  },
  
  // Configuration des paiements
  acceptsMomo: { type: Boolean, default: true },
  acceptsOm: { type: Boolean, default: true },
  
  // Statut géré par l'ADMIN (Flux d'approbation et suspension)
  status: { 
    type: String, 
    enum: ['en_attente', 'approuve', 'suspendu', 'refuse'], 
    default: 'en_attente' 
  },
  
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Pharmacy', PharmacySchema);