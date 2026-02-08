import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Terminal, Code, ArrowLeft } from 'lucide-react';
import Navbar from '../../components/Navbar';
import './Auth.css';

const DeveloperLoginPage = () => {
  const [formData, setFormData] = useState({ email: '', developerId: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Hardcoded developer credentials check
      if (
        formData.email === 'nahakditya344@gmail.com' &&
        formData.developerId === '2402040005' &&
        formData.password === 'Aditya_1999'
      ) {
        // Successful login
        const developerUser = {
          name: 'Developer Admin',
          email: formData.email,
          role: 'developer',
          developerId: formData.developerId
        };
        localStorage.setItem('user', JSON.stringify(developerUser));
        navigate('/admin/dashboard');
      } else {
        // Failed login
        setError('Invalid Developer Credentials');
      }

    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-card">
        <header className="auth-header">
          <div className="back-btn-wrapper" onClick={() => navigate('/login')} style={{ position: 'absolute', top: '1rem', left: '1rem', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <ArrowLeft size={24} />
          </div>
          <div className="icon-wrapper" style={{ color: '#0ea5e9', background: 'rgba(14, 165, 233, 0.1)', borderColor: 'rgba(14, 165, 233, 0.2)' }}>
            <Terminal size={32} />
          </div>
          <h1>Developer Access to UniX<span className="text-highlight">Hub</span></h1>
          <p>Manage platform configurations</p>
        </header>

        {error && (
          <div className="error-message">
            <User size={18} /> {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Developer Email</label>
            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                className="auth-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Mail className="input-icon" size={20} />
            </div>
          </div>

          <div className="form-group">
            <label>Developer ID</label>
            <div className="input-wrapper">
              <input
                type="text"
                name="developerId"
                className="auth-input"
                value={formData.developerId}
                onChange={handleChange}
                required
              />
              <Code className="input-icon" size={20} />
            </div>
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="auth-input"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Lock className="input-icon" size={20} />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" className="forgot-password">Forgot keys?</a>
          </div>

          <button type="submit" className="auth-btn" disabled={loading} style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)' }}>
            {loading ? <div className="btn-spinner"></div> : 'Developer Login'}
          </button>
        </form>

        <div className="auth-footer">
          Go Back To <span className="auth-link" onClick={() => navigate('/login')}>Login Panel</span>
        </div>
      </div>
    </div>
  );
};

export default DeveloperLoginPage;
