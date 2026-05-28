const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
  // On lie le médicament à l'ID de la pharmacie (qui est un User de rôle "pharmacie")
  pharmacyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { 
    type: String, 
    required: true, 
    trim: true,
    lowercase: true // Stocker en minuscule facilitera grandement la recherche du patient plus tard !
  },
  category: { 
    type: String, 
    default: 'Général' 
  },
  price: { 
    type: Number, 
    required: true 
  },
  stock: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  // Ta case à cocher pour prévenir le patient au Cameroun
  requiresPrescription: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Medication', MedicationSchema);