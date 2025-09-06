import React, { useState, useEffect } from 'react';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    loadReports();
  }, [filter]);

  const loadReports = async () => {
    try {
      // Dans une implémentation réelle, vous feriez une requête API ici
      // Pour cette démonstration, nous simulons les données
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Données simulées
      const mockReports = [
        {
          id: 1,
          reporter: { first_name: 'Alice' },
          reported: { first_name: 'Bob' },
          reason: 'Comportement inapproprié',
          details: 'L\'utilisateur a envoyé des messages offensants',
          status: 'pending',
          created_at: '2023-08-15T14:30:00Z'
        },
        {
          id: 2,
          reporter: { first_name: 'Charlie' },
          reported: { first_name: 'David' },
          reason: 'Spam',
          details: 'L\'utilisateur envoie des messages non sollicités',
          status: 'resolved',
          created_at: '2023-08-14T10:15:00Z'
        },
        {
          id: 3,
          reporter: { first_name: 'Eve' },
          reported: { first_name: 'Frank' },
          reason: 'Profil inapproprié',
          details: 'Photos non conformes aux règles de la plateforme',
          status: 'pending',
          created_at: '2023-08-13T16:45:00Z'
        }
      ];
      
      setReports(mockReports);
    } catch (error) {
      console.error('Failed to load reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'resolved': return 'Traité';
      default: return 'Inconnu';
    }
  };

  const filteredReports = reports.filter(report => 
    filter === 'all' || report.status === filter
  );

  const handleResolve = async (reportId) => {
    try {
      // Dans une implémentation réelle, vous feriez une requête API ici
      // Pour cette démonstration, nous simulons la mise à jour
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mettre à jour l'état localement
      setReports(prev => prev.map(report => 
        report.id === reportId ? { ...report, status: 'resolved' } : report
      ));
      
      alert('Signalement traité avec succès');
    } catch (error) {
      console.error('Failed to resolve report:', error);
      alert('Échec du traitement du signalement');
    }
  };

  if (loading) {
    return <div className="reports-page">Chargement...</div>;
  }

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Gestion des signalements</h1>
      </div>
      
      <div className="reports-controls">
        <div className="filter-box">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Tous les signalements</option>
            <option value="pending">En attente</option>
            <option value="resolved">Traité</option>
          </select>
        </div>
      </div>
      
      <div className="reports-table">
        <table>
          <thead>
            <tr>
              <th>Signaleur</th>
              <th>Signalé</th>
              <th>Raison</th>
              <th>Détails</th>
              <th>Date</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.map(report => (
              <tr key={report.id}>
                <td>{report.reporter.first_name}</td>
                <td>{report.reported.first_name}</td>
                <td>{report.reason}</td>
                <td>{report.details}</td>
                <td>{new Date(report.created_at).toLocaleDateString()}</td>
                <td>
                  <span className={`badge status-${report.status}`}>
                    {getStatusLabel(report.status)}
                  </span>
                </td>
                <td>
                  {report.status === 'pending' && (
                    <button 
                      className="btn btn-success"
                      onClick={() => handleResolve(report.id)}
                    >
                      Traiter
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reports;