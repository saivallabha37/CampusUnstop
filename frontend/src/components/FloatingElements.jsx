import React, { useEffect, useRef } from 'react';

const FloatingElements = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create floating elements
    for (let i = 0; i < 20; i++) {
      const element = document.createElement('div');
      element.className = 'absolute w-2 h-2 bg-blue-400/20 rounded-full animate-pulse';
      element.style.left = Math.random() * 100 + '%';
      element.style.top = Math.random() * 100 + '%';
      element.style.animationDelay = Math.random() * 3 + 's';
      element.style.animationDuration = (Math.random() * 3 + 2) + 's';
      container.appendChild(element);
    }

    return () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden"
    />
  );
};

export default FloatingElements;