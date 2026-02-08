import React from 'react';
import { Mail, MapPin, Twitter, Linkedin, Instagram, Github, Send } from 'lucide-react';
import styled from 'styled-components';
import './Footer.css';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="footer-dynamic">
      {/* Decorative Top Wave/Border could go here if needed, keeping it clean for now */}
      {/* Decorative Background */}
      <div className="footer-bg-overlay"></div>

      <div className="container footer-main">
        <div className="footer-col brand-col">
          <a href="/" className="footer-logo">
            UniX<span className="text-highlight">Hub</span>
          </a>
          <p className="footer-tagline">
            Helping students and businesses build, grow, and succeed in the digital world.
          </p>
          <div className="social-icons-row">
            <a href="#" className="social-icon" aria-label="Twitter"><Twitter size={18} /></a>
            <a href="#" className="social-icon" aria-label="LinkedIn"><Linkedin size={18} /></a>
            <a href="#" className="social-icon" aria-label="Instagram"><Instagram size={18} /></a>
            <a href="#" className="social-icon" aria-label="GitHub"><Github size={18} /></a>
          </div>
        </div>

        <div className="footer-col links-col">
          <h4 className="footer-heading">Resources</h4>
          <ul className="footer-link-list">
            <li><a href="#domains">Our Domains</a></li>
            <li><a href="#about">About Us</a></li>
            <li><a href="/features">Features</a></li>
            <li><a href="#testimonials">Feedbacks</a></li>
            <li><a href="/support">Support</a></li>
          </ul>
        </div>

        <div className="footer-col links-col">
          <h4 className="footer-heading">Compliance</h4>
          <ul className="footer-link-list">
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/cookies">Cookie Policy</a></li>
            <li><a href="/contact">Contact Support</a></li>
          </ul>
        </div>

        <div className="footer-col newsletter-col">
          <h4 className="footer-heading">Stay Updated</h4>
          <p className="newsletter-desc">Subscribe to get the latest student opportunities.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <div className="input-group">
              <Mail className="footer-input-icon" size={18} />
              <input type="email" placeholder="Enter your email" required />
              <button type="submit" aria-label="Subscribe">
                <Send size={18} />
              </button>
            </div>
          </form>
          <div className="contact-mini">
            <div className="contact-row">
              <MapPin size={16} /> <span>Vssut Burla, Sambalpur</span>
            </div>
            <div className="contact-row">
              <Mail size={16} /> <span>support@unixhub.edu</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom-bar container">
        <p className="copyright">&copy; {new Date().getFullYear()} UniXHub. VSSUT STUDENTS OFFICIAL.</p>

        <StyledWrapper>
          <button className="button" onClick={scrollToTop}>
            <svg viewBox="0 0 384 512" className="svgIcon">
              <path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z" />
            </svg>
          </button>
        </StyledWrapper>
      </div>
    </footer>
  );
};

const StyledWrapper = styled.div`
  .button {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(rgb(227, 203, 255), rgba(252, 235, 252, 1));
    border: none;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0px 0px 0px 4px rgba(180, 160, 255, 0.253);
    cursor: pointer;
    transition-duration: 0.3s;
    overflow: hidden;
    position: relative;
  }

  .svgIcon {
    width: 12px;
    transition-duration: 0.3s;
  }

  .svgIcon path {
    fill: #7a18e5;
  }

  .button:hover {
    width: 140px;
    border-radius: 50px;
    transition-duration: 0.3s;
    background-color: #7a18e5;
    align-items: center;
  }

  .button:hover .svgIcon {
    /* width: 20px; */
    transition-duration: 0.3s;
    transform: translateY(-200%);
  }

  .button::before {
    position: absolute;
    bottom: -20px;
    content: "Back to Top";
    color: #7a18e5;
    /* transition-duration: .3s; */
    font-size: 0px;
  }

  .button:hover::before {
    font-size: 13px;
    opacity: 1;
    bottom: unset;
    /* transform: translateY(-30px); */
    transition-duration: 0.3s;
  }`;

export default Footer;
