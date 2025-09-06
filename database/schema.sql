-- Schéma de base de données PostgreSQL pour Nexus 4.0

-- Table des utilisateurs
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    trust_level INTEGER DEFAULT 1 CHECK (trust_level IN (1, 2, 3)),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned')),
    is_premium BOOLEAN DEFAULT false,
    premium_expires_at TIMESTAMP,
    is_admin BOOLEAN DEFAULT false, -- Ajout du champ is_admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des profils
CREATE TABLE profiles (
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    photos JSONB,
    prompts JSONB,
    tags VARCHAR(50)[],
    intention VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id)
);

-- Table des matchs
CREATE TABLE matches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
    user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unmatched')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user1_id, user2_id)
);

-- Table des messages
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    match_id UUID REFERENCES matches(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX idx_messages_match_id ON messages(match_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_matches_user1_id ON matches(user1_id);
CREATE INDEX idx_matches_user2_id ON matches(user2_id);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_updated_at ON profiles(updated_at);

-- Table des signalements
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reported_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reason VARCHAR(100),
    details TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'resolved')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour les signalements
CREATE INDEX idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX idx_reports_reported_id ON reports(reported_id);
CREATE INDEX idx_reports_status ON reports(status);

-- Table de configuration de l'application
CREATE TABLE app_config (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT,
    description TEXT
);

-- Table des lieux sûrs
CREATE TABLE venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    address VARCHAR(200),
    description TEXT,
    photo_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true
);

-- Table des likes
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    liked_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, liked_user_id)
);

-- Index pour les likes
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_liked_user_id ON likes(liked_user_id);

-- Table des plans premium
CREATE TABLE premium_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration_days INTEGER NOT NULL,
    features JSONB,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour les plans premium
CREATE INDEX idx_premium_plans_active ON premium_plans(active);

-- Insertion des configurations par défaut
INSERT INTO app_config (key, value, description) VALUES
('onboarding_welcome_title', 'Bienvenue sur Nexus', 'Titre de la page d''accueil'),
('like_button_label', 'Liker', 'Texte du bouton Like'),
('priorities_deck_size', '3', 'Nombre de profils dans le deck "Vos Priorités"'),
('message_cache_duration_days', '90', 'Durée de cache des messages en jours'),
('profile_cache_duration_hours', '24', 'Durée de cache des profils en heures'),
('verified_profile_boost', '50', 'Boost de visibilité pour les profils vérifiés (en %)');

-- Insertion de prompts de profil par défaut
INSERT INTO app_config (key, value, description) VALUES
('profile_prompt_1', 'Mon dimanche parfait à Bangui...', 'Prompt de profil #1'),
('profile_prompt_2', 'Une chose qui me fait rire à coup sûr...', 'Prompt de profil #2'),
('profile_prompt_3', 'Mon talent caché...', 'Prompt de profil #3'),
('profile_prompt_4', 'Le voyage de mes rêves...', 'Prompt de profil #4');