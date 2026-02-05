import React, { useState } from 'react';
import { ArrowRight, Code, Palette, Zap, Layers, FileText, Mail, Info } from 'lucide-react';
import Background3D from './Background3D';
import TypewriterEffect from './TypewriterEffect';
import './Hero.css';

const Hero = () => {
  const [line1Done, setLine1Done] = useState(false);

  return (
    <section className="hero" id="home">
      <div className="hero-bg-glow"></div>
      <Background3D />
      <div className="container hero-container centered-layout">
        <div className="hero-center-text">
          <h1 className="hero-welcome-title">
            <TypewriterEffect
              text="Proffesional Services"
              speed={100}
              hideCursorOnComplete={true}
              onComplete={() => setLine1Done(true)}
            />
            <br />
            {line1Done && (
              <TypewriterEffect
                text="Where Ideas Turn Into Reality."
                speed={100}
                deleteSpeed={50}
                loop={true}
                pauseDuration={2500}
                className="text-gradient hero-subtitle-text"
              />
            )}
          </h1>

          <div className="hero-cta-group">
            <a href="/domains" className="hero-btn">
              <Layers size={20} />
              <span>Domains</span>
            </a>
            <a href="/features" className="hero-btn">
              <Zap size={20} />
              <span>Features</span>
            </a>
            <a href="/contact" className="hero-btn">
              <Mail size={20} />
              <span>Contact</span>
            </a>
            <a href="/about" className="hero-btn">
              <Info size={20} />
              <span>About Us</span>
            </a>
          </div>
        </div>

        {/* Floating Icons surrounding the text */}


        {/* New Middle Cards */}
      </div>
    </section>
  );
};

export default Hero;
