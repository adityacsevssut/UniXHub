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
import GraphicDesignAdmin from './pages/Admin/GraphicDesignAdmin';
import DeveloperDashboard from './pages/Admin/DeveloperDashboard';
import PartnerDashboard from './pages/Admin/PartnerDashboard';
import PartnerGraphicDesignManager from './pages/Admin/PartnerGraphicDesignManager';

import PartnerManagement from './pages/Admin/PartnerManagement';

import LoginPage from './pages/Auth/LoginPage';
import LoginOptions from './pages/Auth/LoginOptions';
import PartnerLoginPage from './pages/Auth/PartnerLoginPage';
import DeveloperLoginPage from './pages/Auth/DeveloperLoginPage';
import SignupPage from './pages/Auth/SignupPage';

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
          <Route path="/admin/graphic-design" element={<GraphicDesignAdmin />} />
          <Route path="/admin/dashboard" element={<DeveloperDashboard />} />
          <Route path="/admin/partners" element={<PartnerManagement />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/login" element={<LoginOptions />} />
          <Route path="/user-login" element={<LoginPage />} />
          <Route path="/partner-login" element={<PartnerLoginPage />} />
          <Route path="/partner/dashboard" element={<PartnerDashboard />} />
          <Route path="/partner/graphic-design" element={<PartnerGraphicDesignManager />} />
          <Route path="/developer-login" element={<DeveloperLoginPage />} />
          <Route path="/register" element={<SignupPage />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
