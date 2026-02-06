import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Palette, Share2, Youtube, Presentation, FileImage, Layout, PenTool, Briefcase, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import './GraphicDesignPage.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const GraphicDesignPage = () => {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const designOptions = [
    { title: "Want to Design A Banner?", icon: <Layout size={40} />, color: "#ff4757" },
    { title: "Want to Design a Poster?", icon: <FileImage size={40} />, color: "#2ed573" },
    { title: "Want to Design Youtube Banner?", icon: <Youtube size={40} />, color: "#ff6b81" },
    { title: "Want to Design Canva Presentations?", icon: <Presentation size={40} />, color: "#3742fa" }
  ];

  const services = [
    { name: "Social media posts", desc: "Instagram, Facebook, YouTube thumbnails", icon: <Share2 /> },
    { name: "Posters, flyers, brochures", desc: "Print & Digital Media", icon: <FileImage /> },
    { name: "Presentations", desc: "PPT-style slides & Pitch Decks", icon: <Presentation /> },
    { name: "Logos and branding kits", desc: "Identity & Visual Language", icon: <PenTool /> },
    { name: "Business cards And Designs", desc: "Professional Stationery", icon: <Briefcase /> }
  ];

  const navigate = useNavigate();

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
          {designOptions.map((opt, index) => (
            <div
              key={index}
              className="gd-action-card glass-card"
              onClick={() => navigate('/freelancers', { state: { category: opt.title.replace('Want to ', '') } })}
              style={{ cursor: 'pointer' }}
            >
              <div className="gd-icon-wrapper" style={{ boxShadow: `0 0 20px ${opt.color}40`, color: opt.color }}>
                {opt.icon}
              </div>
              <h3>{opt.title}</h3>
              <button className="gd-btn glow-btn" style={{ '--btn-color': opt.color }}>Start Designing</button>
            </div>
          ))}
        </section>

        {/* Design Services Section */}
        <section className="gd-services-section">
          <h2 className="section-title">Design <span className="text-gradient">Services</span></h2>
          <div className="gd-services-list">
            {services.map((service, index) => (
              <div key={index} className="gd-service-item glass-panel">
                <div className="service-icon">{service.icon}</div>
                <div className="service-info">
                  <h4>{service.name}</h4>
                  <p>{service.desc}</p>
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
