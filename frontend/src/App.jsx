import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Support from './pages/Support';
import FeaturesPage from './pages/FeaturesPage';


import AboutPage from './pages/AboutPage';
import DomainsPage from './pages/DomainsPage';

function App() {
  return (
    <div className="app">
      <div className="grid-bg"></div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/support" element={<Support />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/domains" element={<DomainsPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
