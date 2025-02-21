import React, { useEffect, useRef, useState } from 'react';
import DigitalLoadingScreen from './DigitalLoadingScreen';

const AgentLee = ({ className = '' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 flex items-center justify-center bg-black ${className}`}
      style={{ zIndex: 9999 }}
    >
      {isLoading ? (
        <DigitalLoadingScreen />
      ) : (
        <div className="text-cyan-400 text-2xl">
          <h1>Agent Lee Interface</h1>
          <p>AI Assistant Ready</p>
        </div>
      )}
    </div>
  );
};

export default AgentLee;
