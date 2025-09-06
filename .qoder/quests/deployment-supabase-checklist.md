# Déploiement de Nexus 4.0 avec Supabase - Checklist

## 1. Aperçu

Cette checklist détaille les étapes nécessaires pour déployer l'application Nexus 4.0 en utilisant Supabase comme plateforme backend complète, remplaçant PostgreSQL, AWS et l'API de vérification faciale. L'authentification par téléphone sera supprimée et remplacée par l'authentification étendue de Supabase, incluant email/mot de passe et les fournisseurs sociaux (Google, Facebook, GitHub, etc.).

## 2. Modifications d'architecture requises

### 2.1 Authentification
- Remplacer le système d'authentification actuel basé sur JWT/Twilio par Supabase Auth
- Supprimer l'authentification par téléphone
- Utiliser l'authentification étendue de Supabase (email/mot de passe + fournisseurs sociaux)

### 2.2 Base de données
- Remplacer PostgreSQL par Supabase Database (PostgreSQL)
- Adapter les modèles Sequelize pour utiliser le client Supabase
- Mettre à jour les variables d'environnement

### 2.3 Stockage
- Remplacer AWS S3 par Supabase Storage
- Adapter les services de gestion de fichiers

### 2.4 Vérification faciale
- Remplacer l'API de vérification faciale par une approche manuelle via le Dashboard
- Créer une interface dans le Dashboard pour gérer les vérifications manuelles

## 3. Modifications du code

### 3.1 API Backend (nexus-api)

#### 3.1.1 Configuration et dépendances
- [ ] Mettre à jour les dépendances en remplaçant AWS (`aws-sdk`) par Supabase (`@supabase/supabase-js`) dans `nexus-api/package.json`
- [ ] Supprimer les dépendances Twilio du fichier `nexus-api/package.json`
- [ ] Mettre à jour le fichier `nexus-api/package.json` avec les nouvelles dépendances
- [ ] Remplacer la configuration de base de données dans `nexus-api/src/config/database.js` pour utiliser le client Supabase
- [ ] Supprimer le service Twilio dans `nexus-api/src/services/twilio.service.js`

#### 3.1.2 Authentification
- [ ] Remplacer le contrôleur d'authentification actuel dans `nexus-api/src/controllers/auth.controller.js`
- [ ] Remplacer les routes d'authentification SMS dans `nexus-api/src/routes/auth.routes.js` par des routes d'authentification étendues
- [ ] Implémenter l'authentification avec Supabase Auth en utilisant les méthodes d'authentification étendues
- [ ] Adapter le middleware d'authentification dans `nexus-api/src/middleware/auth.middleware.js` pour utiliser les tokens Supabase
- [ ] Mettre à jour les méthodes d'authentification pour utiliser les fonctions Supabase (`supabase.auth.signInWithPassword`, `supabase.auth.signInWithOAuth`, etc.)

#### 3.1.3 Modèles de données
- [ ] Adapter les modèles Sequelize dans le dossier `nexus-api/src/models/` pour fonctionner avec Supabase
- [ ] Remplacer les appels directs à la base de données par des appels via le client Supabase
- [ ] Mettre à jour les associations entre modèles pour utiliser les fonctions du client Supabase
- [ ] Adapter les requêtes complexes pour utiliser les méthodes Supabase

#### 3.1.4 Services
- [ ] Supprimer le service Twilio dans `nexus-api/src/services/twilio.service.js`
- [ ] Créer un service pour gérer le stockage de fichiers avec Supabase Storage
- [ ] Implémenter les fonctions de téléchargement et de récupération de fichiers via Supabase Storage

### 3.2 Dashboard Superadmin (nexus-dashboard)

#### 3.2.1 Vérification faciale
- [ ] Créer une interface dans le Dashboard pour gérer les vérifications faciales manuelles
- [ ] Ajouter une section pour valider/décliner les demandes de vérification
- [ ] Implémenter les fonctionnalités de mise à jour du niveau de confiance des utilisateurs (Fantôme → Actif → Vérifié)
- [ ] Créer des endpoints API pour gérer les validations manuelles
- [ ] Mettre à jour le statut des utilisateurs dans la base de données via les fonctions Supabase

#### 3.2.2 Configuration
- [ ] Vérifier la compatibilité avec Supabase

### 3.3 Application PWA (nexus-pwa)

#### 3.3.1 Authentification
- [ ] Remplacer la logique d'authentification actuelle dans `nexus-pwa/src/services/auth.service.js`
- [ ] Intégrer le client Supabase Auth
- [ ] Adapter les flux d'inscription et de connexion pour utiliser l'authentification étendue de Supabase
- [ ] Remplacer les composants d'authentification par téléphone par des composants d'authentification étendue
- [ ] Remplacer les appels API d'authentification par les fonctions Supabase

#### 3.3.2 Services
- [ ] Mettre à jour les services API dans `nexus-pwa/src/services/api.service.js` pour utiliser Supabase
- [ ] Adapter la gestion du stockage de fichiers pour utiliser Supabase Storage
- [ ] Remplacer les appels directs à l'API par des appels au client Supabase quand c'est approprié

## 4. Infrastructure et configuration

### 4.1 Compte Supabase
- [ ] Créer un compte Supabase
- [ ] Créer un projet Supabase
- [ ] Configurer les paramètres de sécurité

### 4.2 Base de données
- [ ] Créer les tables selon le schéma existant dans `database/schema.sql`
- [ ] Convertir les contraintes PostgreSQL en contraintes Supabase
- [ ] Configurer les politiques de sécurité (RLS) pour chaque table
- [ ] Définir les clés étrangères et les relations entre les tables
- [ ] Importer les données de test depuis `database/seed.sql`
- [ ] Configurer les indexes pour optimiser les requêtes fréquentes

