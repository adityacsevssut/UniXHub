import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Heart, Share2, ZoomIn } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './FreelancerPortfolio.css';

const FreelancerPortfolioPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const freelancer = state?.freelancer;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!freelancer) {
    // Fallback if accessed directly without state
    return (
      <div className="portfolio-error">
        <h2>Freelancer not found</h2>
        <button onClick={() => navigate('/freelancers')}>Go Back</button>
      </div>
    );
  }

  // Mock portfolio items based on freelancer/general design
  const portfolioItems = [
    { id: 1, type: 'Poster', img: 'https://images.unsplash.com/photo-1572044162444-ad602110a02e?w=800&q=80', title: 'Neon Night Festival' },
    { id: 2, type: 'Brand', img: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80', title: 'Eco Life Branding' },
    { id: 3, type: 'Banner', img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80', title: 'Tech Summit 2025' },
    { id: 4, type: 'Illustration', img: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80', title: 'Abstract Flows' },
    { id: 5, type: 'Social', img: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80', title: 'Instagram Series' },
    { id: 6, type: 'UI Design', img: 'https://images.unsplash.com/photo-1559028013-cae7ca5725e5?w=800&q=80', title: 'Finance App UI' },
    { id: 7, type: 'Poster', img: 'https://images.unsplash.com/photo-1585250003253-24950b73af4e?w=800&q=80', title: 'Retro Music Gig' },
    { id: 8, type: 'Print', img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80', title: 'Magazine Cover' },
  ];

  return (
    <div className="portfolio-page">
      <Navbar />

      <div className="portfolio-container">
        {/* Header / Profile Section */}
        <header className="portfolio-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} /> Back
          </button>

          <div className="profile-card-large glass-card">
            <div className="profile-image-large">
              <img src={freelancer.image} alt={freelancer.name} />
            </div>
            <div className="profile-info-large">
              <h1 className="profile-name">{freelancer.name}</h1>
              <span className="profile-role">{freelancer.role}</span>
              <p className="profile-bio">
                Creative professional specializing in {freelancer.specialty}.
                Turning ideas into visual reality with over 5 years of experience in the industry.
              </p>
              <div className="profile-actions">
                <button
                  className="primary-btn contact-btn"
                  onClick={() => navigate('/chat', { state: { freelancer } })}
                >
                  <Mail size={18} /> Hire Me
                </button>
                <button className="secondary-btn share-btn">
                  <Share2 size={18} /> Share Profile
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Portfolio Grid */}
        <section className="works-section">
          <h2 className="section-title">Selected <span className="text-gradient">Works</span></h2>

          <div className="works-masonry">
            {portfolioItems.map((item) => (
              <div key={item.id} className="work-item">
                <div className="work-image-wrapper">
                  <img src={item.img} alt={item.title} loading="lazy" />
                  <div className="work-overlay">
                    <div className="overlay-content">
                      <h3>{item.title}</h3>
                      <p>{item.type}</p>
                      <button className="zoom-btn"><ZoomIn size={24} /></button>
                    </div>
                  </div>
                </div>
                <div className="work-details">
                  <div className="work-likes">
                    <Heart size={16} /> <span>{Math.floor(Math.random() * 200) + 50}</span>
                  </div>
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

export default FreelancerPortfolioPage;
