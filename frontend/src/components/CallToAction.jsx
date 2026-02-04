import React from 'react';
import { MessageCircle } from 'lucide-react';
import './CallToAction.css';

const CallToAction = () => {
  return (
    <section className="cta-section">
      <div className="container cta-container">
        <h2 className="cta-title">Want To be Work With Us?</h2>


        <button className="cta-button">
          <MessageCircle size={20} />
          <span>Talk to Us</span>
        </button>
      </div>
    </section>
  );
};

export default CallToAction;