### 4.3 Authentification
- [ ] Activer l'authentification email/mot de passe dans les paramètres Supabase Auth
- [ ] Configurer les fournisseurs sociaux (Google, Facebook, GitHub, etc.) dans les paramètres Supabase Auth
- [ ] Configurer les modèles d'email de vérification
- [ ] Définir les politiques d'accès aux données pour les utilisateurs authentifiés
- [ ] Configurer les paramètres de sécurité (durée des sessions, tokens, etc.)
- [ ] Mettre en place les règles RLS pour limiter l'accès aux données personnelles

### 4.4 Stockage
- [ ] Créer des buckets de stockage pour les fichiers de profil (photos)
- [ ] Configurer les politiques d'accès aux fichiers (public/private)
- [ ] Définir les tailles maximales de fichiers
- [ ] Configurer les formats de fichiers autorisés
- [ ] Mettre en place des règles RLS pour le stockage

## 5. Variables d'environnement

### 5.1 Nexus API
```env
# Server
PORT=3001
NODE_ENV=production

# Supabase
SUPABASE_URL=votre_url_supabase
SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key

# JWT (conservé pour compatibilité si nécessaire)
JWT_SECRET=votre_secret_jwt_ici
JWT_EXPIRES_IN=90d
REFRESH_TOKEN_SECRET=votre_secret_refresh_token_ici
REFRESH_TOKEN_EXPIRES_IN=90d

# CORS
CORS_ORIGIN=https://votre-domaine.com,https://dashboard.votre-domaine.com
```

### 5.2 Nexus PWA
```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_anon_key
VITE_API_BASE_URL=https://api.votre-domaine.com/api/v1
```

### 5.3 Nexus Dashboard
```env
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_anon_key
VITE_API_BASE_URL=https://api.votre-domaine.com/api/v1
```

## 6. Déploiement des applications

### 6.1 Nexus API
- [ ] Déployer sur une plateforme compatible (Vercel, Render, Railway)
- [ ] Configurer les variables d'environnement
- [ ] Vérifier la connexion à Supabase

### 6.2 Nexus PWA
- [ ] Construire l'application (npm run build)
- [ ] Déployer les fichiers statiques
- [ ] Configurer le routage (SPA)

### 6.3 Nexus Dashboard
- [ ] Construire l'application (npm run build)
- [ ] Déployer les fichiers statiques
- [ ] Configurer le routage (SPA)

## 7. Tests post-déploiement

### 7.1 Authentification
- [ ] Test d'inscription avec email et mot de passe
- [ ] Test de connexion avec email et mot de passe
- [ ] Test de connexion avec fournisseurs sociaux (Google, Facebook, GitHub)
- [ ] Test de déconnexion
- [ ] Test de rafraîchissement de session
- [ ] Test de persistance de session entre rechargements
- [ ] Test de sécurité des tokens d'authentification

### 7.2 Fonctionnalités principales
- [ ] Test du module d'onboarding (niveaux de confiance)
- [ ] Test du module de découverte (flux infini et priorités)
- [ ] Test du chat (envoi/reception de messages)
- [ ] Test de la trousse de sécurité (Ange Gardien, lieux sûrs)
- [ ] Test de la monétisation (fonctionnalités premium)
- [ ] Test du mode hors-ligne et synchronisation

### 7.3 Dashboard Superadmin
- [ ] Test de la gestion des utilisateurs (suspendre/bannir)
- [ ] Test de la configuration dynamique (feature flags, textes)
- [ ] Test de la gestion des signalements (résolution)
- [ ] Test de la vérification faciale manuelle (promotion des niveaux de confiance)
- [ ] Test de la gestion des contenus (lieux sûrs)
- [ ] Test de la configuration des paramètres du moteur

## 8. Surveillance et maintenance

### 8.1 Monitoring
- [ ] Configurer les logs d'application dans Supabase
- [ ] Mettre en place des alertes pour les erreurs critiques
- [ ] Surveiller l'utilisation des ressources Supabase (bande passante, stockage)
- [ ] Configurer le monitoring des performances des requêtes
- [ ] Mettre en place des alertes pour les seuils d'utilisation (coûts)

### 8.2 Sauvegardes
- [ ] Configurer les sauvegardes automatiques de la base de données
- [ ] Tester le processus de restauration

### 8.3 Mises à jour
- [ ] Établir un processus de déploiement continu
- [ ] Mettre en place des environnements de test
- [ ] Configurer les déploiements automatiques depuis le dépôt Git
- [ ] Mettre en place des tests automatisés de non-régression

## 9. Migration des données

### 9.1 Export des données existantes
- [ ] Exporter les données de la base PostgreSQL actuelle
- [ ] Convertir les formats de données si nécessaire

### 9.2 Import vers Supabase
- [ ] Importer les données dans les tables Supabase
- [ ] Vérifier l'intégrité des données migrées
- [ ] Mettre à jour les références aux IDs si nécessaire

## 10. Conclusion

Cette checklist couvre les principales étapes pour migrer l'application Nexus 4.0 vers une architecture basée sur Supabase. En remplaçant les services individuels (PostgreSQL, AWS) par les services intégrés de Supabase, vous simplifierez l'infrastructure et réduirez les coûts de maintenance.

Les points clés à retenir :
- L'authentification étendue de Supabase (email/mot de passe + fournisseurs sociaux) remplace le système Twilio/JWT
- La base de données PostgreSQL de Supabase remplace l'installation locale
- Le stockage Supabase remplace AWS S3
- La vérification faciale sera gérée manuellement via le Dashboard

Le déploiement avec Supabase permet une meilleure scalabilité et une réduction de la complexité opérationnelle.