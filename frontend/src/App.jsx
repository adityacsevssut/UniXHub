import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Support from './pages/Support';
import FeaturesPage from './pages/FeaturesPage';
import AboutPage from './pages/AboutPage';
import DomainsPage from './pages/DomainsPage';
import GraphicDesignPage from './pages/GraphicDesignPage';
import FreelancersPage from './pages/FreelancersPage';
import FreelancerPortfolioPage from './pages/FreelancerPortfolioPage';
import ChatPage from './pages/ChatPage';
import TemplatesPage from './pages/TemplatesPage';
import FeedbackPage from './pages/FeedbackPage';

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
          <Route path="/graphic-design" element={<GraphicDesignPage />} />
          <Route path="/freelancers" element={<FreelancersPage />} />
          <Route path="/portfolio" element={<FreelancerPortfolioPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/templates" element={<TemplatesPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
