import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Heart, Share2, ZoomIn } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './FreelancerPortfolio.css';

const FreelancerPortfolioPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const freelancer = state?.freelancer; // freelancer object passed from navigation state

  const [showcaseItems, setShowcaseItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchShowcase = async () => {
      if (!freelancer?.id) return;
      try {
        // Fetch showcase items
        const res = await fetch(`http://localhost:5000/api/showcase?partnerId=${freelancer.id}`);
        const data = await res.json();

        if (Array.isArray(data) && data.length > 0) {
          setShowcaseItems(data);
        } else {
          // Fallback to mocks if no real data found
          setShowcaseItems(mockPortfolioItems);
        }
      } catch (err) {
        console.error("Failed to fetch showcase:", err);
        setShowcaseItems(mockPortfolioItems);
      } finally {
        setLoading(false);
      }
    };

    fetchShowcase();
  }, [freelancer]);

  // Mock portfolio items (Fallback)
  const mockPortfolioItems = [
    { _id: 'm1', category: 'Poster', image: 'https://images.unsplash.com/photo-1572044162444-ad602110a02e?w=800&q=80', title: 'Neon Night Festival' },
    { _id: 'm2', category: 'Brand', image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80', title: 'Eco Life Branding' },
    { _id: 'm3', category: 'Banner', image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80', title: 'Tech Summit 2025' },
    { _id: 'm4', category: 'Illustration', image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80', title: 'Abstract Flows' },
  ];

  if (!freelancer) {
    return (
      <div className="portfolio-error">
        <h2>Freelancer not found</h2>
        <button onClick={() => navigate('/freelancers')}>Go Back</button>
      </div>
    );
  }

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
                Creative professional specializing in {freelancer.specialty || 'Design'}.
                Turning ideas into visual reality with over 2 years of experience in the industry.
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
            {showcaseItems.map((item) => (
              <div key={item._id} className="work-item">
                <div className="work-image-wrapper">
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <div className="work-overlay">
                    <div className="overlay-content">
                      <h3>{item.title}</h3>
                      <p>{item.category}</p>
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noreferrer" style={{ color: 'white', marginTop: '0.5rem', display: 'inline-block' }}>
                          View Project &rarr;
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                {item.description && (
                  <div className="work-details" style={{ padding: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
                    {item.description.substring(0, 60)}...
                  </div>
                )}
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
