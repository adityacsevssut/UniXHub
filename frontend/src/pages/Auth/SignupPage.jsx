import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, School, Briefcase, UserPlus, CheckCircle, KeyRound, Chrome, Linkedin } from 'lucide-react';
import Navbar from '../../components/Navbar';
import { auth } from '../../firebase'; // Import firebase auth
import { createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'; // Import firebase functions
import { useToast } from '../../context/ToastContext';
import OtpInput from '../../components/OtpInput';
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
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false); // State to track if OTP is sent
  const navigate = useNavigate();
  const { showToast } = useToast();

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
      const errorMsg = 'Passwords do not match';
      setError(errorMsg);
      showToast(errorMsg, 'error');
      setLoading(false);
      return;
    }
    if (formData.role === 'student' && !formData.collegeName.trim()) {
      const errorMsg = 'College Name is required for students';
      setError(errorMsg);
      showToast(errorMsg, 'warning');
      setLoading(false);
      return;
    }
    if (!formData.role) {
      setError('Please select a role');
      setLoading(false);
      return;
    }

    try {
      // 1. Create User in Firebase
      let firebaseUid = '';
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;
        firebaseUid = user.uid;

        // 2. Update Profile (DisplayName)
        await updateProfile(user, {
          displayName: `${formData.firstName} ${formData.lastName}`
        });

      } catch (fbErr) {
        if (fbErr.code === 'auth/email-already-in-use') {
          // User exists in Firebase. Try to clean up if they don't exist in backend.
          // We'll attempt to sign in to delete the user from Firebase.
          try {
            const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
            const user = userCredential.user;
            console.log("User found in Firebase (Zombie account). Deleting from Firebase to allow fresh signup...");
            await user.delete();
            console.log("Zombie account deleted. Retrying signup...");

            // Retry creation
            const newUserCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
            const newUser = newUserCredential.user;
            firebaseUid = newUser.uid;

            await updateProfile(newUser, {
              displayName: `${formData.firstName} ${formData.lastName}`
            });

          } catch (cleanupErr) {
            console.error("Failed to cleanup zombie account:", cleanupErr);
            throw new Error('Email is already in use. Please try logging in or use a different email.');
          }
        } else {
          throw fbErr;
        }
      }

      // 3. Register in Backend (which sends OTP)
      console.log("Sending registration request to backend...");
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          firebaseUid: firebaseUid,
          isVerified: false
        }),
      });

      const data = await res.json();
      console.log("Backend response:", data);

      if (res.ok) {
        setVerificationSent(true);
        setError('');
        showToast('Registration successful! OTP sent to your email.', 'success');
      } else {
        console.error("Backend registration failed:", data.message);
        const errorMsg = data.message || 'Registration failed';
        setError(errorMsg);
        showToast(errorMsg, 'error');
      }
    } catch (err) {
      console.error("Signup Error:", err);
      const errorMsg = err.message || 'Registration failed. Please check your network.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

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
        showToast('Email verified successfully! Redirecting to login...', 'success');
        setTimeout(() => {
          window.location.href = '/user-login';
        }, 1500);
      } else {
        setError(data.message || 'Verification failed');
      }
    } catch (err) {
      setError('Network error during verification');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    console.log("Resending OTP to:", formData.email);
    try {
      const res = await fetch('http://localhost:5000/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await res.json();
      console.log("Resend response:", res.status, data);

      if (res.ok) {
        setError('');
        showToast('OTP resent to your email!', 'info');
      } else {
        setError(data.message || 'Failed to resend OTP (Backend error)');
      }
    } catch (err) {
      console.error("Resend Error:", err);
      setError('Failed to resend OTP. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async (e) => {
    e.preventDefault(); // Prevents form submission
    if (!formData.role) {
      showToast('Please select a role first to continue with Google.', 'warning');
      return;
    }
    if (formData.role === 'student' && !formData.collegeName) {
      showToast('Please enter your college name first.', 'warning');
      return;
    }

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Split name
      const nameParts = user.displayName ? user.displayName.split(' ') : ['User'];
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || '';

      // Call backend with role
      const res = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          firstName,
          lastName,
          firebaseUid: user.uid,
          role: formData.role,
          collegeName: formData.collegeName
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
        showToast(`Welcome ${data.name}! Account created successfully.`, 'success');
        setTimeout(() => navigate('/'), 500);
      } else {
        showToast(data.message || 'Google signup failed', 'error');
      }

    } catch (error) {
      console.error("Google Signup Error:", error);
      if (error.code === 'auth/operation-not-allowed') {
        showToast('Google Sign-In is not enabled on the server. Please contact support.', 'error');
      } else if (error.code === 'auth/popup-closed-by-user') {
        showToast('Sign-up cancelled.', 'info');
      } else if (error.code === 'auth/popup-blocked') {
        showToast('Sign-up popup blocked. Please allow popups.', 'warning');
      } else {
        showToast(`Signup failed: ${error.message}`, 'error');
      }
    }
  };

  if (verificationSent) {
    return (
      <div className="auth-page">
        <Navbar />
        <div className="auth-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="icon-wrapper" style={{ margin: '0 auto 1.5rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderColor: '#10b981' }}>
            <KeyRound size={40} />
          </div>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Enter OTP</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: '1.6' }}>
            We've sent a 6-digit verification code to <strong>{formData.email}</strong>.<br />
            Please enter the code below to verify your account.
          </p>

          <form onSubmit={handleVerifyOtp} style={{ maxWidth: '400px', margin: '0 auto' }}>
            <OtpInput
              length={6}
              value={otp}
              onChange={setOtp}
              onComplete={(code) => {
                // Auto-submit when all 6 digits are entered
                // Optional: you can remove this if you want manual submit
              }}
            />
            <button className="auth-btn" type="submit" disabled={loading}>
              {loading ? <div className="btn-spinner"></div> : 'Verify & Register'}
            </button>
          </form>

          <p style={{ marginTop: '1.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Didn't receive the email? <span className="auth-link" onClick={handleResendOtp}>Resend Code</span>
          </p>
        </div>
      </div>
    );
  }

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

        <div className="auth-divider">
          <span>Or sign up with</span>
        </div>

        <div className="social-login">
          <button className="social-btn" onClick={handleGoogleSignup} type="button">
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg> Google
          </button>
        </div>

        <div className="auth-footer">
          Already have an account? <span className="auth-link" onClick={() => navigate('/user-login')}>Login</span>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
