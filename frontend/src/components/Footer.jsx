import React from 'react';
import { Rocket, Mail, MapPin, Twitter, Linkedin, Instagram, Github } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <span className="logo-text footer-logo-text">UniX<span className="text-highlight">Hub</span></span>
          <p className="footer-desc">
            Empowering college students to build, create, and innovate. The future of freelancing starts here.
          </p>
          <div className="social-links">
            <a href="#" className="social-link"><Twitter size={18} /></a>
            <a href="#" className="social-link"><Linkedin size={18} /></a>
            <a href="#" className="social-link"><Instagram size={18} /></a>
            <a href="#" className="social-link"><Github size={18} /></a>
          </div>
        </div>

        <div className="footer-links">
          <div className="link-column">
            <h4>Platform</h4>
            <a href="#">Join as Freelancer</a>
            <a href="#">Hire Talent</a>
            <a href="#">Domains</a>
            <a href="#">Success Stories</a>
          </div>

          <div className="link-column">
            <h4>Company</h4>
            <a href="#">About Us</a>
            <a href="#">Careers</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
          </div>

          <div className="link-column">
            <h4>Contact</h4>
            <div className="contact-item">
              <Mail size={16} />
              <span>support@talentsync.edu</span>
            </div>
            <div className="contact-item">
              <MapPin size={16} />
              <span>College Campus, Tech Hub</span>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom container">
        <p>&copy; {new Date().getFullYear()} TalentSync. All rights reserved.</p>
        <div className="legal-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
