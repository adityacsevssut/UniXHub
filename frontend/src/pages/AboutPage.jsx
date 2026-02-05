import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import About from '../components/About';
import Footer from '../components/Footer';

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="about-page">
      <Navbar />
      <div style={{ paddingTop: '80px' }}>
        <About />
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
