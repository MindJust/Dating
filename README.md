# Nexus 4.0 - Édition Titan

## Présentation

Nexus 4.0 est une plateforme de rencontres conçue selon le principe "Offline-First" avec une architecture entièrement pilotée par configuration. Cette approche permet au Superadmin de contrôler l'ensemble de l'expérience utilisateur via le Dashboard, sans nécessiter de modifications du code source.

## Architecture du système

Le système est composé de quatre services principaux :

1. **Nexus PWA** : L'application frontend utilisateur, conçue comme un client léger intelligent qui interprète la configuration dynamique fournie par l'API.
2. **Nexus Core API** : Le backend qui gère la logique métier, l'authentification, les interactions avec la base de données et sert la configuration dynamique.
3. **Nexus Superadmin Dashboard** : L'interface de contrôle total pour le Superadmin, permettant de gérer les utilisateurs, le contenu, les paramètres du moteur et la monétisation.
4. **Base de données PostgreSQL** : Le système de stockage relationnel robuste qui garantit l'intégrité des données.

## Fonctionnalités principales

### Module d'Onboarding & Niveaux de Confiance
- Niveau 1 (Fantôme) : Inscription via numéro de téléphone + prénom
- Niveau 2 (Actif) : Ajout de 3 photos + 3 prompts
- Niveau 3 (Vérifié) : Processus de selfie-vidéo pour obtenir le Bouclier Nexus Doré

### Module de Découverte à Double Moteur
- Onglet "Découverte" : Flux infini de profils (swipe)
- Onglet "Vos Priorités" : Deck quotidien curaté de profils ultra-compatibles

### Module de Chat & Connexions
- Interface de chat familière avec statut des messages
- Accès à 90 jours d'historique de messages hors-ligne

### Module "Ma Trousse de Sécurité"
- Fonction "Ange Gardien" : Partage de détails de RDV en un clic
- Annuaire des "Lieux Sûrs" : Liste de lieux partenaires
- Boutons "Signaler" et "Bloquer"

### Module de Monétisation "Nexus Premium"
- Accès à la liste "Ils ont aimé votre profil"
- Filtres de recherche avancés
- Mode Incognito
- Boost de profil hebdomadaire

## Technologies utilisées

- **Frontend PWA** : React avec Vite
- **Backend API** : Node.js avec Express
- **Base de données** : PostgreSQL
- **Authentification** : JWT (JSON Web Tokens)
- **Stockage hors-ligne** : IndexedDB
- **Temps réel** : WebSockets

## Structure du projet

```
.
├── nexus-api/                 # Backend API
│   ├── src/
│   │   ├── controllers/      # Contrôleurs des routes
│   │   ├── models/           # Modèles de données
│   │   ├── routes/           # Définition des routes
│   │   ├── services/         # Logique métier
│   │   ├── middleware/       # Middleware personnalisé
│   │   ├── config/           # Configuration de l'application
│   │   └── index.js          # Point d'entrée de l'application
│   ├── package.json
│   └── .env                  # Variables d'environnement
│
├── nexus-pwa/                # Application frontend utilisateur
│   ├── public/               # Fichiers statiques
│   ├── src/
│   │   ├── assets/           # Ressources (images, icônes)
│   │   ├── components/       # Composants React
│   │   ├── pages/            # Pages de l'application
│   │   ├── services/         # Services API
│   │   ├── utils/            # Fonctions utilitaires
│   │   ├── hooks/            # Hooks React personnalisés
│   │   ├── context/          # Contextes React
│   │   ├── App.jsx           # Composant racine
│   │   └── main.jsx          # Point d'entrée
│   ├── package.json
│   └── vite.config.js
│
├── nexus-dashboard/          # Interface Superadmin
│   ├── src/
│   │   ├── components/       # Composants du Dashboard
│   │   ├── services/         # Services API
│   │   ├── App.jsx           # Composant racine
│   │   └── main.jsx          # Point d'entrée
│   └── package.json
│
├── database/                 # Schéma et données de test
│   ├── schema.sql            # Schéma de la base de données
│   └── seed.sql              # Données de test
│
├── docs/                     # Documentation
│   └── architecture.md       # Documentation de l'architecture
│
├── README.md                 # Ce fichier
└── package.json              # Scripts de développement
```

## Installation et démarrage

### Prérequis

- Node.js (version 18 ou supérieure)
- PostgreSQL
- npm ou yarn

### Installation

1. Cloner le dépôt :
   ```bash
   git clone <url-du-depot>
   cd nexus-4.0
   ```

2. Installer les dépendances pour chaque service :
   ```bash
   cd nexus-api
   npm install
   
   cd ../nexus-pwa
   npm install
   
   cd ../nexus-dashboard
   npm install
   ```

3. Configurer la base de données PostgreSQL en utilisant les fichiers dans le dossier [database/](file:///z:/DATE/database)

4. Créer les fichiers `.env` pour chaque service avec les variables d'environnement appropriées

### Démarrage

1. Démarrer le backend API :
   ```bash
   cd nexus-api
   npm start
   ```

2. Démarrer le frontend PWA :
   ```bash
   cd nexus-pwa
   npm run dev
   ```

3. Démarrer le Superadmin Dashboard :
   ```bash
   cd nexus-dashboard
   npm run dev
   ```

## Configuration

L'application est entièrement pilotée par configuration via l'endpoint `/api/v1/config`. Le Superadmin peut modifier tous les aspects de l'application via le Dashboard, y compris :

- Les textes et labels
- Les paramètres du moteur
- Les feature flags
- Les fonctionnalités premium

## Stratégie hors-ligne

L'application suit le principe "Offline-First" avec :

- Base de données locale IndexedDB comme source de vérité primaire
- Cache de 90 jours d'historique de messages
- Cache de 24 heures de profils de découverte
- Synchronisation intelligente en arrière-plan

## Déploiement

Les instructions détaillées pour le déploiement en production sont disponibles dans [docs/architecture.md](file:///z:/DATE/docs/architecture.md).

## Contribution

Ce projet est le produit final conforme au Blueprint Nexus 4.0 Édition Titan. Aucune modification du code n'est prévue pour les évolutions futures, celles-ci devant être gérées via le Superadmin Dashboard.

## Licence

Ce projet est la propriété exclusive de son auteur et est fourni à des fins de démonstration uniquement.