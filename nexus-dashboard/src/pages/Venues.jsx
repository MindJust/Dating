import React, { useState, useEffect } from 'react';

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingVenue, setEditingVenue] = useState(null);

  useEffect(() => {
    loadVenues();
  }, []);

  const loadVenues = async () => {
    try {
      // Dans une implémentation réelle, vous feriez une requête API ici
      // Pour cette démonstration, nous simulons les données
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Données simulées
      const mockVenues = [
        {
          id: 1,
          name: 'Café de la Paix',
          address: '123 Rue de la Paix, 75000 Paris',
          description: 'Un café calme avec une bonne connexion WiFi',
          photo_url: 'https://example.com/cafe_paix.jpg',
          is_active: true
        },
        {
          id: 2,
          name: 'Parc de la Grotte',
          address: '456 Avenue de la Grotte, 75000 Paris',
          description: 'Un grand parc public avec des aires de jeux',
          photo_url: 'https://example.com/parc_grotte.jpg',
          is_active: true
        },
        {
          id: 3,
          name: 'Bibliothèque municipale',
          address: '789 Boulevard des Livres, 75000 Paris',
          description: 'Espace de lecture et de travail silencieux',
          photo_url: 'https://example.com/bibliotheque.jpg',
          is_active: false
        }
      ];
      
      setVenues(mockVenues);
    } catch (error) {
      console.error('Failed to load venues:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingVenue(null);
    setShowForm(true);
  };

  const handleEdit = (venue) => {
    setEditingVenue(venue);
    setShowForm(true);
  };

  const handleDelete = async (venueId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce lieu sûr ?')) {
      return;
    }
    
    try {
      // Dans une implémentation réelle, vous feriez une requête API ici
      // Pour cette démonstration, nous simulons la suppression
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mettre à jour l'état localement
      setVenues(prev => prev.filter(venue => venue.id !== venueId));
      
      alert('Lieu sûr supprimé avec succès');
    } catch (error) {
      console.error('Failed to delete venue:', error);
      alert('Échec de la suppression du lieu sûr');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      // Dans une implémentation réelle, vous feriez une requête API ici
      // Pour cette démonstration, nous simulons la création/mise à jour
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (editingVenue) {
        // Mise à jour
        setVenues(prev => prev.map(venue => 
          venue.id === editingVenue.id ? { ...venue, ...formData } : venue
        ));
        alert('Lieu sûr mis à jour avec succès');
      } else {
        // Création
        const newVenue = {
          id: Date.now(), // ID temporaire
          ...formData
        };
        setVenues(prev => [...prev, newVenue]);
        alert('Lieu sûr créé avec succès');
      }
      
      setShowForm(false);
    } catch (error) {
      console.error('Failed to save venue:', error);
      alert('Échec de l\'enregistrement du lieu sûr');
    }
  };

  if (loading) {
    return <div className="venues-page">Chargement...</div>;
  }

  return (
    <div className="venues-page">
      <div className="page-header">
        <h1>Gestion des lieux sûrs</h1>
        <button className="btn btn-primary" onClick={handleCreate}>
          Ajouter un lieu sûr
        </button>
      </div>
      
      {showForm ? (
        <VenueForm 
          venue={editingVenue} 
          onSubmit={handleSubmit} 
          onCancel={() => setShowForm(false)} 
        />
      ) : (
        <div className="venues-table">
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Adresse</th>
                <th>Description</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {venues.map(venue => (
                <tr key={venue.id}>
                  <td>{venue.name}</td>
                  <td>{venue.address}</td>
                  <td>{venue.description}</td>
                  <td>
                    {venue.is_active ? (
                      <span className="badge badge-success">Actif</span>
                    ) : (
                      <span className="badge badge-secondary">Inactif</span>
                    )}
                  </td>
                  <td>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handleEdit(venue)}
                    >
                      Modifier
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => handleDelete(venue.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const VenueForm = ({ venue, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: venue?.name || '',
    address: venue?.address || '',
    description: venue?.description || '',
    photo_url: venue?.photo_url || '',
    is_active: venue?.is_active ?? true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="venue-form">
      <h2>{venue ? 'Modifier un lieu sûr' : 'Ajouter un lieu sûr'}</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nom</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="address">Adresse</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="photo_url">URL de la photo</label>
          <input
            type="text"
            id="photo_url"
            name="photo_url"
            value={formData.photo_url}
            onChange={handleChange}
          />
        </div>
        
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="is_active"
              checked={formData.is_active}
              onChange={handleChange}
            />
            Lieu actif
          </label>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Enregistrer
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default Venues;