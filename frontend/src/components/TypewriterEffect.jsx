import React, { useState, useEffect } from 'react';
import './Hero.css'; // Find styles here or create a new css file if needed

const TypewriterEffect = ({
  text,
  speed = 100,
  deleteSpeed = 50,
  loop = false,
  pauseDuration = 2000,
  delay = 0,
  className = '',
  cursorClassName = '',
  showCursor = true,
  hideCursorOnComplete = false,
  onComplete
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      setIsStarted(true);
    }, delay);
    return () => clearTimeout(startTimeout);
  }, [delay]);

  useEffect(() => {
    if (!isStarted) return;

    // Handle Typing
    if (!isDeleting && currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timeout);
    }
    // Handle Deleting
    else if (isDeleting && currentIndex > 0) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev.slice(0, -1));
        setCurrentIndex(prev => prev - 1);
      }, deleteSpeed);
      return () => clearTimeout(timeout);
    }
    // Handle Pause at End of Typing
    else if (!isDeleting && currentIndex === text.length) {
      if (onComplete) onComplete();

      if (loop) {
        const timeout = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
        return () => clearTimeout(timeout);
      }
    }
    // Handle Pause at End of Deleting (Empty)
    else if (isDeleting && currentIndex === 0) {
      if (loop) {
        const timeout = setTimeout(() => {
          setIsDeleting(false);
        }, 500); // Short pause before re-typing
        return () => clearTimeout(timeout);
      }
    }
  }, [currentIndex, text, speed, deleteSpeed, isStarted, isDeleting, loop, pauseDuration, onComplete]);

  const shouldShowCursor = showCursor && (!hideCursorOnComplete || isDeleting || currentIndex < text.length);

  return (
    <span className="typewriter-wrapper">
      <span className={`typewriter-text ${className}`}>{displayedText}</span>
      {shouldShowCursor && (
        <span className={`typewriter-cursor ${cursorClassName}`}>|</span>
      )}
    </span>
  );
};

export default TypewriterEffect;
