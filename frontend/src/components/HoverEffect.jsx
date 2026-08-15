import React, { useRef } from 'react';

const HoverEffect = ({ children, className = '', effect = 'glow' }) => {
  const containerRef = useRef(null);

  const handleMouseEnter = () => {
    if (effect === 'glow') {
      containerRef.current.style.boxShadow = '0 0 20px rgba(59, 130, 246, 0.5)';
    } else if (effect === 'scale') {
      containerRef.current.style.transform = 'scale(1.05)';
    } else if (effect === 'rotate') {
      containerRef.current.style.transform = 'rotate(2deg)';
    }
  };

  const handleMouseLeave = () => {
    containerRef.current.style.boxShadow = '';
    containerRef.current.style.transform = '';
  };

  return (
    <div
      ref={containerRef}
      className={`transition-all duration-300 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

export default HoverEffect;