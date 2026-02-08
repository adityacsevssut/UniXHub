import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Briefcase, Terminal } from 'lucide-react';
import Navbar from '../../components/Navbar';
import './Auth.css';

const LoginOptions = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-card login-options-card">
        <header className="auth-header">
          <h1>Welcome UniX<span className="text-highlight">Hub</span> Login Panel</h1>
          <p>Select your role to continue to UniX<span className="text-highlight">Hub</span></p>
        </header>

        <div className="login-options-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1.5rem',
          marginTop: '2rem'
        }}>

          {/* User Login Option */}
          <div
            className="option-card"
            onClick={() => navigate('/user-login')}
            style={{
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              padding: '2.5rem 1.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--primary-color)';
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(79, 70, 229, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div className="icon-wrapper" style={{ marginBottom: '1.5rem', width: '80px', height: '80px' }}>
              <User size={36} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.8rem', color: 'var(--text-main)' }}>User Login</h3>

          </div>

          {/* Partner Login Option */}
          <div
            className="option-card"
            onClick={() => navigate('/partner-login')}
            style={{
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              padding: '2.5rem 1.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--secondary-color)';
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(236, 72, 153, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div className="icon-wrapper" style={{
              marginBottom: '1.5rem',
              width: '80px',
              height: '80px',
              color: 'var(--secondary-color)',
              background: 'rgba(236, 72, 153, 0.1)',
              borderColor: 'rgba(236, 72, 153, 0.2)'
            }}>
              <Briefcase size={36} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.8rem', color: 'var(--text-main)' }}>Partner Login</h3>

          </div>


          {/* Developer Login Option */}
          <div
            className="option-card"
            onClick={() => navigate('/developer-login')}
            style={{
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              padding: '2.5rem 1.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              background: 'rgba(255,255,255,0.6)',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#0ea5e9'; // Sky blue for devs
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(14, 165, 233, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div className="icon-wrapper" style={{
              marginBottom: '1.5rem',
              width: '80px',
              height: '80px',
              color: '#0ea5e9',
              background: 'rgba(14, 165, 233, 0.1)',
              borderColor: 'rgba(14, 165, 233, 0.2)'
            }}>
              <Terminal size={36} />
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.8rem', color: 'var(--text-main)' }}>Developer Login</h3>

          </div>

        </div>
      </div>
    </div>
  );
};

export default LoginOptions;
