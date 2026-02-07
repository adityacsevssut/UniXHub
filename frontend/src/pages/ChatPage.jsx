import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Smile, Paperclip, Mic, Layout, CreditCard, Calendar, MessageSquarePlus, Clock, CheckCircle, MoreVertical } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './ChatPage.css';

const ChatPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const freelancer = state?.freelancer || {
    name: "Support User",
    image: "https://via.placeholder.com/150",
    role: "Freelancer",
    status: "Online"
  };

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(() => {
    // Generate 100 mock messages
    const mockMessages = [];
    const senders = ['me', 'them'];
    const sampleTexts = [
      "Here is the first draft of the logo.",
      "Can we adjust the colors?",
      "Sure, I'll send the updated version shortly.",
      "What did you think about the font choice?",
      "It looks great, but maybe something bolder?",
      "Understood. How about this one?",
      "Perfect! That's exactly what I had in mind.",
      "Glad you like it! moving on to the banner next.",
      "Please let me know if you need any changes.",
      "Will do, thanks for the quick turnaround."
    ];

    for (let i = 1; i <= 100; i++) {
      mockMessages.push({
        id: i,
        text: sampleTexts[Math.floor(Math.random() * sampleTexts.length)] + ` (Msg ${i})`,
        sender: senders[Math.floor(Math.random() * senders.length)],
        time: `${9 + Math.floor(i / 12)}:${(i * 5) % 60 < 10 ? '0' : ''}${(i * 5) % 60} AM`
      });
    }
    return mockMessages;
  });

  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: message,
      sender: 'me',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  return (
    <div className="chat-page-layout">
      <Navbar />
      <div className="chat-app-container">

        {/* Mobile Overlay to close dashboard */}
        {isDashboardOpen && (
          <div className="dashboard-overlay-mobile" onClick={() => setIsDashboardOpen(false)}></div>
        )}

        {/* Left Sidebar - Project Dashboard (Responsive Drawer) */}
        <aside className={`project-dashboard ${isDashboardOpen ? 'open' : ''}`}>
          <div className="dashboard-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Project Dashboard</h3>
              {/* Close button for mobile */}
              <button className="close-dashboard-btn" onClick={() => setIsDashboardOpen(false)}>
                <ArrowLeft size={20} />
              </button>
            </div>
            <p>Manage your collaboration</p>
          </div>

          <div className="dashboard-content">
            {/* Project Status Card */}
            <div className="dashboard-card status-card">
              <div className="card-icon"><Clock size={20} /></div>
              <div className="card-info">
                <h4>Est. Delivery</h4>
                <p>Oct 24, 2026</p>
              </div>
            </div>

            {/* Action Sections */}
            <div className="dashboard-section">
              <h4>Actions</h4>

              <button
                className="dashboard-btn"
                onClick={() => navigate('/templates')}
              >
                <div className="btn-icon"><Layout size={18} /></div>
                <span>Available Templates</span>
              </button>

              <button className="dashboard-btn">
                <div className="btn-icon"><CreditCard size={18} /></div>
                <span>Make Payment</span>
              </button>

              <button
                className="dashboard-btn"
                onClick={() => navigate('/feedback')}
              >
                <div className="btn-icon"><MessageSquarePlus size={18} /></div>
                <span>Give Feedback</span>
              </button>
            </div>

            <div className="dashboard-section">
              <h4>Project Details</h4>
              <div className="detail-item">
                <CheckCircle size={16} className="text-green" />
                <span>Concept Approved</span>
              </div>
              <div className="detail-item">
                <Calendar size={16} className="text-blue" />
                <span>Kickoff: Oct 10, 2026</span>
              </div>
            </div>

            {/* Payment Status Wrapper (Mock) */}
            <div className="dashboard-card payment-info">
              <p>Total Budget: <span>$250.00</span></p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '30%' }}></div>
              </div>
              <small>30% Paid</small>
            </div>

          </div>
        </aside>

        {/* Main Chat Window */}
        <main className="chat-window">
          {/* Chat Header */}
          <header className="chat-header">
            <div className="header-left">
              {/* Mobile Back Button */}
              <button className="back-btn-mobile" onClick={() => navigate(-1)}>
                <ArrowLeft size={24} />
              </button>

              {/* Desktop Back Button (New) */}
              <button className="back-btn-desktop" onClick={() => navigate(-1)}>
                <ArrowLeft size={20} />
                <span>Back</span>
              </button>

              <div className="chat-avatar-header">
                <img src={freelancer.image} alt={freelancer.name} />
              </div>
              <div className="header-info">
                <h3>{freelancer.name}</h3>
                <p>online</p>
              </div>
            </div>

            <button className="dashboard-toggle-btn" onClick={() => setIsDashboardOpen(true)}>
              <MoreVertical size={24} />
            </button>
          </header>

          {/* Messages Area */}
          <div className="messages-container">
            <div className="message-date-separator">
              <span>Today</span>
            </div>

            {messages.map((msg) => (
              <div key={msg.id} className={`message-bubble ${msg.sender === 'me' ? 'sent' : 'received'}`}>
                <div className="message-content">
                  <p>{msg.text}</p>
                  <span className="message-time">
                    {msg.time}
                    {msg.sender === 'me' && <span className="read-status">✓✓</span>}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <footer className="chat-input-area">
            <button className="icon-btn"><Smile size={24} /></button>
            <button className="icon-btn"><Paperclip size={24} /></button>

            <form className="input-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder="Type a message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </form>

            {message.trim() ? (
              <button className="icon-btn send-btn" onClick={handleSendMessage}>
                <Send size={24} />
              </button>
            ) : (
              <button className="icon-btn">
                <Mic size={24} />
              </button>
            )}
          </footer>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ChatPage;
