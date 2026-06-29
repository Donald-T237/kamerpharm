const mongoose = require('mongoose');

const PharmacySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  managerName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  
  // Géolocalisation optimisée pour MongoDB GeoJSON ($geoNear)
  location: {
    address: { type: String, required: true },
    type: { type: String, default: 'Point', enum: ['Point'] },
    coordinates: { type: [Number], required: true } // [Longitude, Latitude] STRICTEMENT dans cet ordre
  },
  
  // Gestion des stocks de médicaments
  stock: [{ type: String }], // Ex: ["Paracétamol", "Ibuprofène"]

  // Gestion des horaires pour le statut Ouvert/Fermé
  hours: {
    lundi: { open: { type: String, default: "08:00" }, close: { type: String, default: "22:00" } },
    mardi: { open: { type: String, default: "08:00" }, close: { type: String, default: "22:00" } },
    mercredi: { open: { type: String, default: "08:00" }, close: { type: String, default: "22:00" } },
    jeudi: { open: { type: String, default: "08:00" }, close: { type: String, default: "22:00" } },
    vendredi: { open: { type: String, default: "08:00" }, close: { type: String, default: "22:00" } },
    samedi: { open: { type: String, default: "09:00" }, close: { type: String, default: "20:00" } },
    dimanche: { open: { type: String, default: "00:00" }, close: { type: String, default: "00:00" } }
  },
  isOnDuty: { type: Boolean, default: false }, // Pour savoir si la pharmacie est de garde
  
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
}, { timestamps: true });

// Index géospatial indispensable pour le calcul de distance instantané
PharmacySchema.index({ "location.coordinates": "2dsphere" });

// Exportation compatible avec ton code existant
module.exports = mongoose.models.Pharmacy || mongoose.model('Pharmacy', PharmacySchema);