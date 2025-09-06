import React from 'react';

const Header = ({ onLogout }) => {
  return (
    <header className="dashboard-header">
      <div className="header-content">
        <h1>Nexus Superadmin Dashboard</h1>
        <div className="header-actions">
          <button onClick={onLogout} className="logout-button">
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;