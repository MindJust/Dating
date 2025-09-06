import React, { useState, useEffect } from 'react';
import ApiService from '../../services/api.service';

const SafeVenues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    setLoading(true);
    
    try {
      const data = await ApiService.getSafetyVenues();
      setVenues(data);
    } catch (error) {
      console.error('Failed to load venues:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="safe-venues">
      <h2>Lieux Sûrs</h2>
      
      {loading && (
        <div className="loading">Chargement...</div>
      )}
      
      {venues.length === 0 && !loading && (
        <div className="empty-state">
          <p>Aucun lieu sûr disponible pour le moment.</p>
        </div>
      )}
      
      <div className="venues-list">
        {venues.map(venue => (
          <div key={venue.id} className="venue-card">
            {venue.photo_url && (
              <img src={venue.photo_url} alt={venue.name} />
            )}
            <div className="venue-info">
              <h3>{venue.name}</h3>
              <p className="address">{venue.address}</p>
              <p className="description">{venue.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SafeVenues;