import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import ContactForms from '../components/ContactForms';
import Footer from '../components/Footer';

const Support = () => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="support-page" style={{ paddingTop: '80px' }}>
      <Navbar />
      <main>
        <div className="container" style={{ textAlign: 'center', marginBottom: '-4rem' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '800',
            marginBottom: '1rem',
            fontFamily: "'Outfit', sans-serif"
          }}>
            Contact <span className="text-highlight">Support</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
            We appreciate your feedback and are here to help you resolve any issues.
          </p>
        </div>
        <ContactForms />
      </main>
      <Footer />
    </div>
  );
};

export default Support;
