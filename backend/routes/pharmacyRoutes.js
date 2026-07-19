const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Pharmacy = require('../models/Pharmacy');
const Medication = require('../models/Medication');
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
    const maxDist = parseInt(maxDistance, 10);

    // Recherche des pharmacies approuvées proches contenant le médicament
    const resultats = await User.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [lngNum, latNum]
          },
          distanceField: 'distance',
          spherical: true,
          maxDistance: maxDist,
          distanceMultiplier: 1
        }
      },
      {
        $match: {
          role: 'pharmacie',
          status: 'approved',
          'location.coordinates': { $exists: true }
        }
      },
      {
        $lookup: {
          from: 'medications',
          let: { pharmacyId: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ['$pharmacyId', '$$pharmacyId'] },
                    { $gt: ['$stock', 0] },
                    { $regexMatch: { input: '$name', regex: produit, options: 'i' } }
                  ]
                }
              }
            },
            { $project: { name: 1, price: 1, stock: 1, requiresPrescription: 1 } }
          ],
          as: 'matchedMedications'
        }
      },
      {
        $match: {
          matchedMedications: { $ne: [] }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          phone: 1,
          email: 1,
          address: 1,
          location: 1,
          schedule: 1,
          isOnDuty: 1,
          distance: 1,
          matchedMedications: 1
        }
      },
      {
        $limit: 30
      }
    ]);

    const enrichedResults = resultats.map((pharmacy) => {
      const meds = pharmacy.matchedMedications || [];
      return enrichPharmacyData({
        ...pharmacy,
        hours: pharmacy.schedule || {},
        stock: meds.map((med) => med.name),
        price: meds.length ? meds[0].price : 0,
        requiresPrescription: meds.length ? meds[0].requiresPrescription : false
      });
    });

    res.json({
      success: true,
      count: enrichedResults.length,
      data: enrichedResults
    });

  } catch (error) {
    console.error('Erreur API Recherche:', error);
    res.status(500).json({
      error: 'Une erreur interne est survenue.',
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
    const pharmacies = await Pharmacy.find({ status: 'approved' });
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
