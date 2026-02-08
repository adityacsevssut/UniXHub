import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, School, Briefcase, Chrome, Linkedin, UserPlus } from 'lucide-react';
import Navbar from '../../components/Navbar';
import './Auth.css';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    role: '',
    collegeName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleRoleChange = (role) => {
    setFormData({ ...formData, role });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    if (formData.role === 'student' && !formData.collegeName.trim()) {
      setError('College Name is required for students');
      setLoading(false);
      return;
    }
    if (!formData.role) {
      setError('Please select a role');
      setLoading(false);
      return;
    }

    try {
      // Simulator delay
      // await new Promise(resolve => setTimeout(resolve, 800));

      const res = await fetch('http://localhost:5000/api/auth/register', {
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
        setError(data.message || 'Registration failed');
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
      <div className="auth-card" style={{ maxWidth: '600px' }}> {/* Wider card for signup */}
        <header className="auth-header">
          <div className="icon-wrapper">
            <UserPlus size={32} />
          </div>
          <h1>Welcome To UniX<span className="text-highlight">Hub</span></h1>
          <p>Join our professional community today</p>
        </header>

        {error && (
          <div className="error-message">
            <User size={18} /> {error}
          </div>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>

          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <div className="input-wrapper">
                <input
                  type="text" name="firstName" className="auth-input"
                  value={formData.firstName} onChange={handleChange} required
                />
                <User className="input-icon" size={20} />
              </div>
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <div className="input-wrapper">
                <input
                  type="text" name="lastName" className="auth-input"
                  value={formData.lastName} onChange={handleChange} required
                />
                <User className="input-icon" size={20} />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>I am a...</label>
            <div className="role-group">
              <div
                className={`role-option ${formData.role === 'student' ? 'selected' : ''}`}
                onClick={() => handleRoleChange('student')}
              >
                <input type="radio" name="role" checked={formData.role === 'student'} readOnly />
                <div className="role-label-text">College Student</div>
                <School size={20} className="text-gray-400" />
              </div>

              <div
                className={`role-option ${formData.role === 'professional' ? 'selected' : ''}`}
                onClick={() => handleRoleChange('professional')}
              >
                <input type="radio" name="role" checked={formData.role === 'professional'} readOnly />
                <div className="role-label-text">Professional</div>
                <Briefcase size={20} className="text-gray-400" />
              </div>

              <div
                className={`role-option ${formData.role === 'employer' ? 'selected' : ''}`}
                onClick={() => handleRoleChange('employer')}
              >
                <input type="radio" name="role" checked={formData.role === 'employer'} readOnly />
                <div className="role-label-text">Job Employer</div>
                <Briefcase size={20} className="text-gray-400" />
              </div>
            </div>
          </div>

          {formData.role === 'student' && (
            <div className="form-group" style={{ animation: 'slideUp 0.3s ease-out' }}>
              <label>College Name</label>
              <div className="input-wrapper">
                <input
                  type="text" name="collegeName" className="auth-input"

                  value={formData.collegeName} onChange={handleChange} required
                />
                <School className="input-icon" size={20} />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <input
                type="email" name="email" className="auth-input"
                value={formData.email} onChange={handleChange} required
              />
              <Mail className="input-icon" size={20} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password" className="auth-input"
                  value={formData.password} onChange={handleChange} required
                />
                <Lock className="input-icon" size={20} />
                <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label>Confirm</label>
              <div className="input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword" className="auth-input"
                  value={formData.confirmPassword} onChange={handleChange} required
                />
                <Lock className="input-icon" size={20} />
                <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <div className="btn-spinner"></div> : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <span className="auth-link" onClick={() => navigate('/user-login')}>Login</span>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
