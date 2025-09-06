import React, { useState, useEffect } from 'react';
import { useConfig } from '../../context/ConfigContext';
import { useOffline } from '../../context/OfflineContext';
import ApiService from '../../services/api.service';
import ProfileCard from './ProfileCard';

const DiscoveryFeed = () => {
  const { config } = useConfig();
  const { isOnline } = useOffline();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, [page]);

  const loadProfiles = async () => {
    if (!isOnline || loading) return;
    
    setLoading(true);
    
    try {
      const data = await ApiService.getDiscoveryFeed(page);
      setProfiles(prev => [...prev, ...data.profiles]);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error('Failed to load profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action, profileId) => {
    try {
      // Envoyer l'action au serveur
      await ApiService.sendDiscoveryAction(action, profileId);
      
      // Retirer le profil de la liste
      setProfiles(prev => prev.filter(profile => profile.id !== profileId));
    } catch (error) {
      console.error('Failed to send action:', error);
    }
  };

  const handleLike = (profileId) => {
    handleAction('like', profileId);
  };

  const handlePass = (profileId) => {
    handleAction('pass', profileId);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="discovery-feed">
      <h2>Découverte</h2>
      
      {profiles.length === 0 && !loading && (
        <div className="empty-state">
          <p>Aucun profil à découvrir pour le moment.</p>
        </div>
      )}
      
      {profiles.map(profile => (
        <ProfileCard
          key={profile.id}
          profile={profile}
          onLike={() => handleLike(profile.id)}
          onPass={() => handlePass(profile.id)}
        />
      ))}
      
      {hasMore && (
        <button 
          className="load-more-button" 
          onClick={loadMore} 
          disabled={loading}
        >
          {loading ? 'Chargement...' : 'Voir plus'}
        </button>
      )}
      
      {!isOnline && (
        <div className="offline-notice">
          Vous êtes actuellement hors ligne. Les profils sont chargés depuis le cache.
        </div>
      )}
    </div>
  );
};

export default DiscoveryFeed;