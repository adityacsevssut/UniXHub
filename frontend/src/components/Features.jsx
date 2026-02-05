import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { ShieldCheck, ChevronRight, Lock, Zap, Rocket, UserCheck, Layout, Sliders } from 'lucide-react';
import './Features.css';

const featuresData = [
  {
    title: 'Launch without delays.',
    icon: <Rocket size={32} />,
    description: '', // Description is removed in the new design
    points: ['Real projects', 'Real impact', 'Zero guesswork'],
    color: '#3B82F6' // Blue
  },
  {
    title: 'Verified talent only.',
    icon: <UserCheck size={32} />,
    description: '',
    points: ['Work with professionals who deliver', 'No experiments'],
    color: '#06b6d4' // Cyan 
  },
  {
    title: 'One space. One flow.',
    icon: <Layout size={32} />,
    points: ['Chat', 'Track', 'Build together seamlessly'],
    color: '#8b5cf6' // Violet
  },
  {
    title: 'Clients stay in control.',
    icon: <Sliders size={32} />,
    points: ['Clear scope', 'Fair pricing', 'Full transparency'],
    color: '#ec4899' // Pink
  },
  {
    title: 'Speed without shortcuts.',
    icon: <Zap size={32} />,
    points: ['Deadlines met', 'Quality intact'],
    color: '#f59e0b' // Amber
  },
  {
    title: 'Trust built-in.',
    icon: <ShieldCheck size={32} />,
    points: ['Secure payments', 'Protected data', 'Peace of mind'],
    color: '#10b981' // Green
  },
];

const FeatureCard = ({ title, icon, points, color, isVisible, index }) => {
  return (
    <StyledWrapper $isVisible={isVisible} $delay={`${index * 0.15}s`} $color={color}>
      <div className="card-container">
        <div className="card">
          <div className="icon-container">
            {icon}
          </div>
          <div className="content">
            <div className="h6">{title}</div>
            <div className="hover_content">
              <ul className="custom-points">
                {points.map((point, i) => (
                  <li key={i} className="custom-point">
                    <ChevronRight size={16} style={{ color: color, minWidth: '16px' }} />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  /* Added to make sure it fits properly in the grid or parent */
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  
  /* Entry Animation */
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: translateY(${props => props.$isVisible ? '0' : '50px'});
  transition: opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1), transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: ${props => props.$delay};

  .card-container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }

  .card {
    position: relative;
    display: flex;
    justify-content: flex-start; /* Align content to top so expansion prevents jumping */
    align-items: center; 
    flex-direction: column; 
    cursor: pointer;
    width: 100%; /* Fill the container width */
    height: 380px; /* Fixed height for uniformity */
    padding: 2.5em 0;
    
    /* UI Adaptation */
    background: rgba(255, 255, 255, 0.7); 
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.4);
    
    box-shadow: 0 0 6px 0 rgba(32, 32, 36, 0.12);
    transition: all 0.35s ease;
    border-radius: 24px; 
    overflow: hidden; 
  }
  
  .icon-container {
      position: absolute;
      top: 1.5rem;
      left: 1.5rem;
      color: ${props => props.$color};
      transition: transform 0.3s ease;
      z-index: 5;
  }

  .card:hover .icon-container {
      transform: scale(1.1);
  }

  .card::before, .card::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    background: ${props => props.$color};
    height: 4px;
    border-radius: 24px 24px 0 0;
    z-index: 2;
  }

  .card::before {
    width: 0;
    opacity: 0;
    transition: opacity 0 ease, width 0 ease;
    transition-delay: 0.5s;
  }

  .card::after {
    width: 100%;
    background: white; 
    transition: width 0.5s ease;
  }

  .card .content {
    width: 100%;
    max-width: 90%;
    padding: 0 1rem;
    box-sizing: border-box; 
    text-align: center; 
    
    /* Center vertically initially */
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    transition: transform 0.3s ease;
  }

  .card .h6 {
    font-family: 'Outfit', sans-serif; /* Matched to Domains/Global */
    color: #1e293b; /* Slate 800 */
    font-weight: 800;
    text-transform: none; /* Removed uppercase */
    margin: 0;
    letter-spacing: -0.02em; /* Matched to Domains */
    font-size: 2rem; /* Increased size */
    margin-bottom: 1rem;
  }

  .card .hover_content {
    overflow: hidden;
    max-height: 0;
    transform: translateY(1em);
    transition: all 0.55s ease;
  }

  /* Custom list styling */
  .custom-points {
    list-style: none;
    padding: 0;
    margin: 1.5em 0 0;
    text-align: left; 
  }

  .custom-point {
    display: flex;
    align-items: center;
    font-family: 'Inter', sans-serif; /* Matched to Global */
    font-weight: 450;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    color: #64748b; /* Slate 500 */
    font-size: 1.15rem; /* Matched to Domains desc */
  }

  /* Hover Effects */
  .card:hover {
    /* Removed width change to keep grid stable */
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    transform: translateY(-5px); 
    /* Glass effect on hover with color tint */
    background: linear-gradient(135deg, ${props => props.$color}22, rgba(255, 255, 255, 0.9));
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.8);
  }

  .card:hover::before {
    width: 100%;
    opacity: 1;
    transition: opacity 0.5s ease, width 0.5s ease;
    transition-delay: 0;
  }

  .card:hover::after {
    width: 0;
    opacity: 0;
    transition: width 0 ease;
  }

  .card:hover .hover_content {
    max-height: 12em; /* Increase slightly to ensure all points fit */
    opacity: 1;
    transform: none;
  }
  
  .card:hover .content {
      /* Optional: shift content up slightly on hover if needed */
      /* transform: translateY(-10px); */
  }
`;

const Features = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <section className="features-section section-padding" id="features" ref={sectionRef}>
      <div className="container">
        <div className="section-header centered-header-text">
          <h2 className="section-title">Why To Choose <span className="text-gradient"> UniXHub</span></h2>
          <p className="section-subtitle">Powerful features designed to simplify Proffesional Journey.</p>
        </div>

        <div className="features-grid">
          {featuresData.map((feature, index) => (
            <FeatureCard
              key={index}
              {...feature}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};


export default Features;
