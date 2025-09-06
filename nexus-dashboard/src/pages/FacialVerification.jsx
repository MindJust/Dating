import React, { useState, useEffect } from 'react';
import ApiService from '../services/api.service';

const FacialVerification = () => {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVerification, setSelectedVerification] = useState(null);

  useEffect(() => {
    loadPendingVerifications();
  }, []);

  const loadPendingVerifications = async () => {
    try {
      // Dans une implémentation réelle, vous feriez une requête API ici
      // Pour cette démonstration, nous simulons les données
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Données simulées
      const mockVerifications = [
        { 
          id: 1, 
          user_id: 101, 
          user_name: 'Alice Dupont', 
          user_phone: '+33123456789', 
          request_date: '2023-10-15T10:30:00Z',
          status: 'pending',
          photos: [
            { id: 1, url: 'https://placehold.co/300x400', type: 'id_card' },
            { id: 2, url: 'https://placehold.co/300x400', type: 'selfie' }
          ]
        },
        { 
          id: 2, 
          user_id: 102, 
          user_name: 'Bob Martin', 
          user_phone: '+33123456788', 
          request_date: '2023-10-16T14:45:00Z',
          status: 'pending',
          photos: [
            { id: 3, url: 'https://placehold.co/300x400', type: 'id_card' },
            { id: 4, url: 'https://placehold.co/300x400', type: 'selfie' }
          ]
        },
        { 
          id: 3, 
          user_id: 103, 
          user_name: 'Charlie Bernard', 
          user_phone: '+33123456787', 
          request_date: '2023-10-17T09:15:00Z',
          status: 'pending',
          photos: [
            { id: 5, url: 'https://placehold.co/300x400', type: 'id_card' },
            { id: 6, url: 'https://placehold.co/300x400', type: 'selfie' }
          ]
        }
      ];
      
      setVerifications(mockVerifications);
    } catch (error) {
      console.error('Failed to load verifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (verificationId) => {
    try {
      // Trouver la vérification dans la liste
      const verification = verifications.find(v => v.id === verificationId);
      if (!verification) {
        throw new Error('Verification not found');
      }
      
      // Mettre à jour le niveau de confiance de l'utilisateur à "Vérifié" (niveau 3)
      await ApiService.request(`/admin/users/${verification.user_id}/trust-level`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trust_level: 3 })
      });
      
      // Mettre à jour l'état local
      setVerifications(prev => 
        prev.map(v => 
          v.id === verificationId 
            ? { ...v, status: 'approved' } 
            : v
        )
      );
      
      // Si c'est la vérification sélectionnée, mettre à jour aussi
      if (selectedVerification && selectedVerification.id === verificationId) {
        setSelectedVerification({ ...selectedVerification, status: 'approved' });
      }
      
      alert('Vérification approuvée avec succès! L\'utilisateur est maintenant au niveau de confiance "Vérifié".');
    } catch (error) {
      console.error('Failed to approve verification:', error);
      alert('Erreur lors de l\'approbation de la vérification');
    }
  };

  const handleReject = async (verificationId) => {
    try {
      // Trouver la vérification dans la liste
      const verification = verifications.find(v => v.id === verificationId);
      if (!verification) {
        throw new Error('Verification not found');
      }
      
      // Pour les rejets, nous pourrions:
      // 1. Garder le niveau de confiance actuel
      // 2. Réduire le niveau de confiance
      // 3. Marquer pour révision
      // Pour cette implémentation, nous gardons le niveau actuel
      
      // Mettre à jour l'état local
      setVerifications(prev => 
        prev.map(v => 
          v.id === verificationId 
            ? { ...v, status: 'rejected' } 
            : v
        )
      );
      
      // Si c'est la vérification sélectionnée, mettre à jour aussi
      if (selectedVerification && selectedVerification.id === verificationId) {
        setSelectedVerification({ ...selectedVerification, status: 'rejected' });
      }
      
      alert('Vérification rejetée avec succès!');
    } catch (error) {
      console.error('Failed to reject verification:', error);
      alert('Erreur lors du rejet de la vérification');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvée';
      case 'rejected': return 'Rejetée';
      default: return 'Inconnu';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  };

  if (loading) {
    return <div className="facial-verification-page">Chargement...</div>;
  }

  return (
    <div className="facial-verification-page">
      <div className="page-header">
        <h1>Vérifications faciales</h1>
        <p>Gérez les demandes de vérification faciale des utilisateurs</p>
      </div>
      
      <div className="verification-stats">
        <div className="stat-card">
          <h3>En attente</h3>
          <p className="stat-number">
            {verifications.filter(v => v.status === 'pending').length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Approuvées</h3>
          <p className="stat-number">
            {verifications.filter(v => v.status === 'approved').length}
          </p>
        </div>
        <div className="stat-card">
          <h3>Rejetées</h3>
          <p className="stat-number">
            {verifications.filter(v => v.status === 'rejected').length}
          </p>
        </div>
      </div>
      
      <div className="verification-list">
        <h2>Demandes en attente</h2>
        
        {verifications.filter(v => v.status === 'pending').length === 0 ? (
          <div className="no-verifications">
            <p>Aucune demande de vérification en attente</p>
          </div>
        ) : (
          <div className="verifications-grid">
            {verifications
              .filter(v => v.status === 'pending')
              .map(verification => (
                <div 
                  key={verification.id} 
                  className={`verification-card ${selectedVerification?.id === verification.id ? 'selected' : ''}`}
                  onClick={() => setSelectedVerification(verification)}
                >
                  <div className="user-info">
                    <h3>{verification.user_name}</h3>
                    <p>{verification.user_phone}</p>
                    <p className="request-date">Demande du {formatDate(verification.request_date)}</p>
                  </div>
                  
                  <div className="verification-photos">
                    {verification.photos.map(photo => (
                      <div key={photo.id} className="photo-preview">
                        <img src={photo.url} alt={photo.type} />
                        <span className="photo-type">
                          {photo.type === 'id_card' ? 'Pièce d\'identité' : 'Selfie'}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="verification-actions">
                    <button 
                      className="btn btn-success"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApprove(verification.id);
                      }}
                    >
                      Approuver
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReject(verification.id);
                      }}
                    >
                      Rejeter
                    </button>
                  </div>
                </div>
              ))
            }
          </div>
        )}
      </div>
      
      {selectedVerification && (
        <div className="verification-detail">
          <div className="detail-header">
            <h2>Détails de la vérification</h2>
            <button 
              className="btn btn-secondary"
              onClick={() => setSelectedVerification(null)}
            >
              Fermer
            </button>
          </div>
          
          <div className="detail-content">
            <div className="user-summary">
              <h3>{selectedVerification.user_name}</h3>
              <p>{selectedVerification.user_phone}</p>
              <p className={`status-badge ${getStatusClass(selectedVerification.status)}`}>
                {getStatusLabel(selectedVerification.status)}
              </p>
              <p>Demande du {formatDate(selectedVerification.request_date)}</p>
            </div>
            
            <div className="photos-detail">
              <h3>Photos soumises</h3>
              <div className="photos-container">
                {selectedVerification.photos.map(photo => (
                  <div key={photo.id} className="photo-detail">
                    <img src={photo.url} alt={photo.type} />
                    <p>{photo.type === 'id_card' ? 'Pièce d\'identité' : 'Selfie'}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="detail-actions">
              <button 
                className="btn btn-success"
                onClick={() => handleApprove(selectedVerification.id)}
                disabled={selectedVerification.status !== 'pending'}
              >
                Approuver la vérification
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => handleReject(selectedVerification.id)}
                disabled={selectedVerification.status !== 'pending'}
              >
                Rejeter la vérification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacialVerification;