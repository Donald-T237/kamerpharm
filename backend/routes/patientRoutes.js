const express = require('express');
const router = express.Router();
const Medication = require('../models/Medication');

// SEARCH /api/patients/search?q=nom_du_medicament
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query; // Récupère le mot-clé tapé par le patient

    if (!q) {
      return res.status(400).json({ message: "Veuillez entrer un nom de médicament." });
    }

    // Nettoyage de la recherche pour éviter les problèmes d'accents et de casse
    const searchQuery = q.trim();

    // Recherche dans la base de données
    const results = await Medication.find({
      name: { $regex: searchQuery, $options: 'i' }, // 'i' rend la recherche insensible à la casse
      stock: { $gt: 0 } // On ne veut QUE les produits en stock (Strictement supérieur à 0)
    })
    .populate({
      path: 'pharmacyId',
      select: 'name phone address location status', // On récupère les infos utiles de la pharmacie
      match: { status: 'approved' } // Sécurité : Seules les pharmacies validées par l'admin apparaissent !
    });

    // Filtrer les résultats pour éliminer les médicaments liés à des pharmacies non approuvées
    // (Mongoose met 'pharmacyId' à null si le 'match' du populate échoue)
    const filteredResults = results.filter(item => item.pharmacyId !== null);

    res.json({
      keyword: q,
      count: filteredResults.length,
      results: filteredResults
    });

  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la recherche", error: error.message });
  }
});

module.exports = router;