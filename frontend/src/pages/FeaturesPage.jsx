import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Features from '../components/Features';
import Footer from '../components/Footer';

const FeaturesPage = () => {
  // Ensure the page starts at the top when loaded
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="features-page">
      <Navbar />
      <div style={{ paddingTop: '80px' }}>
        <Features />
      </div>
      <Footer />
    </div>
  );
};

export default FeaturesPage;
