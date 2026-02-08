import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Rocket, Search, User as UserIcon, LogOut } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false); // New state for profile dropdown
  const profileRef = useRef(null);

  useEffect(() => {
    // Check for logged in user
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <a href="/" className="logo">
          <span className="logo-text">UniX<span className="text-highlight">Hub</span></span>
        </a>

        <div className="nav-group">
          <div className={`nav-links ${isOpen ? 'active' : ''}`}>
            <a href="/" className="nav-link" onClick={() => setIsOpen(false)}>Home</a>
            <a href="/domains" className="nav-link" onClick={() => setIsOpen(false)}>Get Services</a>
            <a href="/features" className="nav-link" onClick={() => setIsOpen(false)}>Features</a>
            <a href="/about" className="nav-link" onClick={() => setIsOpen(false)}>About</a>
            <div className="mobile-actions">
              {user ? (
                <button className="btn-primary" onClick={handleLogout}>Log Out</button>
              ) : (
                <button className="btn-primary" onClick={() => window.location.href = '/register'}>Join Now</button>
              )}
            </div>
          </div>

          <div className="search-bar-container">
            <input type="text" placeholder="Search services..." className="search-input" />
            <Search className="search-icon" size={18} />
          </div>

          <div className="nav-actions">
            {user ? (
              <div className="user-profile-container" style={{ position: 'relative' }} ref={profileRef}>
                <div
                  className="user-profile-icon"
                  onClick={() => setProfileOpen(!profileOpen)}
                >
                  <span style={{ fontSize: '1.2rem', fontWeight: '700' }}>
                    {user.firstName ? user.firstName.charAt(0).toUpperCase() : (user.name?.charAt(0).toUpperCase() || 'U')}
                  </span>
                </div>

                {profileOpen && (
                  <div className="profile-dropdown">
                    <div className="dropdown-header">
                      <span className="dropdown-name">Hi, {user.name?.split(' ')[0] || 'User'}</span>
                      <span className="dropdown-email">{user.email}</span>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="btn-secondary" onClick={() => window.location.href = '/login'}>Login</button>
            )}
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
