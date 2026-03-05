import React from 'react';
import Loader from './Loader';

const LoadingOverlay = ({ loading, text }) => {
  if (!loading) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(248, 250, 252, 0.95)', // Matches app bg color with opacity
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backdropFilter: 'blur(8px)',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>
      <Loader text={text} />
    </div>
  );
};

export default LoadingOverlay;
