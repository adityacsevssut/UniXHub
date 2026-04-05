import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Support from './pages/Support';
import FeaturesPage from './pages/FeaturesPage';
import AboutPage from './pages/AboutPage';
import DomainsPage from './pages/DomainsPage';
import ChatPage from './pages/ChatPage';
import TemplatesPage from './pages/TemplatesPage';
import FeedbackPage from './pages/FeedbackPage';
import LoginPage from './pages/Auth/LoginPage';
import LoginOptions from './pages/Auth/LoginOptions';
import PartnerLoginPage from './pages/Auth/PartnerLoginPage';
import SignupPage from './pages/Auth/SignupPage';
import ForgotPasswordPage from './pages/Auth/ForgotPasswordPage';
import NotFoundPage from './pages/NotFoundPage';
import GraphicDesignHub from './pages/GraphicDesignHub';
import ProductDetails from './pages/ProductDetails';
import DeveloperDashboard from './pages/Admin/DeveloperDashboard';
import PartnerManagement from './pages/Admin/PartnerManagement';
import PartnerDashboard from './pages/Admin/PartnerDashboard';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastProvider } from './context/ToastContext';
import './styles/Toast.css';

const AuthRedirect = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      if (user.role === 'partner' && !location.pathname.startsWith('/partner')) {
        navigate('/partner/dashboard');
      } else if (user.role === 'developer' && !location.pathname.startsWith('/admin')) {
        navigate('/admin/dashboard');
      }
    }
  }, [user, location, navigate]);

  return children;
};

function App() {
  return (
    <ToastProvider>
      <div className="app">
        <div className="grid-bg"></div>
        <Router>
          <AuthRedirect>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/support" element={<Support />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/domains" element={<DomainsPage />} />
              <Route path="/chat" element={<ChatPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/admin/dashboard" element={<DeveloperDashboard />} />
              <Route path="/admin/partners" element={<PartnerManagement />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/login" element={<LoginOptions />} />
              <Route path="/user-login" element={<LoginPage />} />
              <Route path="/partner-login" element={<PartnerLoginPage />} />
              <Route path="/partner/dashboard" element={<PartnerDashboard />} />
              <Route path="/register" element={<SignupPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/graphic-design-hub" element={<GraphicDesignHub />} />
              <Route path="/graphic-design-hub/:id" element={<ProductDetails />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AuthRedirect>
        </Router>
      </div>
    </ToastProvider>
  );
}

export default App;
