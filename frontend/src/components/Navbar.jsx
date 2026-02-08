import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Rocket, Search, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="logo" onClick={() => navigate('/')}>
          UniXHub
        </div>

        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <a onClick={() => navigate('/')}>Home</a>
          <a onClick={() => navigate('/domains')}>Get Services</a>
          <a onClick={() => navigate('/features')}>Features</a>
          <a onClick={() => navigate('/about')}>About</a>
        </div>

        <div className="search-bar-container">
          <input placeholder="Search services..." />
          <Search size={18} />
        </div>

        <div className="nav-actions">
          {user ? (
            <div ref={profileRef}>
              <div onClick={() => setProfileOpen(!profileOpen)}>
                {user.name?.charAt(0) || 'U'}
              </div>

              {profileOpen && (
                <div>
                  <p>{user.email}</p>
                  <button onClick={handleLogout}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => navigate('/login')}>Login</button>
          )}

          <div onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
