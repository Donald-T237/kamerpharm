const express = require('express');
const router = express.Router();
// On utilise le modèle User unique qui contient toutes les pharmacies et patients
const User = require('../models/User'); 

// 1. OBTENIR TOUTES LES PHARMACIES (Filtrées d'office sur le rôle 'pharmacie')
router.get('/pharmacies', async (req, res) => {
  try {
    const { status } = req.query; // Exemple: /api/admin/pharmacies?status=pending
    
    // Filtre de base : on ne veut QUE les comptes de type pharmacie
    let filter = { role: 'pharmacie' };
    
    // Si l'admin ajoute un filtre sur le statut (ex: pending)
    if (status) {
      filter.status = status;
    }
    
    const pharmacies = await User.find(filter).sort({ createdAt: -1 });
    res.json(pharmacies);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération", error: error.message });
  }
});

// 2. APPROUVER UNE PHARMACIE
router.patch('/pharmacies/:id/approve', async (req, res) => {
  try {
    const updatedPharmacy = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'pharmacie' }, // Sécurité : s'assurer que c'est bien une pharmacie
      { status: 'approved' }, // Aligné sur ton contrôleur (approved)
      { new: true }
    );
    if (!updatedPharmacy) return res.status(404).json({ message: "Pharmacie introuvable" });
    
    res.json({ message: "L'officine a été approuvée avec succès !", updatedPharmacy });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur lors de l'approbation", error: error.message });
  }
});

// 3. SUSPENDRE UNE PHARMACIE
router.patch('/pharmacies/:id/suspend', async (req, res) => {
  try {
    const updatedPharmacy = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'pharmacie' },
      { status: 'suspended' }, // Statut international standardisé
      { new: true }
    );
    if (!updatedPharmacy) return res.status(404).json({ message: "Pharmacie introuvable" });

    res.json({ message: "L'officine a été suspendue temporairement.", updatedPharmacy });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur lors de la suspension", error: error.message });
  }
});

// 4. RÉACTIVER UNE PHARMACIE
router.patch('/pharmacies/:id/reactivate', async (req, res) => {
  try {
    const updatedPharmacy = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'pharmacie' },
      { status: 'approved' },
      { new: true }
    );
    if (!updatedPharmacy) return res.status(404).json({ message: "Pharmacie introuvable" });

    res.json({ message: "L'officine a été réactivée avec succès.", updatedPharmacy });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur lors de la réactivation", error: error.message });
  }
});

module.exports = router;