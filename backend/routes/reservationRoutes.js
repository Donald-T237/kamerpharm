const express = require('express');
const router = express.Router();
const Reservation = require('../models/Reservation');
const Medication = require('../models/Medication');
const { protect, authorizeRoles } = require('../middlewares/authMiddleware');

// 1. CÔTÉ PATIENT : PASSER UNE RÉSERVATION (Route Publique)
// POST /api/reservations
router.post('/', async (req, res) => {
  try {
    const { pharmacyId, medicationId, patientName, patientPhone, qty } = req.body;

    // Vérifier si le médicament existe et s'il y a assez de stock
    const medication = await Medication.findById(medicationId);
    if (!medication) {
      return res.status(404).json({ message: "Médicament introuvable." });
    }
    if (medication.stock < qty) {
      return res.status(400).json({ message: `Stock insuffisant. Seulement ${medication.stock} disponible(s).` });
    }

    // Calcul du prix total
    const totalPrice = medication.price * qty;

    // Création de la réservation
    const newReservation = await Reservation.create({
      pharmacyId,
      medicationId,
      patientName,
      patientPhone,
      medName: medication.name,
      qty,
      totalPrice
    });

    res.status(201).json({ message: "Réservation envoyée avec succès ! En attente de validation par la pharmacie.", newReservation });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la réservation", error: error.message });
  }
});

// 2. CÔTÉ PHARMACIE : VOIR TOUTES LES RÉSERVATIONS REÇUES (Route Protégée)
// GET /api/reservations/my-orders
router.get('/my-orders', protect, authorizeRoles('pharmacie'), async (req, res) => {
  try {
    // La pharmacie connectée ne voit que ses propres commandes
    const orders = await Reservation.find({ pharmacyId: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des commandes", error: error.message });
  }
});

// 3. CÔTÉ PHARMACIE : METTRE À JOUR LE STATUT D'UNE COMMANDE (Confirmé, Refusé, Récupéré)
// PATCH /api/reservations/:id/status
router.patch('/:id/status', protect, authorizeRoles('pharmacie'), async (req, res) => {
  try {
    const { status } = req.body; // Doit être 'Confirmé', 'Refusé' ou 'Récupéré'
    
    // On cherche la réservation et on vérifie qu'elle appartient bien à cette pharmacie
    const reservation = await Reservation.findOne({ _id: req.params.id, pharmacyId: req.user._id });
    if (!reservation) {
      return res.status(404).json({ message: "Réservation introuvable ou non autorisée." });
    }

    // SI LE PHARMACIEN CONFIRME : On diminue le stock du médicament
    if (status === 'Confirmé' && reservation.status === 'En attente') {
      const medication = await Medication.findById(reservation.medicationId);
      if (!medication || medication.stock < reservation.qty) {
        return res.status(400).json({ message: "Impossible de confirmer, le stock est épuisé entre temps." });
      }
      medication.stock -= reservation.qty; // On baisse le stock
      await medication.save();
    }

    // Mettre à jour le statut de la réservation
    reservation.status = status;
    await reservation.save();

    res.json({ message: `Réservation mise à jour : ${status}`, reservation });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de la réservation", error: error.message });
  }
});

module.exports = router;