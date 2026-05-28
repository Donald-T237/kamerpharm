const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 1. Vérifie si l'utilisateur est connecté (Token valide)
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // On récupère l'utilisateur sans son mot de passe et on l'attache à la requête
      req.user = await User.findById(decoded.id).select('-password');
      return next();
    } catch (error) {
      return res.status(401).json({ message: 'Non autorisé, token invalide' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'Non autorisé, aucun token fourni' });
  }
};

// 2. Filtre selon le rôle (Patient, Pharmacie, Admin)
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Le rôle '${req.user.role}' n'est pas autorisé à accéder à cette ressource` });
    }
    next();
  };
};

// 3. Cas spécifique : Bloquer les pharmacies non validées par l'admin
const verifyApprovedPharmacy = (req, res, next) => {
  if (req.user.role === 'pharmacie' && req.user.status !== 'approved') {
    return res.status(403).json({ message: 'Votre compte pharmacie est en attente de validation par l\'administrateur' });
  }
  next();
};

module.exports = { protect, authorizeRoles, verifyApprovedPharmacy };