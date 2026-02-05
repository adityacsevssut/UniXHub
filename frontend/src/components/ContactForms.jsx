import React from 'react';
import { MessageSquare, HelpCircle, Send, User, Mail, AlertCircle, FileText } from 'lucide-react';
import './ContactForms.css';

const ContactForms = () => {
  const [activeForm, setActiveForm] = React.useState('feedback');

  return (
    <section className="contact-forms-section" id="contact-forms">
      <div className="container contact-forms-container">

        {activeForm === 'feedback' ? (
          /* Feedback Form */
          <div className="form-card feedback-card" id="feedback">
            <div className="form-header">
              <div className="icon-wrapper">
                <MessageSquare size={28} />
              </div>
              <h3>Your Feedback Matters</h3>
              <p>Help us improve your experience with UniXHub.</p>
            </div>

            <form className="styled-form">
              <div className="form-group">
                <label>Name</label>
                <div className="field-wrapper">
                  <input type="text" placeholder="Your Name" required />
                  <User size={18} className="input-icon" />
                </div>
              </div>
              <div className="form-group">
                <label>Email</label>
                <div className="field-wrapper">
                  <input type="email" placeholder="your@email.com" required />
                  <Mail size={18} className="input-icon" />
                </div>
              </div>
              <div className="form-group">
                <label>Message</label>
                <div className="field-wrapper">
                  <textarea placeholder="Tell us what you think..." rows="4" required></textarea>
                </div>
              </div>
              <button type="submit" className="submit-btn feedback-btn">
                <span>Send Feedback</span>
                <Send size={18} />
              </button>
            </form>
            
            <div className="form-footer-link">
               <p>Facing technical issues? <button onClick={() => setActiveForm('help')} className="text-link">Need Help?</button></p>
            </div>
          </div>
        ) : (
          /* Need Help Form */
          <div className="form-card help-card" id="support">
            <div className="form-header">
              <div className="icon-wrapper">
                <HelpCircle size={28} />
              </div>
              <h3>Need Help?</h3>
              <p>Facing issues? We are here to support you 24/7.</p>
            </div>

            <form className="styled-form">
              <div className="form-group">
                <label>Name</label>
                <div className="field-wrapper">
                  <input type="text" placeholder="Your Name" required />
                  <User size={18} className="input-icon" />
                </div>
              </div>
              <div className="form-group">
                <label>Issue Type</label>
                <div className="field-wrapper">
                  <select>
                    <option>General Inquiry</option>
                    <option>Technical Support</option>
                    <option>Account Issue</option>
                    <option>Other</option>
                  </select>
                  <AlertCircle size={18} className="input-icon" />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <div className="field-wrapper">
                  <textarea placeholder="Describe your issue..." rows="4" required></textarea>
                </div>
              </div>
              <button type="submit" className="submit-btn help-btn">
                <span>Get Support</span>
                <Send size={18} />
              </button>
            </form>

            <div className="form-footer-link">
               <p>Want to share feedback? <button onClick={() => setActiveForm('feedback')} className="text-link">Go to Feedback</button></p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default ContactForms;
