
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, LogIn, Linkedin, Chrome, ArrowLeft, AlertCircle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { auth } from '../../firebase';
import { signInWithEmailAndPassword, sendEmailVerification, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useToast } from '../../context/ToastContext';
import './Auth.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Attempt to sign in with Firebase to check verification status
      // Note: If user exists in Backend but not Firebase (legacy), this might fail. 
      // We can try-catch and fall back to backend login, or enforce Firebase.
      // Assuming new system:

      /* Firebase login attempt removed. We only auth via backend now. */

      /* Removed Firebase emailVerified check since we use backend OTP now */

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
        const firstName = data.name.split(' ')[0];
        showToast(`Welcome ${firstName} to UniXHub! Logged in successfully.`, 'success');
        setTimeout(() => navigate('/'), 500);
      } else {
        if (res.status === 404 || data.message === "User not found" || data.message === "Invalid credentials") {
          // Possible zombie account: Exists in Firebase (if we used it) but not in DB.
          // However, our login flow doesn't force Firebase login first anymore.
          // If we fail here, we just show error.

          // If the user tries to login and gets "User not found", it means they need to register.
          // If they try to register and get "Email already in use", it means they are in Firebase.
          // This catches the loop.
        }
        const errorMsg = data.message || 'Invalid credentials';
        setError(errorMsg);
        showToast(errorMsg, 'error');
      }
    } catch (err) {
      const errorMsg = 'Network error. Please try again later.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!formData.email) {
      setError('Please enter your email first');
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await res.json();
      if (res.ok) {
        setShowOtpInput(true);
        setError('');
        showToast(`OTP resent to ${formData.email}. Check your Inbox/Spam.`, 'info');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, otp })
      });

      const data = await res.json();

      if (res.ok) {
        showToast('Email verified successfully! You can now login.', 'success');
        setShowOtpInput(false);
        setOtp('');
      } else {
        setError(data.message || 'Verification failed');
      }
    } catch (err) {
      setError('Network error during verification');
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Split display name
      const nameParts = user.displayName ? user.displayName.split(' ') : ['User'];
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '';

      // Call backend
      const res = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          firstName,
          lastName,
          firebaseUid: user.uid
        })
      });

      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        console.error("Non-JSON response:", text);
        throw new Error("Server error: Backend not reachable or not updated. Please restart backend.");
      }

      if (res.ok) {
        localStorage.setItem('user', JSON.stringify(data));
        showToast(`Welcome ${data.name}! Logged in successfully.`, 'success');
        setTimeout(() => navigate('/'), 500);
      } else {
        if (res.status === 404) {
          showToast('Account not found. Please Sign Up first.', 'warning');
          // Optional: navigate('/register');
        } else {
          showToast(data.message || 'Google login failed', 'error');
        }
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      if (error.code === 'auth/operation-not-allowed') {
        showToast('Google Sign-In is not enabled on the server. Please contact support.', 'error');
      } else if (error.code === 'auth/popup-closed-by-user') {
        showToast('Sign-in cancelled.', 'info');
      } else if (error.code === 'auth/popup-blocked') {
        showToast('Sign-in popup blocked. Please allow popups.', 'warning');
      } else {
        showToast(`Login failed: ${error.message}`, 'error');
      }
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

          {showOtpInput && (
            <div className="form-group">
              <label>Enter OTP</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  className="auth-input"
                  style={{ textAlign: 'center', letterSpacing: '0.2em', fontSize: '1.1rem' }}
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
              <button
                type="button"
                className="auth-btn"
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== 6}
                style={{ marginTop: '1rem' }}
              >
                {loading ? <div className="btn-spinner"></div> : 'Verify OTP'}
              </button>
            </div>
          )}

          <div className="form-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <span className="forgot-password" onClick={() => navigate('/forgot-password')} style={{ cursor: 'pointer' }}>Forgot Password?</span>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? <div className="btn-spinner"></div> : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider">
          <span>Or continue with</span>
        </div>

        <div className="social-login">
          <button className="social-btn" onClick={handleGoogleLogin} type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg> Google
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
