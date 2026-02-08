
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, LogIn, Linkedin, Chrome, ArrowLeft } from 'lucide-react';
import Navbar from '../../components/Navbar';
import './Auth.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
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
      // Simulator delay for better UX (optional, but feels more "interactive")
      // await new Promise(resolve => setTimeout(resolve, 800));

      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        navigate('/');
      } else {
        setError(data.message || 'Invalid credentials');
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
          <div className="icon-wrapper">
            <LogIn size={32} />
          </div>
          <h1>Welcome back to UniX<span className="text-highlight">Hub</span></h1>
          <p>Login to continue your professional journey</p>
        </header>

        {error && (
          <div className="error-message">
            <User size={18} /> {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
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
            <a href="#" className="forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <div className="btn-spinner"></div> : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider">
          <span>Or continue with</span>
        </div>

        <div className="social-login">
          <button className="social-btn">
            <Chrome className="social-icon" /> Google
          </button>
          <button className="social-btn">
            <Linkedin className="social-icon" /> LinkedIn
          </button>
        </div>

        <div className="auth-footer">
          Don't have an account?
          <span className="auth-link" onClick={() => navigate('/register')}>Sign Up</span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
