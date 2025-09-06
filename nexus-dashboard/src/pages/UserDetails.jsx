import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const UserDetails = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, [userId]);

  const loadUser = async () => {
    try {
      // Dans une implémentation réelle, vous feriez une requête API ici
      // Pour cette démonstration, nous simulons les données
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Données simulées
      const mockUser = {
        id: userId,
        first_name: 'Alice',
        phone_number: '+33123456789',
        trust_level: 3,
        status: 'active',
        is_premium: true,
        premium_expires_at: '2024-12-31T23:59:59Z',
        created_at: '2023-01-15T10:30:00Z',
        profile: {
          photos: [
            { url: 'https://example.com/photo1.jpg' },
            { url: 'https://example.com/photo2.jpg' }
          ],
          prompts: [
            { prompt_text: 'Mon dimanche parfait...', answer: 'Passer la journée au bord du lac' },
            { prompt_text: 'Une chose qui me fait rire...', answer: 'Les blagues de mon cousin' }
          ],
          tags: ['musique', 'nature', 'voyages'],
          intention: 'Rencontrer des personnes authentiques'
        },
        matches: [
          { id: 1, user: { first_name: 'Bob' }, created_at: '2023-06-15T14:30:00Z' },
          { id: 2, user: { first_name: 'Charlie' }, created_at: '2023-07-22T18:45:00Z' }
        ],
        reports_made: [
          { id: 1, reported_user: { first_name: 'David' }, reason: 'Comportement inapproprié', created_at: '2023-05-10T09:15:00Z' }
        ],
        reports_received: [
          { id: 1, reporter: { first_name: 'Eve' }, reason: 'Spam', created_at: '2023-04-18T16:20:00Z' }
        ]
      };
      
      setUser(mockUser);
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrustLevelLabel = (level) => {
    switch (level) {
      case 1: return 'Fantôme';
      case 2: return 'Actif';
      case 3: return 'Vérifié';
      default: return 'Inconnu';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'suspended': return 'Suspendu';
      case 'banned': return 'Banni';
      default: return 'Inconnu';
    }
  };

  if (loading) {
    return <div className="user-details-page">Chargement...</div>;
  }

  if (!user) {
    return <div className="user-details-page">Utilisateur non trouvé</div>;
  }

  return (
    <div className="user-details-page">
      <div className="page-header">
        <h1>Détails de l'utilisateur</h1>
      </div>
      
      <div className="user-profile-section">
        <div className="user-basic-info">
          <h2>{user.first_name}</h2>
          <p><strong>Téléphone:</strong> {user.phone_number}</p>
          <p>
            <strong>Niveau de confiance:</strong>
            <span className={`badge level-${user.trust_level}`}>
              {getTrustLevelLabel(user.trust_level)}
            </span>
          </p>
          <p>
            <strong>Statut:</strong>
            <span className={`badge status-${user.status}`}>
              {getStatusLabel(user.status)}
            </span>
          </p>
          <p>
            <strong>Premium:</strong>
            {user.is_premium ? (
              <span className="badge badge-success">Oui (expire le {new Date(user.premium_expires_at).toLocaleDateString()})</span>
            ) : (
              <span className="badge badge-secondary">Non</span>
            )}
          </p>
          <p><strong>Inscrit le:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
        </div>
        
        <div className="user-profile-details">
          <h3>Profil</h3>
          <div className="profile-photos">
            {user.profile.photos.map((photo, index) => (
              <img key={index} src={photo.url} alt={`Photo ${index + 1}`} />
            ))}
          </div>
          
          <div className="profile-prompts">
            <h4>Prompts</h4>
            {user.profile.prompts.map((prompt, index) => (
              <div key={index} className="prompt-answer">
                <p className="prompt">{prompt.prompt_text}</p>
                <p className="answer">{prompt.answer}</p>
              </div>
            ))}
          </div>
          
          <div className="profile-tags">
            <h4>Tags</h4>
            {user.profile.tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
          
          <div className="profile-intention">
            <h4>Intention</h4>
            <p>{user.profile.intention}</p>
          </div>
        </div>
      </div>
      
      <div className="user-matches-section">
        <h3>Matchs ({user.matches.length})</h3>
        <div className="matches-list">
          {user.matches.map(match => (
            <div key={match.id} className="match-item">
              <p><strong>{match.user.first_name}</strong></p>
              <p>Matché le {new Date(match.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="user-reports-section">
        <h3>Signalements</h3>
        <div className="reports-grid">
          <div className="reports-section">
            <h4>Signalements faits ({user.reports_made.length})</h4>
            {user.reports_made.length > 0 ? (
              <div className="reports-list">
                {user.reports_made.map(report => (
                  <div key={report.id} className="report-item">
                    <p><strong>{report.reported_user.first_name}</strong></p>
                    <p>Raison: {report.reason}</p>
                    <p>Date: {new Date(report.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>Aucun signalement fait</p>
            )}
          </div>
          
          <div className="reports-section">
            <h4>Signalements reçus ({user.reports_received.length})</h4>
            {user.reports_received.length > 0 ? (
              <div className="reports-list">
                {user.reports_received.map(report => (
                  <div key={report.id} className="report-item">
                    <p><strong>{report.reporter.first_name}</strong></p>
                    <p>Raison: {report.reason}</p>
                    <p>Date: {new Date(report.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>Aucun signalement reçu</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="user-actions">
        <button className="btn btn-secondary">Envoyer un avertissement</button>
        <button className="btn btn-warning">Suspendre</button>
        <button className="btn btn-danger">Bannir</button>
        <button className="btn btn-success">Accorder le statut Premium</button>
      </div>
    </div>
  );
};

export default UserDetails;