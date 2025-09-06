import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApiService from '../services/api.service';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // Dans une implémentation réelle, vous feriez une requête API ici
      // Pour cette démonstration, nous simulons les données
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Données simulées
      const mockUsers = [
        { id: 1, first_name: 'Alice', phone_number: '+33123456789', trust_level: 3, status: 'active', is_premium: true },
        { id: 2, first_name: 'Bob', phone_number: '+33123456788', trust_level: 2, status: 'active', is_premium: false },
        { id: 3, first_name: 'Charlie', phone_number: '+33123456787', trust_level: 1, status: 'suspended', is_premium: false },
        { id: 4, first_name: 'David', phone_number: '+33123456786', trust_level: 3, status: 'active', is_premium: true },
        { id: 5, first_name: 'Eve', phone_number: '+33123456785', trust_level: 2, status: 'banned', is_premium: false }
      ];
      
      setUsers(mockUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
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

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.phone_number.includes(searchTerm);
    
    const matchesFilter = filter === 'all' || 
                          (filter === 'premium' && user.is_premium) ||
                          (filter === 'verified' && user.trust_level === 3) ||
                          (filter === 'suspended' && user.status === 'suspended') ||
                          (filter === 'banned' && user.status === 'banned');
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return <div className="users-page">Chargement...</div>;
  }

  return (
    <div className="users-page">
      <div className="page-header">
        <h1>Gestion des utilisateurs</h1>
      </div>
      
      <div className="users-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Rechercher par nom ou numéro..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-box">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Tous les utilisateurs</option>
            <option value="premium">Premium uniquement</option>
            <option value="verified">Vérifiés uniquement</option>
            <option value="suspended">Suspendus</option>
            <option value="banned">Bannis</option>
          </select>
        </div>
      </div>
      
      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Téléphone</th>
              <th>Niveau de confiance</th>
              <th>Statut</th>
              <th>Premium</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.first_name}</td>
                <td>{user.phone_number}</td>
                <td>
                  <span className={`badge level-${user.trust_level}`}>
                    {getTrustLevelLabel(user.trust_level)}
                  </span>
                </td>
                <td>
                  <span className={`badge status-${user.status}`}>
                    {getStatusLabel(user.status)}
                  </span>
                </td>
                <td>
                  {user.is_premium ? '✅' : '❌'}
                </td>
                <td>
                  <Link to={`/users/${user.id}`} className="btn btn-secondary">
                    Voir
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;