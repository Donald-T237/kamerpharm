const express = require('express');
const router = express.Router();
const Pharmacy = require('../models/Pharmacy');
const { enrichPharmacyData } = require('../utils/pharmacyUtils');

/**
 * Recherche les pharmacies ayant un médicament en stock
 * avec calcul de distance et statut ouvert/fermé
 * 
 * GET /api/pharmacy/search?produit=...&lat=...&lng=...
 * 
 * Paramètres:
 * - produit: nom du médicament (string)
 * - lat: latitude du patient (number)
 * - lng: longitude du patient (number)
 * - maxDistance: distance max en mètres (number, optional, default: 50000m = 50km)
 */
router.get('/search', async (req, res) => {
  try {
    const { produit, lat, lng, maxDistance = 50000 } = req.query;

    // Validation
    if (!produit || isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({
        error: "Paramètres manquants ou invalides (produit, lat, lng)."
      });
    }

    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);
    const maxDist = parseInt(maxDistance);

    // Agrégation MongoDB avec $geoNear
    const resultats = await Pharmacy.aggregate([
      {
        $geoNear: {
          near: { 
            type: "Point", 
            coordinates: [lngNum, latNum] 
          },
          distanceField: "distance",
          spherical: true,
          maxDistance: maxDist, // Limite à 50km par défaut
          distanceMultiplier: 1 // Garde la distance en mètres
        }
      },
      {
        $match: {
          stock: { $regex: produit, $options: 'i' },
          status: 'approuve' // Affiche seulement les pharmacies approuvées
        }
      },
      {
        $limit: 30 // Limite à 30 résultats max
      },
      {
        $project: {
          _id: 1,
          name: 1,
          phone: 1,
          email: 1,
          address: 1,
          "location.coordinates": 1,
          hours: 1,
          stock: 1,
          acceptsMomo: 1,
          acceptsOm: 1,
          isOnDuty: 1,
          distance: 1
        }
      }
    ]);

    // Enrichissement des données (ajout du statut et distance formatée)
    const enrichedResults = resultats.map(pharmacy => enrichPharmacyData(pharmacy));

    res.json({
      success: true,
      count: enrichedResults.length,
      data: enrichedResults
    });

  } catch (error) {
    console.error("Erreur API Recherche:", error);
    res.status(500).json({ 
      error: "Une erreur interne est survenue.",
      details: error.message 
    });
  }
});

/**
 * Récupère les détails d'une pharmacie spécifique
 * GET /api/pharmacy/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const pharmacy = await Pharmacy.findById(req.params.id);
    
    if (!pharmacy) {
      return res.status(404).json({ error: "Pharmacie non trouvée" });
    }

    const enriched = enrichPharmacyData(pharmacy.toObject());
    res.json(enriched);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * Récupère toutes les pharmacies approuvées (pour la carte)
 * GET /api/pharmacy/list/all
 */
router.get('/list/all', async (req, res) => {
  try {
    const pharmacies = await Pharmacy.find({ status: 'approuve' });
    const enriched = pharmacies.map(p => enrichPharmacyData(p.toObject()));
    
    res.json({
      success: true,
      count: enriched.length,
      data: enriched
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
