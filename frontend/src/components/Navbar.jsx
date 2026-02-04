import React, { useState, useEffect } from 'react';
import { Menu, X, Rocket, Search } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <a href="/" className="logo">
          <span className="logo-text">UniX<span className="text-highlight">Hub</span></span>
        </a>

        <div className="nav-group">
          <div className={`nav-links ${isOpen ? 'active' : ''}`}>
            <a href="#home" className="nav-link" onClick={() => setIsOpen(false)}>Home</a>
            <a href="#domains" className="nav-link" onClick={() => setIsOpen(false)}>Domains</a>
            <a href="#features" className="nav-link" onClick={() => setIsOpen(false)}>Features</a>
            <a href="#community" className="nav-link" onClick={() => setIsOpen(false)}>Community</a>
            <div className="mobile-actions">
              <button className="btn-primary">Join Now</button>
            </div>
          </div>

          <div className="search-bar-container">
            <input type="text" placeholder="Search services..." className="search-input" />
            <Search className="search-icon" size={18} />
          </div>

          <div className="nav-actions">
            <button className="btn-secondary">Login</button>
            <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
