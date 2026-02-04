import React from 'react';
import { MessageSquare, HelpCircle, Send } from 'lucide-react';
import './ContactForms.css';

const ContactForms = () => {
  return (
    <section className="contact-forms-section" id="contact-forms">
      <div className="container contact-forms-container">

        {/* Feedback Form */}
        <div className="form-card feedback-card" id="feedback">
          <div className="form-header">
            <div className="icon-wrapper feedback-icon">
              <MessageSquare size={24} />
            </div>
            <h3>Your Feedback Matters</h3>
            <p>Help us improve your experience with UniXHub.</p>
          </div>

          <form className="styled-form">
            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="Your Name" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="your@email.com" />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea placeholder="Tell us what you think..." rows="4"></textarea>
            </div>
            <button type="submit" className="submit-btn feedback-btn">
              <span>Send Feedback</span>
              <Send size={18} />
            </button>
          </form>
        </div>

        {/* Need Help Form */}
        <div className="form-card help-card" id="support">
          <div className="form-header">
            <div className="icon-wrapper help-icon">
              <HelpCircle size={24} />
            </div>
            <h3>Need Help?</h3>
            <p>Facing issues? We are here to support you 24/7.</p>
          </div>

          <form className="styled-form">
            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="Your Name" />
            </div>
            <div className="form-group">
              <label>Issue Type</label>
              <select>
                <option>General Inquiry</option>
                <option>Technical Support</option>
                <option>Account Issue</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea placeholder="Describe your issue..." rows="4"></textarea>
            </div>
            <button type="submit" className="submit-btn help-btn">
              <span>Get Support</span>
              <Send size={18} />
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};

export default ContactForms;
