const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Fonction d'aide pour générer le JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Inscription d'un utilisateur
// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role, address, coordinates, schedule } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Cet email est déjà utilisé' });

    // Si c'est un patient, le statut est approuvé d'office. Si pharmacie, il reste 'pending'
    const status = role === 'patient' ? 'approved' : 'pending';

    // Préparation des données géographiques si c'est une pharmacie
    let location = undefined;
    if (role === 'pharmacie' && coordinates) {
      location = { type: 'Point', coordinates: coordinates }; // [Lng, Lat]
    }

    const user = await User.create({
      name, email, password, phone, role, status, address, location, schedule
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur lors de l\'inscription', error: error.message });
  }
};

// @desc    Connexion de l'utilisateur
// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.comparePassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur lors de la connexion' });
  }
};