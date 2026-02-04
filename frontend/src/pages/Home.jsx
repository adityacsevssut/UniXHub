import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Domains from '../components/Domains';

import About from '../components/About';
import CallToAction from '../components/CallToAction';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="home-page">
      <Navbar />
      <main>
        <Hero />
        <Domains />
        <About />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
