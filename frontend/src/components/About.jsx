import React from 'react';
import { BookOpen, Trophy, Globe } from 'lucide-react';
import './About.css';

const About = () => {
  return (
    <div className="about-wrapper" id="about">
      {/* Header Section */}
      <section className="about-header">
        <div className="custom-shape-divider-top">
          <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
          </svg>
        </div>
        <div className="about-header-bg">
          <img src="/assets/about-header.png" alt="University Library" />
          <div className="about-header-overlay"></div>
        </div>

        <div className="container about-header-content">
          <h1 className="about-main-title">About UniX<span className="highlight-gradient">Hub</span></h1>
          <p className="about-subtitle">
            Empowering millions to achieve dreams through <span className="highlight-blue">accessible freelancing</span>
          </p>

          <div className="about-stats-row">
            <div className="stat-box glass-stat">
              <span className="stat-number text-gradient-green">0%</span>
              <span className="stat-label">Platform Fees</span>
            </div>
            <div className="stat-box glass-stat">
              <span className="stat-number text-gradient-blue">100%</span>
              <span className="stat-label">Verified IDs</span>
            </div>
            <div className="stat-box glass-stat">
              <span className="stat-number text-gradient-purple">SECURE</span>
              <span className="stat-label">Environment</span>
            </div>
            <div className="stat-box glass-stat">
              <span className="stat-number text-gradient-pink">EXPERT</span>
              <span className="stat-label">Freelancers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="about-content-rows">

        {/* Mission Section (Dark Theme) */}
        <section className="about-row bg-dark-mission">
          <div className="container row-container">
            <div className="row-content">
              <div className="mission-card">
                <h2 className="row-title">To Whom UniX<span className="highlight-gradient">Hub</span> Helps?</h2>
                <p className="row-desc">
                  UniXHub works with students, creators, and businesses to grow their online presence professionally And make Thier Portfolio Stronger.
                </p>
                <ul className="row-list">
                  <li><CheckCircleIcon color="#60a5fa" />Students Managing Tight Academic Deadlines</li>
                  <li><CheckCircleIcon color="#60a5fa" />Students Who Need Neat And Well Presented Work.</li>
                  <li><CheckCircleIcon color="#60a5fa" /> Students Looking For A Peer Support They Can Trust.</li>
                  <li><CheckCircleIcon color="#60a5fa" />Skilled Students Who Wants To Earn Using Thier Abilities.</li>
                </ul>
              </div>
            </div>
            <div className="row-content">
              <div className="mission-card">
                <h2 className="row-title">What Exactly UniX<span className="highlight-gradient">Hub</span> Does?</h2>
                <p className="row-desc">
                  UniXHub is a creative digital service startup offering Design, Development, and Branding solutions to help businesses and individuals Grow Proffesional.
                </p>
                <ul className="row-list">
                  <li><CheckCircleIcon color="#60a5fa" /> Builds modern websites and full-stack applications</li>
                  <li><CheckCircleIcon color="#60a5fa" />Creates professional portfolios for students & businesses.</li>
                  <li><CheckCircleIcon color="#60a5fa" /> Provides ready-to-use, real-world projects and solutions</li>
                  <li><CheckCircleIcon color="#60a5fa" /> Designs logos, branding, and social media creatives</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

// Simple Icon Component for the list
const CheckCircleIcon = ({ color }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22Z" fill={color} fillOpacity="0.2" stroke={color} strokeWidth="1.5" />
    <path d="M7.75 12.75L10 15.25L16.25 8.75" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default About;
