import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Mail, Send } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Define Styled Components FIRST to prevent ReferenceErrors

const PageWrapper = styled.div`
  min-height: 100vh;
  /* Using global grid from index.css mostly, but ensuring context */
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: var(--text-main);
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-top: 2rem;
  }
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 1.1rem;
`;

const BackButton = styled.button`
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 50px;
  color: #475569;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);

  &:hover {
    transform: translateX(-5px);
    color: var(--primary);
    border-color: var(--primary);
  }

  @media (max-width: 768px) {
    position: relative;
    margin-bottom: 1rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 3rem;
  justify-items: center;
  padding: 0 1rem;
`;

const CardWrapper = styled.div`
  .book {
    position: relative;
    border-radius: 10px;
    width: 240px;
    height: 340px;
    background-color: #f8fafc;
    -webkit-box-shadow: 1px 1px 12px #000;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2);
    -webkit-transform: preserve-3d;
    -ms-transform: preserve-3d;
    transform: preserve-3d;
    -webkit-perspective: 2000px;
    perspective: 2000px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
  }

  .cover {
    top: 0;
    position: absolute;
    background-color: #ffffff;
    width: 100%;
    height: 100%;
    border-radius: 10px;
    cursor: pointer;
    -webkit-transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
    transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
    -webkit-transform-origin: 0;
    -ms-transform-origin: 0;
    transform-origin: 0;
    -webkit-box-shadow: 1px 1px 12px #000;
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    backface-visibility: hidden;
    border: 1px solid rgba(0,0,0,0.05);
  }

  .book:hover .cover {
    -webkit-transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
    transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
    -webkit-transform: rotatey(-80deg);
    -ms-transform: rotatey(-80deg);
    transform: rotatey(-80deg);
  }

  /* Cover Content Styles */
  .cover-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1rem;
    text-align: center;
    width: 100%;
    height: 100%;
    background: linear-gradient(145deg, #ffffff, #f0f0f0);
  }

  .img-container {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 1.5rem;
    border: 3px solid white;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    margin-top: 2rem;
  }

  .img-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .cover h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 0.5rem 0;
  }

  .role {
    font-size: 0.9rem;
    color: #64748b;
    font-weight: 500;
    background: #f1f5f9;
    padding: 0.2rem 0.8rem;
    border-radius: 20px;
  }

  /* Back/Inside Content Styles */
  .back-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 1.5rem;
    width: 100%;
    height: 100%;
  }

  .back-content h4 {
    margin-bottom: 2rem;
    color: #475569;
    font-size: 1.1rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    transform: translateZ(20px); /* Subtle depth */
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }

  .action-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.8rem;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
  }

  .work-btn {
    background: #e2e8f0;
    color: #475569;
  }
  .work-btn:hover {
    background: #cbd5e1;
  }

  .contact-btn {
    background: var(--primary);
    color: white;
  }
  .contact-btn:hover {
    filter: brightness(1.1);
    transform: translateY(-2px);
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2.5rem;
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  position: relative;
  box-shadow: 0 20px 50px rgba(0,0,0,0.2);
  animation: slideUp 0.3s;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 20px;
  background: none;
  border: none;
  font-size: 2rem;
  cursor: pointer;
  color: #94a3b8;
  line-height: 1;
  &:hover { color: #fe2c55; }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #f1f5f9;
  }
  
  h3 {
    margin: 0;
    font-size: 1.4rem;
    color: #1e293b;
  }
  
  p {
    margin: 0;
    color: #64748b;
    font-size: 0.9rem;
  }
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #475569;
  }
  
  input, select, textarea {
    padding: 0.8rem;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    font-family: inherit;
    transition: all 0.3s;
    
    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
    }
  }
`;

const SubmitButton = styled.button`
  background: var(--gradient-main);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.8rem;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 1rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px -5px rgba(79, 70, 229, 0.4);
  }
`;

// Mock Data for Freelancers
const freelancersData = [
  {
    id: 1,
    name: "Alex Morgan",
    role: "Visual Designer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    specialty: "Banners & ads"
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    role: "Brand Strategist",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    specialty: "Logos & Identity"
  },
  {
    id: 3,
    name: "David Chen",
    role: "Illustrator",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    specialty: "Custom Art"
  },
  {
    id: 4,
    name: "Emily Rose",
    role: "Presentation Pro",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    specialty: "Pitch Decks"
  },
  {
    id: 5,
    name: "Michael Ross",
    role: "Social Media Wizard",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    specialty: "Instagram/FB"
  },
  {
    id: 6,
    name: "Jessica Kim",
    role: "Print Designer",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80",
    specialty: "Brochures"
  }
];

const FreelancersPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const categoryTitle = location.state?.category || "Available Freelancers";

  /* State for Freelancers Data */
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        // Use serviceId if provided, otherwise category, or default empty to get all
        const queryParam = location.state?.serviceId || location.state?.category || '';
        const url = queryParam
          ? `http://localhost:5000/api/partners?serviceId=${encodeURIComponent(queryParam)}`
          : 'http://localhost:5000/api/partners';

        const res = await fetch(url);
        if (!res.ok) throw new Error('Failed to fetch');

        const data = await res.json();

        if (data.length > 0) {
          // Map backend data to UI format
          const mappedData = data.map(p => ({
            id: p._id,
            name: p.name,
            role: 'Verified Partner',
            image: `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name)}&background=random&size=200`,
            specialty: p.serviceId
          }));
          setFreelancers(mappedData);
        } else {
          // Fallback: If empty, show empty state (or mock if strictly needed, but let's stick to real data check)
          setFreelancers([]);
        }
      } catch (err) {
        console.error(err);
        setFreelancers(freelancersData); // Fallback to mock on error
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancers();
  }, [location.state]);

  // State for Contact Modal
  const [selectedFreelancer, setSelectedFreelancer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openContactModal = (freelancer) => {
    setSelectedFreelancer(freelancer);
    setIsModalOpen(true);
  };

  const closeContactModal = () => {
    setIsModalOpen(false);
    setSelectedFreelancer(null);
  };

  return (
    <PageWrapper>
      <Navbar />
      <div className="container" style={{ paddingTop: '100px', paddingBottom: '4rem' }}>
        <Header>
          <BackButton onClick={() => navigate(-1)}>
            <ArrowLeft size={20} /> Back
          </BackButton>
          <Title>{categoryTitle}</Title>
          <Subtitle>Expert designers ready to bring your vision to life</Subtitle>
        </Header>

        {loading ? (
          <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#64748b' }}>Loading experts...</p>
        ) : freelancers.length > 0 ? (
          <Grid>
            {freelancers.map((freelancer) => (
              <CardWrapper key={freelancer.id}>
                <div className="book">
                  <div className="back-content">
                    <h4>{freelancer.specialty}</h4>
                    <div className="actions">
                      <button
                        className="action-btn work-btn"
                        onClick={() => navigate('/portfolio', { state: { freelancer } })}
                      >
                        <ExternalLink size={16} /> View Work
                      </button>
                      <button
                        className="action-btn contact-btn"
                        onClick={() => navigate('/chat', { state: { freelancer } })}
                      >
                        <Mail size={16} /> Contact Now
                      </button>
                    </div>
                  </div>

                  <div className="cover">
                    <div className="cover-content">
                      <div className="img-container">
                        <img src={freelancer.image} alt={freelancer.name} />
                      </div>
                      <h3>{freelancer.name}</h3>
                      <span className="role">{freelancer.role}</span>
                    </div>
                  </div>
                </div>
              </CardWrapper>
            ))}
          </Grid>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
            <h3>No partners available for this service yet.</h3>
            <p>Check back soon!</p>
          </div>
        )}

        {/* Contact Modal */}
        {isModalOpen && selectedFreelancer && (
          <ModalOverlay onClick={closeContactModal}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <CloseButton onClick={closeContactModal}>&times;</CloseButton>
              <ModalHeader>
                <img src={selectedFreelancer.image} alt={selectedFreelancer.name} />
                <div>
                  <h3>Contact {selectedFreelancer.name}</h3>
                  <p>{selectedFreelancer.role}</p>
                </div>
              </ModalHeader>

              <ContactForm onSubmit={(e) => {
                e.preventDefault();
                navigate('/chat', { state: { freelancer: selectedFreelancer } });
              }}>
                <FormGroup>
                  <label>Your Name</label>
                  <input type="text" placeholder="John Doe" required />
                </FormGroup>
                <FormGroup>
                  <label>Project Type</label>
                  <select>
                    <option>New Project</option>
                    <option>Consultation</option>
                    <option>Long-term Contract</option>
                  </select>
                </FormGroup>
                <FormGroup>
                  <label>Message</label>
                  <textarea rows="4" placeholder={`Hi ${selectedFreelancer.name}, I'd like to discuss...`} required></textarea>
                </FormGroup>
                <SubmitButton type="submit">
                  Send Message <Send size={16} />
                </SubmitButton>
              </ContactForm>
            </ModalContent>
          </ModalOverlay>
        )}
      </div>
      <Footer />
    </PageWrapper>
  );
};

export default FreelancersPage;
