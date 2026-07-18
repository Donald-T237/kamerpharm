# 📋 DOCUMENTATION - KAMERPHARM

## Table des matières
1. [Vue d'ensemble](#vue-densemble)
2. [Architecture du projet](#architecture-du-projet)
3. [Stack technologique](#stack-technologique)
4. [Modèles de données](#modèles-de-données)
5. [Routes API](#routes-api)
6. [Pages Frontend](#pages-frontend)
7. [Système d'authentification](#système-dauthentification)
8. [Installation et configuration](#installation-et-configuration)

---

## Vue d'ensemble

**KAMERPHARM** est une plateforme de gestion des pharmacies destinée au Cameroun. Elle permet aux patients de :
- Chercher des médicaments dans les pharmacies proches
- Réserver des médicaments
- Localiser les pharmacies via une carte (Mapbox)

Elle permet aux pharmaciens de :
- Gérer leur inventaire de médicaments
- Gérer les réservations des patients
- Modifier leurs horaires d'ouverture/fermeture
- Participer à des gardes (pharmacies de nuit)

Et à l'administrateur de :
- Valider/rejeter les inscriptions de pharmacies
- Gérer les utilisateurs
- Superviser les réservations

---

## Architecture du projet

```
kamerpharm/
│
├── backend/                          # API REST (Express.js + MongoDB)
│   ├── config/
│   │   └── db.js                    # Configuration MongoDB
│   ├── controllers/                 # Logique métier
│   │   ├── authController.js        # Inscription, connexion
│   │   └── adminController.js       # Gestion admin
│   ├── models/                      # Schémas MongoDB
│   │   ├── User.js                  # Utilisateurs (patients, pharmacies, admins)
│   │   ├── Medication.js            # Médicaments
│   │   ├── Pharmacy.js              # Pharmacies (référence alternative)
│   │   └── Reservation.js           # Réservations de médicaments
│   ├── routes/                      # Endpoints API
│   │   ├── authRoutes.js            # /api/auth
│   │   ├── admin.js                 # /api/admin
│   │   ├── medicationRoutes.js      # /api/medications
│   │   ├── patientRoutes.js         # /api/patients
│   │   ├── pharmacyRoutes.js        # /api/pharmacy
│   │   └── reservationRoutes.js     # /api/reservations
│   ├── middlewares/
│   │   └── authMiddleware.js        # Vérification JWT
│   ├── utils/
│   │   └── pharmacyUtils.js         # Fonctions utilitaires
│   ├── server.js                    # Point d'entrée du serveur
│   └── package.json
│
└── frontend/                         # App Next.js (React + Tailwind CSS)
    ├── app/
    │   ├── layout.js                # Mise en page globale
    │   ├── page.js                  # Page d'accueil
    │   ├── globals.css              # Styles globaux
    │   ├── (auth)/                  # Pages d'authentification
    │   │   ├── login/page.js
    │   │   └── register/page.js
    │   ├── admin/
    │   │   └── dashboard/page.js    # Tableau de bord admin
    │   ├── patient/
    │   │   └── accueil/
    │   │       ├── page.js          # Accueil patient
    │   │       └── MapboxMap.jsx    # Carte Mapbox interactive
    │   ├── pharmacie/
    │   │   ├── attente/page.js      # Liste des réservations en attente
    │   │   └── dashboard/page.js    # Tableau de bord pharmacien
    │   ├── api/                     # Routes API côté client (Next.js API routes)
    │   │   ├── recherche/route.js   # Recherche de médicaments
    │   │   └── reservations/route.js # Gestion des réservations
    │   └── public/                  # Fichiers statiques
    ├── package.json
    ├── next.config.mjs
    ├── postcss.config.mjs
    ├── eslint.config.mjs
    └── jsconfig.json
```

---

## Stack technologique

### Backend
| Technologie | Version | Usage |
|------------|---------|-------|
| **Node.js** | - | Runtime JavaScript côté serveur |
| **Express** | 4.19.2 | Framework web |
| **MongoDB** | 8.3.1 | Base de données NoSQL |
| **Mongoose** | 8.3.1 | ODM (Object Data Mapper) pour MongoDB |
| **JWT** | 9.0.2 | Authentification par tokens |
| **Bcryptjs** | 2.4.3 | Hachage des mots de passe |
| **CORS** | 2.8.5 | Gestion des requêtes cross-origin |
| **Dotenv** | 16.4.5 | Variables d'environnement |
| **Nodemon** | 3.1.0 | Auto-restart du serveur en développement |

### Frontend
| Technologie | Version | Usage |
|------------|---------|-------|
| **Next.js** | 16.2.6 | Framework React avec routing intégré |
| **React** | 19.2.4 | Bibliothèque UI |
| **React DOM** | 19.2.4 | Rendu React au DOM |
| **Mapbox GL** | 3.6.0 | Cartes interactives |
| **Mapbox Geocoder** | 5.0.1 | Géocodage inverse (coordonnées → adresse) |
| **Tailwind CSS** | 4 | Framework CSS utilitaire |
| **ESLint** | 9 | Linter JavaScript |

---

## Modèles de données

### 1. **User** (`backend/models/User.js`)

Représente tous les utilisateurs du système (patients, pharmaciens, admins).

```javascript
{
  _id: ObjectId,
  name: String,                    // Nom complet
  email: String (unique),          // Email unique
  password: String,                // Hachée avec bcrypt
  phone: String,                   // Numéro de téléphone
  role: String,                    // 'patient' | 'pharmacie' | 'admin'
  status: String,                  // 'pending' | 'approved' | 'rejected'
  
  // Pour les pharmacies
  address: String,                 // Adresse physique
  location: {
    type: String,                  // 'Point'
    coordinates: [Number, Number]  // [Longitude, Latitude]
  },
  schedule: Object,                // Horaires d'ouverture/fermeture
  isOnDuty: Boolean,               // Est-elle de garde?
  
  createdAt: Date
}
```

**Index géospatial** : `location: '2dsphere'` pour calculs de distance

---

### 2. **Medication** (`backend/models/Medication.js`)

Représente un médicament dans l'inventaire d'une pharmacie.

```javascript
{
  _id: ObjectId,
  pharmacyId: ObjectId (ref: User), // Référence à la pharmacie propriétaire
  name: String (lowercase),         // Nom du médicament
  category: String,                 // Ex: 'Général', 'Antibiotique'...
  price: Number,                    // Prix unitaire
  stock: Number,                    // Quantité disponible
  requiresPrescription: Boolean,    // Nécessite ordonnance?
  createdAt: Date
}
```

---

### 3. **Pharmacy** (`backend/models/Pharmacy.js`)

Référence alternative pour les pharmacies (certains endpoints l'utilisent).

```javascript
{
  _id: ObjectId,
  name: String,
  managerName: String,              // Nom du gérant
  phone: String,
  email: String (unique),
  password: String,
  
  location: {
    address: String,
    type: String,                   // 'Point'
    coordinates: [Number, Number]   // [Longitude, Latitude]
  },
  
  stock: [String],                  // Liste de noms de médicaments
  
  hours: {
    lundi: { open: String, close: String },
    mardi: { open: String, close: String },
    // ... (du lundi au dimanche)
  },
  isOnDuty: Boolean,
  
  acceptsMomo: Boolean,             // Accepte paiement Mobile Money
  acceptsOm: Boolean,               // Accepte Orange Money
  
  status: String,                   // 'en_attente' | 'approuve' | 'suspendu' | 'refuse'
  
  createdAt: Date,
  updatedAt: Date
}
```

**Index géospatial** : `"location.coordinates": "2dsphere"`

---

### 4. **Reservation** (`backend/models/Reservation.js`)

Représente une réservation de médicament par un patient.

```javascript
{
  _id: ObjectId,
  pharmacyId: ObjectId (ref: User),      // Pharmacie concernée
  medicationId: ObjectId (ref: Medication), // Médicament réservé
  
  patientName: String,
  patientPhone: String,
  medName: String,                  // Sauvegarde du nom du médicament
  
  qty: Number,                      // Quantité réservée (min: 1)
  totalPrice: Number,               // Montant total
  
  status: String,                   // 'En attente' | 'Confirmé' | 'Refusé' | 'Récupéré'
  
  createdAt: Date
}
```

---

## Routes API

### 1. **Authentication** (`/api/auth`)
Route fichier : `backend/routes/authRoutes.js`

| Méthode | Endpoint | Authentification | Description |
|---------|----------|------------------|-------------|
| POST | `/register` | ❌ Non | Inscription d'un utilisateur |
| POST | `/login` | ❌ Non | Connexion utilisateur |

**Données POST /register** :
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "securePassword123",
  "phone": "+237XXXXXXXXX",
  "role": "patient" | "pharmacie" | "admin",
  "address": "Rue de la Paix, Yaoundé",
  "coordinates": [3.8480, 11.5021],
  "schedule": {}
}
```

**Réponse** :
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "user@example.com",
  "role": "patient",
  "status": "approved",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. **Medications** (`/api/medications`)
Route fichier : `backend/routes/medicationRoutes.js`

| Méthode | Endpoint | Authentification | Description |
|---------|----------|------------------|-------------|
| GET | `/` | ✅ Oui | Récupérer tous les médicaments |
| GET | `/:id` | ✅ Oui | Récupérer un médicament |
| POST | `/` | ✅ Oui | Créer un nouveau médicament (pharmacie) |
| PUT | `/:id` | ✅ Oui | Modifier un médicament (pharmacie propriétaire) |
| DELETE | `/:id` | ✅ Oui | Supprimer un médicament |

---

### 3. **Reservations** (`/api/reservations`)
Route fichier : `backend/routes/reservationRoutes.js`

| Méthode | Endpoint | Authentification | Description |
|---------|----------|------------------|-------------|
| GET | `/` | ✅ Oui | Récupérer toutes les réservations |
| GET | `/:id` | ✅ Oui | Récupérer une réservation |
| POST | `/` | ✅ Oui | Créer une réservation (patient) |
| PUT | `/:id` | ✅ Oui | Modifier le statut d'une réservation |
| DELETE | `/:id` | ✅ Oui | Annuler une réservation |

---

### 4. **Patients** (`/api/patients`)
Route fichier : `backend/routes/patientRoutes.js`

Endpoints spécifiques aux patients (profil, historique, etc.)

---

### 5. **Pharmacy** (`/api/pharmacy`)
Route fichier : `backend/routes/pharmacyRoutes.js`

Endpoints pour les pharmacies (gestion d'inventaire, horaires, statut de garde).

---

### 6. **Admin** (`/api/admin`)
Route fichier : `backend/routes/admin.js`

| Méthode | Endpoint | Authentification | Description |
|---------|----------|------------------|-------------|
| GET | `/users` | ✅ Oui | Lister tous les utilisateurs |
| GET | `/pharmacies/pending` | ✅ Oui | Lister les pharmacies en attente |
| PUT | `/pharmacies/:id/approve` | ✅ Oui | Approuver une pharmacie |
| PUT | `/pharmacies/:id/reject` | ✅ Oui | Rejeter une pharmacie |
| PUT | `/pharmacies/:id/suspend` | ✅ Oui | Suspendre une pharmacie |

---

## Pages Frontend

### Structure de routing Next.js

#### **Pages d'authentification** (`app/(auth)/`)
- **`login/page.js`** : Formulaire de connexion
- **`register/page.js`** : Formulaire d'inscription

#### **Accueil Patient** (`app/patient/accueil/`)
- **`page.js`** : Interface principale du patient
  - Affichage des pharmacies proches
  - Barre de recherche de médicaments
  - Filtres (prix, distance, etc.)
  
- **`MapboxMap.jsx`** : Composant de carte interactive
  - Affiche les pharmacies en tant que marqueurs
  - Calcul de distance avec la géolocalisation du patient
  - Intégration Mapbox GL + Geocoder

#### **Dashboard Pharmacien** (`app/pharmacie/`)
- **`dashboard/page.js`** : Tableau de bord principal
  - Gestion du stock de médicaments
  - Modification des horaires
  - Statut de garde (on-duty)
  - Statistiques des réservations
  
- **`attente/page.js`** : Réservations en attente
  - Liste des réservations avec statut 'En attente'
  - Boutons pour confirmer/refuser/marquer comme récupéré

#### **Dashboard Admin** (`app/admin/`)
- **`dashboard/page.js`** : Tableau de bord administrateur
  - Lister les pharmacies en attente d'approbation
  - Approuver/Rejeter/Suspendre des pharmacies
  - Gérer les utilisateurs

#### **API Routes Next.js** (`app/api/`)
- **`recherche/route.js`** : Endpoint de recherche de médicaments
  - Intégration avec le backend
  - Filtrage et tri
  
- **`reservations/route.js`** : Gestion des réservations côté client

---

## Système d'authentification

### Flux d'authentification

```
1. Utilisateur remplit le formulaire (nom, email, mot de passe, rôle)
2. Frontend POST vers /api/auth/register
3. Backend vérifie si email existe (unique)
4. Backend hache le mot de passe avec bcrypt (salt = 10)
5. Backend crée un User dans MongoDB
6. Si c'est une pharmacie → Création aussi dans collection Pharmacy avec status 'en_attente'
7. Backend génère un JWT valide 30 jours
8. Réponse avec token stocké côté client (localStorage/sessionStorage)
```

### JWT (JSON Web Token)

**Structure** :
```javascript
jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
```

**Utilisation** :
- Le token est envoyé dans l'en-tête `Authorization: Bearer <token>`
- Le middleware `authMiddleware.js` valide le token

### Hachage du mot de passe

```javascript
// Avant sauvegarde
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Lors de connexion
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
```

---

## Installation et configuration

### Prérequis

- **Node.js** v16+ 
- **npm** ou **yarn**
- **MongoDB** (Cloud Atlas ou instance locale)
- Clés API **Mapbox**

### Installation Backend

```bash
cd backend

# Installer les dépendances
npm install

# Créer fichier .env
cat > .env << EOF
PORT=5000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/kamerpharm
JWT_SECRET=your_jwt_secret_key_here
CORS_ORIGIN=http://localhost:3000
EOF

# Lancer le serveur
npm run dev              # Mode développement avec nodemon
# ou
npm start               # Mode production
```

### Installation Frontend

```bash
cd frontend

# Installer les dépendances
npm install

# Créer fichier .env.local
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_access_token
EOF

# Lancer le serveur de développement
npm run dev             # Lance sur http://localhost:3000
```

### Variables d'environnement

#### Backend (`.env`)
```
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/kamerpharm
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

#### Frontend (`.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_MAPBOX_TOKEN=pk.eyJ1IjoieW91cm5hbWUiLCJhIjoiY3...
```

---

## Flux métier

### 1️⃣ Inscription d'une pharmacie

1. Pharmacien accède à `/register`
2. Saisit nom, email, mot de passe, adresse, localisation
3. Submit → POST `/api/auth/register` avec `role: "pharmacie"`
4. User créé avec `status: "pending"`
5. Pharmacy créée avec `status: "en_attente"`
6. Admin reçoit notification
7. Admin valide dans `/admin/dashboard` → `status: "approuve"`
8. Pharmacien peut maintenant ajouter des médicaments

### 2️⃣ Recherche de médicament (Patient)

1. Patient voit `/patient/accueil`
2. Saisit nom de médicament dans la barre de recherche
3. Geolocalisation automatique (si autorisée)
4. Frontend POST `/api/recherche` avec:
   - Nom du médicament
   - Localisation du patient
5. Backend retourne les pharmacies proches avec ce médicament
6. Mapbox affiche les pharmacies en marqueurs
7. Patient clique sur pharmacie → détails + prix

### 3️⃣ Réservation de médicament

1. Patient clique "Réserver" sur un médicament
2. Saisit quantité et infos de contact
3. Frontend POST `/api/reservations` avec:
   - pharmacyId
   - medicationId
   - qty
   - patientName, patientPhone
4. Backend crée Reservation avec `status: "En attente"`
5. Pharmacien reçoit notification
6. Pharmacien valide en `/pharmacie/attente`
7. Patient peut tracker le statut

---

## Hiérarchie des rôles

```
┌─────────────────────────────────────┐
│      PATIENT (Patient)              │
├─────────────────────────────────────┤
│ ✓ Rechercher des médicaments        │
│ ✓ Voir les pharmacies proches       │
│ ✓ Réserver un médicament            │
│ ✓ Tracker les réservations          │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│      PHARMACIE (Pharmacien)         │
├─────────────────────────────────────┤
│ ✓ Ajouter/Modifier les médicaments  │
│ ✓ Gérer les réservations            │
│ ✓ Modifier horaires d'ouverture     │
│ ✓ Gérer le statut de garde          │
│ ✓ Accepter paiements (Momo/OM)      │
│ ✗ Accès admin LIMITÉ                │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│      ADMIN (Administrateur)         │
├─────────────────────────────────────┤
│ ✓ Approuver/Rejeter pharmacies      │
│ ✓ Suspendre pharmacies              │
│ ✓ Gérer tous les utilisateurs       │
│ ✓ Voir toutes les réservations      │
│ ✓ Accès complet à tout              │
└─────────────────────────────────────┘
```

---

## Commandes utiles

### Backend
```bash
cd backend

# Développement
npm run dev

# Production
npm start

# Vérifier les erreurs ESLint
npx eslint .
```

### Frontend
```bash
cd frontend

# Développement
npm run dev

# Build production
npm run build

# Démarrer le build production
npm start

# Linter
npm run lint
```

---

## Considérations de sécurité

✅ **À FAIRE** :
- [x] Hachage des mots de passe avec bcrypt
- [x] JWT pour authentification
- [x] CORS configuré
- [x] Validation des données en entrée

⚠️ **À AMÉLIORER** :
- [ ] Rate limiting sur les endpoints sensibles
- [ ] Validation des données plus stricte
- [ ] Chiffrement des données sensibles en transit (HTTPS)
- [ ] Gestion des erreurs plus granulaire
- [ ] Logs d'audit des actions admin
- [ ] Protection contre les injections NoSQL

---

## Structure des fichiers clés

```
backend/
├── server.js
│   └── Point d'entrée principal
│       - Configure Express
│       - Connecte MongoDB
│       - Monte les routes
│
├── config/db.js
│   └── Paramètres de connexion MongoDB
│
├── middlewares/authMiddleware.js
│   └── Vérification du JWT
│
├── controllers/
│   ├── authController.js      (Register, Login)
│   └── adminController.js     (Gestion admin)
│
├── models/
│   ├── User.js               (Schéma utilisateur)
│   ├── Medication.js         (Schéma médicament)
│   ├── Pharmacy.js           (Schéma pharmacie)
│   └── Reservation.js        (Schéma réservation)
│
└── routes/
    ├── authRoutes.js         (/api/auth)
    ├── medicationRoutes.js   (/api/medications)
    ├── reservationRoutes.js  (/api/reservations)
    ├── patientRoutes.js      (/api/patients)
    ├── pharmacyRoutes.js     (/api/pharmacy)
    └── admin.js              (/api/admin)

frontend/
├── app/layout.js
│   └── Layout principal (header, navigation)
│
├── app/page.js
│   └── Page d'accueil
│
├── app/(auth)/
│   ├── login/page.js
│   └── register/page.js
│
├── app/patient/accueil/
│   ├── page.js
│   └── MapboxMap.jsx
│
├── app/pharmacie/
│   ├── dashboard/page.js
│   └── attente/page.js
│
├── app/admin/dashboard/page.js
│
├── app/api/
│   ├── recherche/route.js
│   └── reservations/route.js
│
└── public/
    └── Fichiers statiques
```

---

## Contact & Support

Pour toute question ou contribution :
- 📧 Email: [À remplir]
- 🐛 Issues: Reporter sur GitHub
- 📚 Wiki: [À remplir]

---

**Dernière mise à jour** : 16 juillet 2026  
**Version** : 1.0.0
