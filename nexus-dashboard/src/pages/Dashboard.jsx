import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import ApiService from '../services/api.service';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    verifiedUsers: 0,
    totalMatches: 0,
    newUsersToday: 0,
    revenue: 0
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Dans une implémentation réelle, vous feriez des requêtes API ici
      // Pour cette démonstration, nous simulons les données
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Données simulées
      setStats({
        totalUsers: 1240,
        activeUsers: 856,
        verifiedUsers: 324,
        totalMatches: 567,
        newUsersToday: 24,
        revenue: 1240.50
      });
      
      setRecentActivity([
        { id: 1, type: 'Nouvel utilisateur', description: 'Alice a rejoint la plateforme', time: 'Il y a 5 minutes' },
        { id: 2, type: 'Nouveau match', description: 'Bob et Charlie ont matché', time: 'Il y a 12 minutes' },
        { id: 3, type: 'Vérification', description: 'David a été vérifié', time: 'Il y a 25 minutes' },
        { id: 4, type: 'Signalement', description: 'Eve a signalé un utilisateur', time: 'Il y a 1 heure' },
        { id: 5, type: 'Abonnement', description: 'Frank a souscrit à Nexus Premium', time: 'Il y a 2 heures' }
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Données pour le graphique
  const chartData = [
    { name: 'Lun', utilisateurs: 12 },
    { name: 'Mar', utilisateurs: 19 },
    { name: 'Mer', utilisateurs: 15 },
    { name: 'Jeu', utilisateurs: 22 },
    { name: 'Ven', utilisateurs: 18 },
    { name: 'Sam', utilisateurs: 25 },
    { name: 'Dim', utilisateurs: 30 }
  ];

  if (loading) {
    return <div className="dashboard">Chargement...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Tableau de bord</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Utilisateurs totaux</h3>
          <p className="stat-value">{stats.totalUsers}</p>
        </div>
        
        <div className="stat-card">
          <h3>Utilisateurs actifs</h3>
          <p className="stat-value">{stats.activeUsers}</p>
        </div>
        
        <div className="stat-card">
          <h3>Utilisateurs vérifiés</h3>
          <p className="stat-value">{stats.verifiedUsers}</p>
        </div>
        
        <div className="stat-card">
          <h3>Matches créés</h3>
          <p className="stat-value">{stats.totalMatches}</p>
        </div>
        
        <div className="stat-card">
          <h3>Nouveaux aujourd'hui</h3>
          <p className="stat-value">{stats.newUsersToday}</p>
        </div>
        
        <div className="stat-card">
          <h3>Revenus (€)</h3>
          <p className="stat-value">{stats.revenue.toFixed(2)}</p>
        </div>
      </div>
      
      <div className="charts-section">
        <div className="chart-container">
          <h2>Inscriptions cette semaine</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="utilisateurs" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="activity-section">
        <h2>Activité récente</h2>
        <div className="activity-list">
          {recentActivity.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                {activity.type === 'Nouvel utilisateur' && '👤'}
                {activity.type === 'Nouveau match' && '💕'}
                {activity.type === 'Vérification' && '✅'}
                {activity.type === 'Signalement' && '🚩'}
                {activity.type === 'Abonnement' && '💰'}
              </div>
              <div className="activity-content">
                <h4>{activity.type}</h4>
                <p>{activity.description}</p>
              </div>
              <div className="activity-time">
                {activity.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;