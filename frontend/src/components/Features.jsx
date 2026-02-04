import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, ChevronRight,Lock, Zap, MessageSquare, Users, Award, Check } from 'lucide-react';
import './Features.css';

const featuresData = [
  {
    title: 'Projects Ready',
    icon: <Award size={32} />,
    description: 'Access real-world, ready-to-use projects to launch faster and learn practically.',
    points: ['Real-world project experience', 'Ready-to-use solutions', 'Faster learning & launch'],
    color: '#06b6d4' // Cyan
  },
  {
    title: 'Expert Creators',
    icon: <ShieldCheck size={32} />,
    description: 'We deliver high-quality design and development with skilled professionals.',
    points: ['Experienced designers & developers', 'Quality-checked projects', 'Modern tools & technologies'],
    color: '#3b82f6' // Blue
  },
  {
    title: 'Easy Collaboration',
    icon: <Zap size={32} />,
    description: 'We maintain simple and clear communication during the whole project.',
    points: ['Direct client communication', 'Regular progress updates', 'Friendly support'],
    color: '#8b5cf6' // Violet
  },
  {
    title: 'Client First Approach',
    icon: <MessageSquare size={32} />,
    description: 'Your satisfaction is our priority, and we deliver the best results for you.',
    points: ['Affordable pricing', 'Unlimited support guidance', 'Long-term partnership focus'],
    color: '#ec4899' // Pink
  },
  {
    title: 'Fast Delivery',
    icon: <Users size={32} />,
    description: 'We value your time and meet deadlines.',
    points: ['On-time project delivery', 'Exclusive mentorship programs', 'Smooth workflow'],
    color: '#f59e0b' // Amber
  },
  {
    title: 'Reliable & Secure',
    icon: <Lock size={32} />,
    description: 'Your data and payments are always fully protected and secure with us.',
    points: ['Secure payment methods', 'Client data protection', 'Transparent process'],
    color: '#10b981' // Green
  },
];

const BulletArrow = ({ size = 16, color }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="point-icon"
  >
    {/* Top half - Lighter/Main Color */}
    <path
      d="M2 2L22 12L2 12Z"
      fill={color}
    />
    {/* Bottom half - Darker/Shaded Color - using a filter hack or opacity */}
    <path
      d="M2 22L22 12L2 12Z"
      fill={color}
      style={{ filter: 'brightness(0.6)' }}
    />
  </svg>
);

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
            <ChevronRight size={16} className="point-icon" style={{ color: color }} />
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
