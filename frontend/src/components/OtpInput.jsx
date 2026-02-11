import React, { useRef, useState, useEffect } from 'react';
import './OtpInput.css';

const OtpInput = ({ length = 6, value = '', onChange, onComplete }) => {
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const inputRefs = useRef([]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (inputRefs.current[0] && !isMobile) {
      inputRefs.current[0].focus();
    }
  }, [isMobile]);

  // Sync internal array state with value prop
  useEffect(() => {
    if (value === '') {
      setOtp(new Array(length).fill(''));
      return;
    }
    // Also sync if value provided (e.g. switching from mobile to desktop)
    const newOtp = value.split('').slice(0, length);
    while (newOtp.length < length) newOtp.push('');
    setOtp(newOtp);
  }, [value, length]);

  const handleChange = (index, e) => {
    const val = e.target.value;

    // Only allow numbers
    if (val && !/^\d+$/.test(val)) {
      return;
    }

    const newOtp = [...otp];
    // Take only the last character in case user pastes multiple digits
    newOtp[index] = val.substring(val.length - 1);

    // Optimistic update
    setOtp(newOtp);

    // Send combined OTP to parent
    const combinedOtp = newOtp.join('');
    onChange(combinedOtp);

    // Auto-focus next input
    if (val && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }

    // Call onComplete if all digits are filled
    if (combinedOtp.length === length && onComplete) {
      onComplete(combinedOtp);
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }

    // Handle left arrow
    if (e.key === 'ArrowLeft' && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }

    // Handle right arrow
    if (e.key === 'ArrowRight' && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();

    // Only process if pasted data is numeric
    if (!/^\d+$/.test(pastedData)) {
      return;
    }

    const pastedArray = pastedData.slice(0, length).split('');
    const newOtp = [...otp];

    pastedArray.forEach((char, idx) => {
      newOtp[idx] = char;
    });

    setOtp(newOtp);
    onChange(newOtp.join(''));

    // Focus on the next empty box or the last box
    const nextIndex = Math.min(pastedArray.length, length - 1);
    if (inputRefs.current[nextIndex]) {
      inputRefs.current[nextIndex].focus();
    }

    if (newOtp.join('').length === length && onComplete) {
      onComplete(newOtp.join(''));
    }
  };

  // Mobile Input Handler
  const handleMobileChange = (e) => {
    const val = e.target.value;
    if (val && !/^\d+$/.test(val)) return;
    if (val.length > length) return;

    onChange(val);
    if (val.length === length && onComplete) {
      onComplete(val);
    }
  };

  if (isMobile) {
    return (
      <div className="otp-input-container mobile-view">
        <input
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          className="otp-mobile-input"
          maxLength={length}
          value={value}
          onChange={handleMobileChange}
          autoFocus
        />
      </div>
    );
  }

  return (
    <div className="otp-input-container">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          className="otp-input-box"
          autoComplete="off"
        />
      ))}
    </div>
  );
};

export default OtpInput;
