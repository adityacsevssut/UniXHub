import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import './GraphicDesignPage.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Helper to get icon with props (Dynamic for both Lucide and URL)
const getIcon = (item, size) => {
  if (item.iconType === 'url') {
    return <img src={item.icon} alt={item.title} style={{ width: size, height: size, objectFit: 'contain' }} />;
  }

  // Backwards compatibility or direct Lucide name
  const iconName = item.icon || item.iconName;
  const IconComponent = LucideIcons[iconName];

  return IconComponent ? <IconComponent size={size || 24} /> : null;
};

const GraphicDesignPage = () => {
  const [services, setServices] = useState([]);
  const [quickActions, setQuickActions] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/graphic-design');
      const data = await res.json();

      // Separate into categories
      setQuickActions(data.filter(item => item.category === 'quick_action'));
      setServices(data.filter(item => item.category === 'service'));
      setLoading(false);
    } catch (error) {
      console.error("Failed to load graphic design data", error);
      setLoading(false);
    }
  };

  return (
    <div className="gd-page">
      <Navbar />
      <div className="gd-container">
        {/* Header Section */}
        <header className="gd-header">
          <button className="gd-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} /> Back
          </button>
          <h1 className="gd-title">Graphic <span className="text-gradient">DesignHub</span></h1>
          <p className="gd-subtitle">Elevate your brand with stunning visuals and professional designs.</p>


        </header>

        {/* Quick Actions Grid */}
        <section className="gd-actions-grid">
          {loading ? <p>Loading options...</p> : quickActions.map((opt, index) => (
            <div
              key={opt._id || index}
              className="gd-action-card glass-card"
              onClick={() => navigate('/freelancers', { state: { category: opt.title.replace('Want to ', ''), serviceId: 'Graphic Design' } })}
              style={{ cursor: 'pointer' }}
            >
              <div className="gd-icon-wrapper" style={{ boxShadow: `0 0 20px ${opt.color}40`, color: opt.color }}>
                {getIcon(opt, 40)}
              </div>
              <h3>{opt.title}</h3>
              <button className="gd-btn glow-btn" style={{ '--btn-color': opt.color }}>
                {opt.buttonText || 'Start Designing'}
              </button>
            </div>
          ))}
        </section>

        {/* Design Services Section */}
        <section className="gd-services-section">
          <h2 className="section-title">Design <span className="text-gradient">Services</span></h2>
          <div className="gd-services-list">
            {loading ? <p>Loading services...</p> : services.map((service, index) => (
              <div key={service._id || index} className="gd-service-item glass-panel">
                <div className="service-icon">{getIcon(service, 24)}</div>
                <div className="service-info">
                  <h4>{service.title || service.name}</h4>
                  <p>{service.description || service.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default GraphicDesignPage;
