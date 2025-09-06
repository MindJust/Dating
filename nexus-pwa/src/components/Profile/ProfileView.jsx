import React from 'react';
import { useConfig } from '../../context/ConfigContext';

const ProfileView = ({ user, isOwnProfile = false }) => {
  const { config } = useConfig();
  
  // Trouver les URLs des photos
  const photoUrls = user.profile?.photos?.map(photo => photo.url) || [];
  
  // Trouver les réponses aux prompts
  const promptAnswers = user.profile?.prompts?.slice(0, 3) || [];
  
  // Déterminer le niveau de confiance
  const getTrustLevelLabel = (level) => {
    switch (level) {
      case 1: return 'Fantôme';
      case 2: return 'Actif';
      case 3: return 'Vérifié';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="profile-view">
      <div className="profile-header">
        <div className="profile-photos">
          {photoUrls.length > 0 ? (
            photoUrls.map((url, index) => (
              <img key={index} src={url} alt={`Photo ${index + 1}`} />
            ))
          ) : (
            <div className="placeholder-photo">
              <span>Aucune photo</span>
            </div>
          )}
        </div>
        
        <div className="profile-basic-info">
          <h2>{user.first_name}</h2>
          <div className="trust-level">
            <span className={`badge level-${user.trust_level}`}>
              {getTrustLevelLabel(user.trust_level)}
            </span>
            {user.trust_level === 3 && (
              <span className="shield">🛡️</span>
            )}
          </div>
          
          {user.is_premium && (
            <div className="premium-badge">
              <span>Premium</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="profile-details">
        <div className="profile-section">
          <h3>Prompts</h3>
          {promptAnswers.length > 0 ? (
            promptAnswers.map((prompt, index) => (
              <div key={index} className="prompt-answer">
                <p className="prompt">{prompt.prompt_text}</p>
                <p className="answer">{prompt.answer}</p>
              </div>
            ))
          ) : (
            <p>Aucun prompt renseigné</p>
          )}
        </div>
        
        <div className="profile-section">
          <h3>Tags</h3>
          <div className="tags">
            {user.profile?.tags?.length > 0 ? (
              user.profile.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))
            ) : (
              <p>Aucun tag</p>
            )}
          </div>
        </div>
        
        <div className="profile-section">
          <h3>Intention</h3>
          <p>{user.profile?.intention || 'Non renseignée'}</p>
        </div>
      </div>
      
      {isOwnProfile && (
        <div className="profile-actions">
          <button className="edit-button">
            Modifier mon profil
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileView;