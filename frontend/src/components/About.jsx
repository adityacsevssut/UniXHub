import React from 'react';
import { BookOpen, Trophy, Globe } from 'lucide-react';
import './About.css';

const About = () => {
  const handleMouseMove = (e) => {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Spotlight position
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);

    // 3D Tilt calculation
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Rotate X: moves based on Y axis (up/down)
    // Rotate Y: moves based on X axis (left/right)
    const rotateX = ((y - centerY) / centerY) * -12; // Max 12 deg
    const rotateY = ((x - centerX) / centerX) * 12;

    target.style.setProperty("--rotate-x", `${rotateX}deg`);
    target.style.setProperty("--rotate-y", `${rotateY}deg`);
  };

  const handleMouseLeave = (e) => {
    const target = e.currentTarget;
    target.style.setProperty("--rotate-x", "0deg");
    target.style.setProperty("--rotate-y", "0deg");
  };

  return (
    <div className="about-wrapper" id="about">
      {/* Header Section */}
      <section className="about-header">
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
              <span className="stat-number text-gradient-purple">Secure</span>
              <span className="stat-label">Environment</span>
            </div>
            <div className="stat-box glass-stat">
              <span className="stat-number text-gradient-pink">Expert</span>
              <span className="stat-label">Freelancers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid Section */}
      <section className="about-content-section">
        <div className="container about-cards-container">

          {/* Mission Card */}
          <div className="interactive-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <div className="card-border"></div>
            <div className="card-content-inner">
              <div className="card-icon-box box-blue">
                <BookOpen size={28} />
              </div>
              <h3 className="interactive-title">Our Mission</h3>
              <p className="interactive-desc">
                Building a Smart Freelancing Ecosystem where students seamlessly balance academics with real-world earnings.
              </p>

              <div className="interactive-visual">
                <img src="/assets/mission.png" alt="Mission" />
                <div className="visual-glow glow-blue"></div>
              </div>

              <div className="interactive-tags">
                <span className="tag-pill">Simplify</span>
                <span className="tag-pill">Track Growth</span>
              </div>
            </div>
          </div>

          {/* Vision Card */}
          <div className="interactive-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <div className="card-border"></div>
            <div className="card-content-inner">
              <div className="card-icon-box box-pink">
                <Trophy size={28} />
              </div>
              <h3 className="interactive-title">Our Vision</h3>
              <p className="interactive-desc">
                A future where every student manages learning, performance, and productivity through one intelligent platform.
              </p>

              <div className="interactive-visual">
                <img src="/assets/vision.png" alt="Vision" />
                <div className="visual-glow glow-pink"></div>
              </div>

              <div className="interactive-tags">
                <span className="tag-pill">Global Network</span>
                <span className="tag-pill">Productivity</span>
              </div>
            </div>
          </div>

          {/* Values Card */}
          <div className="interactive-card" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
            <div className="card-border"></div>
            <div className="card-content-inner">
              <div className="card-icon-box box-green">
                <Globe size={28} />
              </div>
              <h3 className="interactive-title">Core Values</h3>
              <p className="interactive-desc">
                Guiding principles that define how we build, improve, and deliver for the student community.
              </p>

              <div className="interactive-visual">
                <img src="/assets/values.png" alt="Values" />
                <div className="visual-glow glow-green"></div>
              </div>

              <div className="interactive-tags">
                <span className="tag-pill">Innovation</span>
                <span className="tag-pill">Quality</span>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default About;
