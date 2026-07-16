const express = require('express');

const router = express.Router();


const adminController = require('../controllers/adminController');


// récupérer pharmacies

router.get(
'/pharmacies',
adminController.getPharmacies
);



// approuver

router.patch(
'/pharmacies/:id/approve',
adminController.approvePharmacy
);



// suspendre

router.patch(
'/pharmacies/:id/suspend',
adminController.suspendPharmacy
);



// réactiver

router.patch(
'/pharmacies/:id/reactivate',
adminController.reactivatePharmacy
);



module.exports = router;