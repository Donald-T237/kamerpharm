const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { protect, authorizeRoles, verifyApprovedPharmacy } = require('../middlewares/authMiddleware');

// Routes publiques
router.post('/register', register);
router.post('/login', login);

// Route d'exemple pour tester l'espace Pharmacie (Protégée et filtrée !)
router.get('/pharmacy-dashboard-data', protect, authorizeRoles('pharmacie'), verifyApprovedPharmacy, (req, res) => {
  res.json({ message: "Bienvenue sur votre Dashboard, votre compte est validé !" });
});

// Route d'exemple pour l'espace Admin (Seul l'admin passe)
router.get('/admin-panel', protect, authorizeRoles('admin'), (req, res) => {
  res.json({ message: "Bienvenue Admin, voici la liste des demandes en attente..." });
});

module.exports = router;