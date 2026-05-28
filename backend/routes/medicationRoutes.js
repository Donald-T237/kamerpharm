const express = require('express');
const router = express.Router();
const Medication = require('../models/Medication');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// 1. AJOUTER UN MÉDICAMENT AU STOCK
// POST /api/medications
router.post('/', protect, authorizeRoles('pharmacie'), async (req, res) => {
  try {
    const { name, category, price, stock, requiresPrescription } = req.body;

    // req.user._id provient de ton middleware 'protect' (la pharmacie connectée)
    const newMedication = await Medication.create({
      pharmacyId: req.user._id,
      name,
      category,
      price,
      stock,
      requiresPrescription
    });

    res.status(201).json({ message: "Médicament ajouté au stock !", newMedication });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout au stock", error: error.message });
  }
});

// 2. VOIR TOUT LE STOCK DE MA PHARMACIE
// GET /api/medications/my-stock
router.get('/my-stock', protect, authorizeRoles('pharmacie'), async (req, res) => {
  try {
    // On récupère uniquement les médicaments qui appartiennent à la pharmacie connectée
    const stock = await Medication.find({ pharmacyId: req.user._id }).sort({ createdAt: -1 });
    res.json(stock);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du stock", error: error.message });
  }
});

// 3. METTRE À JOUR LA QUANTITÉ OU LE PRIX D'UN PRODUIT
// PUT /api/medications/:id
router.put('/:id', protect, authorizeRoles('pharmacie'), async (req, res) => {
  try {
    const { price, stock, requiresPrescription } = req.body;

    // Sécurité : On cherche le produit ET on vérifie qu'il appartient bien à cette pharmacie
    let medication = await Medication.findOne({ _id: req.params.id, pharmacyId: req.user._id });
    
    if (!medication) {
      return res.status(404).json({ message: "Médicament introuvable ou non autorisé" });
    }

    // Mise à jour des champs s'ils sont fournis dans la requête
    if (price !== undefined) medication.price = price;
    if (stock !== undefined) medication.stock = stock;
    if (requiresPrescription !== undefined) medication.requiresPrescription = requiresPrescription;

    await medication.save();
    res.json({ message: "Stock mis à jour avec succès !", medication });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour", error: error.message });
  }
});

module.exports = router;