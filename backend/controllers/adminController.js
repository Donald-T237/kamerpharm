console.log("=== Chargement adminController.js ===");

const User = require('../models/User');

console.log("User importé :", typeof User);


// GET toutes les pharmacies
console.log("Définition getPharmacies");

exports.getPharmacies = async (req, res) => {
    try {

        const { status } = req.query;

        let filter = {
            role: "pharmacie"
        };

        if (status) {
            filter.status = status;
        }

        const pharmacies = await User
            .find(filter)
            .sort({ createdAt: -1 });

        res.json(pharmacies);

    } catch (error) {

        res.status(500).json({
            message: "Erreur récupération pharmacies",
            error: error.message
        });

    }
};


// APPROUVER pharmacie
console.log("Définition approvePharmacy");

exports.approvePharmacy = async (req, res) => {

    try {

        const pharmacy = await User.findOneAndUpdate(

            {
                _id: req.params.id,
                role: "pharmacie"
            },

            {
                status: "approved"
            },

            {
                new: true
            }

        );

        if (!pharmacy) {

            return res.status(404).json({
                message: "Pharmacie introuvable"
            });

        }

        res.json({

            message: "Pharmacie approuvée",
            pharmacy

        });

    } catch (error) {

        res.status(500).json({
            message: "Erreur serveur",
            error: error.message
        });

    }

};


// SUSPENDRE pharmacie
console.log("Définition suspendPharmacy");

exports.suspendPharmacy = async (req, res) => {

    try {

        const pharmacy = await User.findOneAndUpdate(

            {
                _id: req.params.id,
                role: "pharmacie"
            },

            {
                status: "suspended"
            },

            {
                new: true
            }

        );

        if (!pharmacy) {

            return res.status(404).json({
                message: "Pharmacie introuvable"
            });

        }

        res.json({

            message: "Pharmacie suspendue",
            pharmacy

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// REACTIVER pharmacie
console.log("Définition reactivatePharmacy");

exports.reactivatePharmacy = async (req, res) => {

    try {

        const pharmacy = await User.findOneAndUpdate(

            {
                _id: req.params.id,
                role: "pharmacie"
            },

            {
                status: "approved"
            },

            {
                new: true
            }

        );

        if (!pharmacy) {

            return res.status(404).json({
                message: "Pharmacie introuvable"
            });

        }

        res.json({

            message: "Pharmacie réactivée",
            pharmacy

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

console.log("=== Fin chargement adminController.js ===");