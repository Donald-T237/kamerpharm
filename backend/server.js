const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Importation de toutes les routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/admin'); 
const medicationRoutes = require('./routes/medicationRoutes'); // <-- AJOUTÉ ICI
const patientRoutes = require('./routes/patientRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

// Chargement des variables d'environnement
dotenv.config();

const app = express();

// Middlewares de base (On garde CORS et le parseur JSON)
app.use(cors());
app.use(express.json()); 

// Connexion à la Base de Données MongoDB (On garde ta méthode directe actuelle)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((err) => console.error('Erreur de connexion à MongoDB :', err));

// Branchement des routes (L'authentification, l'administration et les stocks cohabitent)
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/medications', medicationRoutes); // <-- AJOUTÉ ICI
app.use('/api/patients', patientRoutes);
app.use('/api/reservations', reservationRoutes);

// Lancement du serveur KAMERPHARM
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur KAMERPHARM actif sur le port ${PORT}`);
});