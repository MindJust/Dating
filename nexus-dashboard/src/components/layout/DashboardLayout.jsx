import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './DashboardLayout.css';

const DashboardLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Supprimer le token d'authentification
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  return (
    <div className="dashboard-layout">
      <Sidebar onLogout={handleLogout} />
      <div className="main-content">
        <Header onLogout={handleLogout} />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;