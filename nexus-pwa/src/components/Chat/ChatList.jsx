import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOffline } from '../../context/OfflineContext';
import ApiService from '../../services/api.service';

const ChatList = () => {
  const navigate = useNavigate();
  const { isOnline, getMatches } = useOffline();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMatches();
  }, [isOnline]);

  const loadMatches = async () => {
    setLoading(true);
    
    try {
      let data;
      
      if (isOnline) {
        // Charger depuis l'API
        data = await ApiService.getMatches();
      } else {
        // Charger depuis IndexedDB
        data = await getMatches();
      }
      
      setMatches(data);
    } catch (error) {
      console.error('Failed to load matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMatchClick = (matchId) => {
    navigate(`/chat/${matchId}`);
  };

  return (
    <div className="chat-list">
      <h2>Conversations</h2>
      
      {loading && (
        <div className="loading">Chargement...</div>
      )}
      
      {matches.length === 0 && !loading && (
        <div className="empty-state">
          <p>Aucune conversation pour le moment.</p>
        </div>
      )}
      
      {matches.map(match => (
        <div 
          key={match.id} 
          className="match-item"
          onClick={() => handleMatchClick(match.id)}
        >
          <div className="match-info">
            <h4>{match.user.first_name}</h4>
            <p>Dernier message: {match.last_message?.content || 'Aucun message'}</p>
          </div>
          <div className="match-status">
            {match.unread_count > 0 && (
              <span className="unread-badge">{match.unread_count}</span>
            )}
          </div>
        </div>
      ))}
      
      {!isOnline && (
        <div className="offline-notice">
          Vous êtes actuellement hors ligne. Les conversations sont chargées depuis le cache.
        </div>
      )}
    </div>
  );
};

export default ChatList;