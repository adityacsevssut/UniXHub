import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Briefcase, Building2, Globe, ArrowLeft } from 'lucide-react';
import Navbar from '../../components/Navbar';
import './Auth.css';

const PartnerLoginPage = () => {
  const [formData, setFormData] = useState({ businessId: '', password: '' });
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
      const res = await fetch('http://localhost:5000/api/partners/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId: formData.businessId,
          password: formData.password
        })
      });

      const data = await res.json();

      if (res.ok) {
        // Add role 'partner' just in case it's missing (though API provides it usually or we infer it)
        const userToStore = { ...data, role: 'partner' };
        localStorage.setItem('user', JSON.stringify(userToStore));
        navigate('/partner/dashboard');
      } else {
        setError(data.message || 'Invalid Business ID or Password');
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
          <div className="icon-wrapper" style={{ color: 'var(--secondary-color)', background: 'rgba(236, 72, 153, 0.1)', borderColor: 'rgba(236, 72, 153, 0.2)' }}>
            <Briefcase size={32} />
          </div>
          <h1>Partner Login to UniX<span className="text-highlight">Hub</span></h1>
          <p>Access your recruiter dashboard</p>
        </header>

        {error && (
          <div className="error-message">
            <User size={18} /> {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Business ID</label>
            <div className="input-wrapper">
              <input
                type="text"
                name="businessId"
                className="auth-input"
                value={formData.businessId}
                onChange={handleChange}
                required
                placeholder="e.g., GD_PARTNER_01"
              />
              <Building2 className="input-icon" size={20} />
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

          <button type="submit" className="auth-btn" disabled={loading} style={{ background: 'linear-gradient(135deg, var(--secondary-color) 0%, #be185d 100%)' }}>
            {loading ? <div className="btn-spinner"></div> : 'Partner Sign In'}
          </button>


        </form>

        <div className="auth-footer">
          Are you a user?
          <span className="auth-link" onClick={() => navigate('/user-login')}>User Login</span>
        </div>
      </div>
    </div>
  );
};

export default PartnerLoginPage;
