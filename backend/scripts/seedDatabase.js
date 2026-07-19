const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
require("dotenv").config();

const User = require("../models/User");
const Medication = require("../models/Medication");
const Reservation = require("../models/Reservation");

// Connexion à MongoDB
async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connecté à MongoDB");
    } catch (error) {
        console.error("❌ Erreur de connexion :", error);
        process.exit(1);
    }
}



const pharmacies = [
  {
    name: "Pharmacie Santa Rosa",
    email: "santarosa@kamerpharm.cm",
    phone: "690000001",
    address: "Akwa, Douala",
    coordinates: [9.7043, 4.0511]
  },
  {
    name: "Pharmacie Centrale",
    email: "centrale@kamerpharm.cm",
    phone: "690000002",
    address: "Bonanjo, Douala",
    coordinates: [9.6950, 4.0454]
  },
  {
    name: "Pharmacie Akwa",
    email: "akwa@kamerpharm.cm",
    phone: "690000003",
    address: "Akwa, Douala",
    coordinates: [9.7080, 4.0530]
  },

  {
    name: "Pharmacie didier",
    email: "didier@kamerpharm.cm",
    phone: "690000013",
    address: "ssadi, Douala",
    coordinates: [9.2080, 4.1530]
  }, 

  // On ajoutera les 5 autres juste après

]
const medications = [
  { name: "Paracétamol", category: "Antalgique", price: 500 },
  { name: "Doliprane", category: "Antalgique", price: 1500 },
  { name: "Efferalgan", category: "Antalgique", price: 1800 },
  { name: "Ibuprofène", category: "Anti-inflammatoire", price: 1200 },
  { name: "Amoxicilline", category: "Antibiotique", price: 3500 },
  { name: "Augmentin", category: "Antibiotique", price: 5000 },
  { name: "Smecta", category: "Digestif", price: 2500 },
  { name: "Flagyl", category: "Antibiotique", price: 2800 },
  { name: "Vitamine C", category: "Complément", price: 1000 },
  { name: "Coartem", category: "Antipaludique", price: 4200 },
  { name: "Ventoline", category: "Respiratoire", price: 6500 },
  { name: "Oméprazole", category: "Digestif", price: 2200 },
  { name: "Gaviscon", category: "Digestif", price: 3000 },
  { name: "Spasfon", category: "Antispasmodique", price: 1700 },
  { name: "Cétirizine", category: "Antihistaminique", price: 1800 }
]
// Ajoutés à la demande : tégretol, asprin cardio, mebux, covéran
medications.push(
    { name: "Tégretol", category: "Neurologique", price: 3000 },
    { name: "Asprin Cardio", category: "Cardiologie", price: 800 },
    { name: "Mebux", category: "Général", price: 1200 },
    { name: "Covéran", category: "Antibiotique", price: 2500 }
);

const patients = [
  { name: "Jean Dupont", phone: "677111111" },
  { name: "Alice Ngono", phone: "677222222" },
  { name: "Patrick Ndzi", phone: "677333333" },
  { name: "Marie Tchoumi", phone: "677444444" },
  { name: "Kevin Fokou", phone: "677555555" },
  { name: "Brigitte Ndzi", phone: "677666666" },
  { name: "Paul Ndzi", phone: "677777777" },
  { name: "Sarah Ndzi", phone: "677888888" }
];






// Fonction principale
async function seedDatabase() {
    await connectDB();

    console.log("🚀 Début du remplissage de la base...");

    // Vérifie si la pharmacie existe déjà
    for (const pharmacy of pharmacies) {

   const existing = await User.findOne({
      email: pharmacy.email
   });

   if (!existing) {

      await User.create({
         name: pharmacy.name,
         email: pharmacy.email,
         password: "Pharma123!",
         phone: pharmacy.phone,
         role: "pharmacie",
         status: "approved",
         address: pharmacy.address,
         location: {
            type: "Point",
            coordinates: pharmacy.coordinates
         },
         schedule: {
            lundi: { open: "08:00", close: "22:00" },
            mardi: { open: "08:00", close: "22:00" },
            mercredi: { open: "08:00", close: "22:00" },
            jeudi: { open: "08:00", close: "22:00" },
            vendredi: { open: "08:00", close: "22:00" },
            samedi: { open: "09:00", close: "20:00" },
            dimanche: { open: "09:00", close: "20:00" }
         },
         isOnDuty: false
      });

      console.log(`✅ ${pharmacy.name} créée`);
   } else {
      console.log(`ℹ️ ${pharmacy.name} existe déjà`);
   }
}



const pharmaciesDB = await User.find({ role: "pharmacie" });

for (const pharmacy of pharmaciesDB) {

    const shuffled = [...medications].sort(() => 0.5 - Math.random());

    const nbMedicaments = Math.floor(Math.random() * 8) + 8;

    const medsForPharmacy = shuffled.slice(0, nbMedicaments);

    for (const med of medsForPharmacy) {

        const exists = await Medication.findOne({
            pharmacyId: pharmacy._id,
            name: med.name.toLowerCase()
        });

        if (!exists) {

            const finalPrice = Math.floor(Math.random() * 1500) + 500; // prix entre 500 et 2000
            const stock = Math.random() < 0.20 ? 0 : Math.floor(Math.random() * 60) + 5;

            await Medication.create({
                pharmacyId: pharmacy._id,
                name: med.name,
                category: med.category,
                price: finalPrice,
                stock: stock,
                requiresPrescription: med.category === "Antibiotique"
            });

        }

    }

    console.log(`💊 ${pharmacy.name} possède ${nbMedicaments} médicaments.`);
}


const allMedications = await Medication.find();

for (let i = 0; i < 12; i++) {

    const med =
        allMedications[Math.floor(Math.random() * allMedications.length)];

    const patient =
        patients[Math.floor(Math.random() * patients.length)];

    const alreadyExists = await Reservation.findOne({
        pharmacyId: med.pharmacyId,
        medicationId: med._id,
        patientName: patient.name,
        medName: med.name
    });

    if (!alreadyExists) {

        const qty = Math.floor(Math.random() * 3) + 1;

        const statuses = [
            "En attente",
            "Confirmé",
            "Refusé",
            "Récupéré"
        ];

        const status =
            statuses[Math.floor(Math.random() * statuses.length)];

        await Reservation.create({

            pharmacyId: med.pharmacyId,

            medicationId: med._id,

            patientName: patient.name,

            patientPhone: patient.phone,

            medName: med.name,

            qty,

            totalPrice: qty * med.price,

            status

        });

    }

}

console.log("✅ Réservations créées.");


console.log("✅ Script terminé.");

await mongoose.connection.close();

}

seedDatabase();