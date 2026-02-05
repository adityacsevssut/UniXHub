import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Domains from '../components/Domains';
import Footer from '../components/Footer';

const DomainsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="domains-page">
      <Navbar />
      <div style={{ paddingTop: '80px' }}>
        <Domains />
      </div>
      <Footer />
    </div>
  );
};

export default DomainsPage;
