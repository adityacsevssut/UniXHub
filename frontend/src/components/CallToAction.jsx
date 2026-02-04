import React from 'react';
import { MessageCircle } from 'lucide-react';
import './CallToAction.css';

const CallToAction = () => {
  return (
    <section className="cta-section">
      <div className="container cta-container">
        <h2 className="cta-title">Ready to Transform Your Future?</h2>
        <p className="cta-subtitle">
          Join hundreds of students who have transformed their careers with TalentSync.
          <br />
          Start your freelancing journey today and build real-world experience.
        </p>

        <button className="cta-button">
          <MessageCircle size={20} />
          <span>Talk to Advisor</span>
        </button>
      </div>
    </section>
  );
};

export default CallToAction;
