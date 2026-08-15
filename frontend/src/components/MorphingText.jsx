import React, { useState, useEffect } from 'react';

const MorphingText = ({ texts, className = '' }) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentTextIndex((prev) => (prev + 1) % texts.length);
        setIsAnimating(false);
      }, 300);
    }, 3000);

    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <span
      className={`inline-block transition-all duration-300 ${
        isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
      } ${className}`}
    >
      {texts[currentTextIndex]}
    </span>
  );
};

export default MorphingText;