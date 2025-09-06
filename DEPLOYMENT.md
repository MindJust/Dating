# Déploiement de Nexus 4.0

## 1. Prérequis

Avant de déployer Nexus 4.0, assurez-vous d'avoir les éléments suivants :

- Node.js (version 18 ou supérieure)
- PostgreSQL (version 12 ou supérieure)
- npm ou yarn
- Un compte Twilio pour l'envoi de SMS
- Un compte AWS pour le stockage de fichiers
- Un service d'API de vérification faciale

## 2. Configuration de la base de données

1. Créez une base de données PostgreSQL pour Nexus :
   ```sql
   CREATE DATABASE nexus_db;
   CREATE USER nexus_user WITH ENCRYPTED PASSWORD 'nexus_password';
   GRANT ALL PRIVILEGES ON DATABASE nexus_db TO nexus_user;
   ```

2. Exécutez les scripts de schéma et de données de test :
   ```bash
   psql -U nexus_user -d nexus_db -f database/schema.sql
   psql -U nexus_user -d nexus_db -f database/seed.sql
   ```

## 3. Configuration des variables d'environnement

### Nexus API
Créez un fichier `.env` dans le dossier `nexus-api` avec les variables suivantes :

```env
# Server
PORT=3001
NODE_ENV=production

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=nexus_db
DB_USER=nexus_user
DB_PASSWORD=nexus_password

# JWT
JWT_SECRET=votre_secret_jwt_ici
JWT_EXPIRES_IN=90d
REFRESH_TOKEN_SECRET=votre_secret_refresh_token_ici
REFRESH_TOKEN_EXPIRES_IN=90d

# Services Tiers
TWILIO_ACCOUNT_SID=votre_account_sid_twilio
TWILIO_AUTH_TOKEN=votre_auth_token_twilio
TWILIO_PHONE_NUMBER=votre_numero_twilio

AWS_ACCESS_KEY_ID=votre_access_key_aws
AWS_SECRET_ACCESS_KEY=votre_secret_key_aws
AWS_REGION=votre_region_aws
AWS_S3_BUCKET_NAME=votre_bucket_s3

# Face Verification API
FACE_VERIFICATION_API_KEY=votre_api_key_verification_faciale
FACE_VERIFICATION_API_URL=votre_url_api_verification_faciale

# CORS
CORS_ORIGIN=https://votre-domaine.com,https://dashboard.votre-domaine.com
```

### Nexus PWA
Créez un fichier `.env` dans le dossier `nexus-pwa` avec les variables suivantes :

```env
VITE_API_BASE_URL=https://api.votre-domaine.com/api/v1
```

### Nexus Dashboard
Créez un fichier `.env` dans le dossier `nexus-dashboard` avec les variables suivantes :

```env
VITE_API_BASE_URL=https://api.votre-domaine.com/api/v1
```

## 4. Installation des dépendances

Dans chaque dossier de service (`nexus-api`, `nexus-pwa`, `nexus-dashboard`), exécutez :

```bash
npm install
```

## 5. Construction des applications frontend

### Nexus PWA
```bash
cd nexus-pwa
npm run build
```

### Nexus Dashboard
```bash
cd nexus-dashboard
npm run build
```

## 6. Déploiement

### Nexus API
1. Copiez le dossier `nexus-api` sur votre serveur de production.
2. Installez les dépendances :
   ```bash
   npm install --production
   ```
3. Démarrez le serveur :
   ```bash
   npm start
   ```
   
   Pour une exécution en arrière-plan, vous pouvez utiliser PM2 :
   ```bash
   npm install -g pm2
   pm2 start src/index.js --name nexus-api
   ```

### Nexus PWA
1. Copiez le contenu du dossier `nexus-pwa/dist` sur votre serveur web.
2. Configurez votre serveur web (Nginx, Apache, etc.) pour servir les fichiers statiques.

Exemple de configuration Nginx :
```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    
    location / {
        root /chemin/vers/nexus-pwa/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Nexus Dashboard
1. Copiez le contenu du dossier `nexus-dashboard/dist` sur votre serveur web.
2. Configurez votre serveur web pour servir les fichiers statiques.

Exemple de configuration Nginx :
```nginx
server {
    listen 80;
    server_name dashboard.votre-domaine.com;
    
    location / {
        root /chemin/vers/nexus-dashboard/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://localhost:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 7. Configuration SSL (recommandé)

Pour la sécurité, configurez SSL pour vos domaines. Vous pouvez utiliser Let's Encrypt pour obtenir un certificat gratuit.

## 8. Surveillance et maintenance

- Configurez la journalisation pour surveiller les erreurs et l'activité.
- Mettez en place des alertes pour les pannes de service.
- Planifiez des sauvegardes régulières de la base de données.
- Surveillez l'utilisation des ressources du serveur.

## 9. Mises à jour

Pour déployer une mise à jour :

1. Mettez le service en mode maintenance si nécessaire.
2. Sauvegardez la base de données.
3. Déployez le nouveau code.
4. Exécutez les migrations de base de données si nécessaire.
5. Redémarrez les services.
6. Vérifiez que tout fonctionne correctement.
7. Retirez le mode maintenance.

## 10. Résolution des problèmes

### Problèmes de connexion à la base de données
- Vérifiez les paramètres de connexion dans le fichier `.env`.
- Assurez-vous que PostgreSQL est en cours d'exécution.
- Vérifiez les autorisations de l'utilisateur de la base de données.

### Problèmes d'authentification
- Vérifiez que les secrets JWT sont correctement configurés.
- Assurez-vous que les tokens ne sont pas expirés.

### Problèmes de services tiers
- Vérifiez les identifiants d'API pour Twilio, AWS et l'API de vérification faciale.
- Assurez-vous que les services sont accessibles depuis votre serveur.

Cette documentation fournit un guide complet pour déployer Nexus 4.0 en production. Selon votre infrastructure spécifique, vous devrez peut-être ajuster certains paramètres.