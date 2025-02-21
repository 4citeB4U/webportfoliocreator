import React, { useState, useEffect } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  type: string;
  size: number;
}

export const FloatingEmojis: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Create initial particles
    const initialParticles = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      speedX: (Math.random() - 0.5) * 1.5, // Reduced speed for gentler movement
      speedY: (Math.random() - 0.5) * 1.5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      type: Math.random() > 0.5 ? '🪡' : '🧶',
      size: 24 + Math.random() * 24 // Increased size range (24-48px)
    }));

    setParticles(initialParticles);

    const animate = () => {
      setParticles(prev => prev.map(particle => {
        let newX = particle.x + particle.speedX;
        let newY = particle.y + particle.speedY;
        let newRotation = particle.rotation + particle.rotationSpeed;

        // Bounce off edges with some padding
        if (newX < 0 || newX > window.innerWidth - 40) {
          particle.speedX *= -1;
          newX = particle.x;
        }
        if (newY < 0 || newY > window.innerHeight - 40) {
          particle.speedY *= -1;
          newY = particle.y;
        }

        return {
          ...particle,
          x: newX,
          y: newY,
          rotation: newRotation
        };
      }));
    };

    const intervalId = setInterval(animate, 50);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0, opacity: 0.4 }}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute select-none"
          style={{
            left: particle.x,
            top: particle.y,
            transform: `rotate(${particle.rotation}deg)`,
            fontSize: `${particle.size}px`,
            transition: 'transform 0.05s linear'
          }}
        >
          {particle.type}
        </div>
      ))}
    </div>
  );
};