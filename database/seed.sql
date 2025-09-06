-- Données de test pour Nexus 4.0

-- Insérer des utilisateurs de test
INSERT INTO users (id, phone_number, first_name, trust_level, status, is_premium, premium_expires_at, is_admin) VALUES
('11111111-1111-1111-1111-111111111111', '+242012345678', 'Alice', 3, 'active', true, CURRENT_TIMESTAMP + INTERVAL '30 days', false),
('22222222-2222-2222-2222-222222222222', '+242012345679', 'Bob', 2, 'active', false, NULL, false),
('33333333-3333-3333-3333-333333333333', '+242012345680', 'Charlie', 1, 'active', false, NULL, true); -- Admin user

-- Insérer des profils de test
INSERT INTO profiles (user_id, photos, prompts, tags, intention) VALUES
('11111111-1111-1111-1111-111111111111', 
  '[{"url": "https://example.com/alice1.jpg", "slot": 1}, {"url": "https://example.com/alice2.jpg", "slot": 2}, {"url": "https://example.com/alice3.jpg", "slot": 3}]',
  '[{"prompt_id": 1, "answer": "Passer la journée au bord du fleuve avec des amis"}, {"prompt_id": 2, "answer": "Les blagues de Tonton Henri"}, {"prompt_id": 3, "answer": "Faire des ricochets sur l''eau"}]',
  ARRAY['musique', 'nature', 'amis'],
  'Rencontrer des personnes authentiques'),

('22222222-2222-2222-2222-222222222222',
  '[{"url": "https://example.com/bob1.jpg", "slot": 1}, {"url": "https://example.com/bob2.jpg", "slot": 2}, {"url": "https://example.com/bob3.jpg", "slot": 3}]',
  '[{"prompt_id": 1, "answer": "Un bon repas en famille"}, {"prompt_id": 2, "answer": "Les vidéos de chats"}, {"prompt_id": 3, "answer": "Faire semblant de comprendre les règles du rugby"}]',
  ARRAY['famille', 'sport', 'cuisine'],
  'Trouver une connexion sérieuse'),

('33333333-3333-3333-3333-333333333333',
  NULL,
  NULL,
  NULL,
  NULL);

-- Insérer des lieux sûrs de test
INSERT INTO venues (name, address, description, photo_url, is_active) VALUES
('Café de la Paix', 'Avenue de l''Indépendance, Brazzaville', 'Un café calme avec une bonne connexion WiFi', 'https://example.com/cafe_paix.jpg', true),
('Parc de la Grotte', 'Quartier Bacongo, Brazzaville', 'Un grand parc public avec des aires de jeux', 'https://example.com/parc_grotte.jpg', true),
('Bibliothèque municipale', 'Avenue Charles de Gaulle, Brazzaville', 'Espace de lecture et de travail silencieux', 'https://example.com/bibliotheque.jpg', true);

-- Insérer des plans premium de test
INSERT INTO premium_plans (name, price, duration_days, features, active) VALUES
('Nexus Mensuel', 9.99, 30, '["Voir les likes reçus", "Filtres de recherche avancés", "Mode Incognito"]', true),
('Nexus Trimestriel', 24.99, 90, '["Voir les likes reçus", "Filtres de recherche avancés", "Mode Incognito", "Boost de profil hebdomadaire"]', true),
('Nexus Annuel', 79.99, 365, '["Voir les likes reçus", "Filtres de recherche avancés", "Mode Incognito", "Boost de profil hebdomadaire", "Profil en vedette"]', true);