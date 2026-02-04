import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Domains from '../components/Domains';
import Features from '../components/Features';
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
        <Features />
        <About />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
