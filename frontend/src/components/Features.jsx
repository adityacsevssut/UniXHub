import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Lock, Zap, MessageSquare, Users, Award, Check } from 'lucide-react';
import './Features.css';

const featuresData = [
  {
    title: 'Verified Talent',
    icon: <ShieldCheck size={32} />,
    description: 'We ensure authenticity and quality by rigorously vetting every student freelancer joined.',
    points: ['Skill verification tests', 'Comprehensive portfolio reviews', 'University identity confirmation'],
    color: '#3b82f6' // Blue
  },
  {
    title: 'Secure Payments',
    icon: <Lock size={32} />,
    description: 'Your money is safe with us. We use an escrow system to protect both parties.',
    points: ['Milestone-based fund release', 'Multiple secure payment gateways', 'Automated fraud protection'],
    color: '#10b981' // Green
  },
  {
    title: 'Smart Matching',
    icon: <Zap size={32} />,
    description: 'Our AI algorithms connect the right talent with the right projects instantly.',
    points: ['Skill-based recommendations', 'Budget & timeline matching', 'Instant availability syncing'],
    color: '#8b5cf6' // Violet
  },
  {
    title: 'Collaboration Suite',
    icon: <MessageSquare size={32} />,
    description: 'Everything you need to manage projects and communicate effectively in one place.',
    points: ['Real-time built-in chat', 'Seamless file sharing', 'Project progress dashboard'],
    color: '#ec4899' // Pink
  },
  {
    title: 'Community Hub',
    icon: <Users size={32} />,
    description: 'Join a thriving community of student developers and innovators.',
    points: ['Peer-to-peer learning', 'Exclusive mentorship programs', 'Tech events & hackathon alerts'],
    color: '#f59e0b' // Amber
  },
  {
    title: 'Student First',
    icon: <Award size={32} />,
    description: 'A platform designed specifically to boost student careers and portfolios.',
    points: ['Low/Zero platform fees', 'Free monthly project bids', 'Certified experience badges'],
    color: '#06b6d4' // Cyan
  }
];

const FeatureCard = ({ title, icon, description, points, color, isVisible, index }) => {
  return (
    <div
      className={`feature-card glass-card ${isVisible ? 'in-view' : ''}`}
      style={{ '--delay': `${index * 0.15}s` }}
    >
      <div className="feature-icon-box" style={{
        background: `linear-gradient(135deg, ${color}20, ${color}05)`,
        borderColor: `${color}40`,
        color: color
      }}>
        {icon}
      </div>

      <h3 className="feature-title">{title}</h3>
      <p className="feature-desc">{description}</p>

      <ul className="feature-points">
        {points.map((point, i) => (
          <li key={i} className="feature-point">
            <Check size={16} className="point-icon" style={{ color: color }} />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

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
          <p className="section-subtitle">Powerful features designed to simplify freelancing for students.</p>
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
