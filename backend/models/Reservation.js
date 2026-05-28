const mongoose = require('mongoose');

const ReservationSchema = new mongoose.Schema({
  // Lien vers la pharmacie concernée
  pharmacyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  // Lien vers le médicament réservé
  medicationId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Medication', 
    required: true 
  },
  patientName: { type: String, required: true },
  patientPhone: { type: String, required: true },
  medName: { type: String, required: true }, // Sauvegarde du nom au cas où le produit est supprimé du stock plus tard
  qty: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true },
  
  status: { 
    type: String, 
    enum: ['En attente', 'Confirmé', 'Refusé', 'Récupéré'], 
    default: 'En attente' 
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reservation', ReservationSchema);