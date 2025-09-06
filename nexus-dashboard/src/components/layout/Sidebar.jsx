import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ onLogout }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Tableau de bord', icon: '📊' },
    { path: '/users', label: 'Utilisateurs', icon: '👥' },
    { path: '/reports', label: 'Signalements', icon: '🚩' },
    { path: '/venues', label: 'Lieux Sûrs', icon: '📍' },
    { path: '/config', label: 'Configuration', icon: '⚙️' },
    { path: '/premium', label: 'Monétisation', icon: '💰' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Nexus Admin</h2>
      </div>
      
      <nav className="sidebar-nav">
        <ul>
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link 
                to={item.path} 
                className={location.pathname === item.path ? 'active' : ''}
              >
                <span className="icon">{item.icon}</span>
                <span className="label">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="sidebar-footer">
        <button onClick={onLogout} className="logout-button">
          <span className="icon">🚪</span>
          <span className="label">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;