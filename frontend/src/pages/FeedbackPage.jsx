import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Star, Send } from 'lucide-react';
import './FeedbackPage.css';

const FeedbackPage = () => {
  const navigate = useNavigate();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setTimeout(() => navigate(-1), 2000); // Close after 2.5s
    }, 1000);
  };

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className="feedback-overlay">
      <div className="feedback-modal glass-card">
        <button className="close-btn-abs" onClick={handleClose}>
          <X size={24} />
        </button>

        {!isSubmitted ? (
          <>
            <div className="feedback-header">
              <h2>Rate Your Experience</h2>
              <p>How was your collaboration with the freelancer?</p>
            </div>

            <form onSubmit={handleSubmit} className="feedback-form">
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    className={`star-btn ${star <= (hoverRating || rating) ? 'active' : ''}`}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                  >
                    <Star size={32} fill={star <= (hoverRating || rating) ? "#fbbf24" : "none"} />
                  </button>
                ))}
              </div>

              <div className="form-group">
                <label>Additional Comments</label>
                <textarea
                  placeholder="Share your thoughts on the design quality, communication, etc..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={5}
                  required
                />
              </div>

              <button type="submit" className="submit-feedback-btn" disabled={rating === 0}>
                Submit Feedback <Send size={18} />
              </button>
            </form>
          </>
        ) : (
          <div className="success-message">
            <div className="success-icon">🎉</div>
            <h3>Thank You!</h3>
            <p>Your feedback helps us improve.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
