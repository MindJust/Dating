import React from 'react';
import { useConfig } from '../../context/ConfigContext';

const ProfileCard = ({ profile, onLike, onPass }) => {
  const { config } = useConfig();
  
  // Trouver les URLs des photos
  const photoUrls = profile.photos?.map(photo => photo.url) || [];
  const mainPhoto = photoUrls[0] || '/src/assets/default-profile.png';
  
  // Trouver les réponses aux prompts
  const promptAnswers = profile.prompts?.slice(0, 3) || [];
  
  return (
    <div className="profile-card">
      <div className="profile-header">
        <div className="profile-image">
          <img src={mainPhoto} alt={`${profile.first_name}`} />
        </div>
        <div className="profile-info">
          <h3>{profile.first_name}</h3>
          <div className="profile-tags">
            {profile.tags?.slice(0, 3).map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>
      
      <div className="profile-prompts">
        {promptAnswers.map((prompt, index) => (
          <div key={index} className="prompt-answer">
            <p className="prompt">{prompt.prompt_text}</p>
            <p className="answer">{prompt.answer}</p>
          </div>
        ))}
      </div>
      
      <div className="profile-actions">
        <button className="action-button pass" onClick={onPass}>
          ✕
        </button>
        <button className="action-button like" onClick={onLike}>
          ❤️
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;