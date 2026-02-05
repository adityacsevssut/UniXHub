import React from 'react';
import { Mail, MapPin, Twitter, Linkedin, Instagram, Github, Send, ArrowUp } from 'lucide-react';
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

        <button className="back-to-top" onClick={scrollToTop}>
          <span>Back to Top</span>
          <ArrowUp size={16} />
        </button>
      </div>
    </footer>
  );
};

export default Footer;
