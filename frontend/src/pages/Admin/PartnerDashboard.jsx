import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Palette, LogOut, Layout, ExternalLink, Settings, UserCircle, Briefcase } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
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

  return (
    <div className="partner-dashboard">
      <Navbar />
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

          {/* Main Service Management Card */}
          {isGraphicDesigner && (
            <div className="dash-card primary-card" onClick={() => navigate('/partner/graphic-design')}>
              <div className="card-icon-bg">
                <Palette size={40} />
              </div>
              <div className="card-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3>Manage Design Catalog</h3>
                <p>Add or update your services, quick actions, and pricing options.</p>
                <span className="card-link">Enter Panel Section</span>
              </div>
            </div>
          )}

          {/* View Live Site Card */}
          <div className="dash-card" onClick={() => navigate('/graphic-design')}>
            <div className="card-icon-bg secondary">
              <ExternalLink size={32} />
            </div>
            <div className="card-content">
              <h3>View Live Page</h3>
              <p>See how your services appear to customers on the main website.</p>
            </div>
          </div>

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
