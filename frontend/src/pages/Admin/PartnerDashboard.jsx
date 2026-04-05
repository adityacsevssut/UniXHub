import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Palette, LogOut, Layout, ExternalLink, Settings, UserCircle, Briefcase } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import GDPartnerDashboard from './GDPartnerDashboard';
import './PartnerDashboard.css';

const PartnerDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || user.role !== 'partner') {
    window.location.href = '/partner-login';
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isGraphicDesigner = user.serviceId === 'Graphic Design' || user.businessId?.startsWith('GD_PARTNER');

  if (isGraphicDesigner) {
    return <GDPartnerDashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="partner-dashboard">
      <Navbar minimal={true} />
      <div className="dashboard-container">

        {/* Header Section */}
        <header className="dashboard-header">
          <div className="header-content">
            <h1 className="welcome-title">
              Welcome, <span className="highlight-text">{user.name}</span>
            </h1>
            <p className="welcome-subtitle">
              {isGraphicDesigner
                ? 'Graphic Design Partner Control Center'
                : 'Partner Management Dashboard'}
            </p>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={18} /> <span>Logout</span>
          </button>
        </header>

        {/* Dashboard Actions Grid */}
        <div className="dashboard-grid">

          {/* Your Dashboard (Coming Soon) */}
          <div className="dash-card">
            <div className="card-icon-bg tertiary">
              <UserCircle size={32} />
            </div>
            <div className="card-content">
              <h3>Your Dashboard</h3>
              <p>Manage your account details, business ID, showcase, and contact info.</p>
              <span className="coming-soon">Coming Soon</span>
            </div>
          </div>

          {/* Analytics (Mock) */}


        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PartnerDashboard;
