import React, { useState, useEffect } from 'react';

interface Orb {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  phase: number;
  amplitude: number;
  frequency: number;
  isAttracted: boolean;
  opacity: number;
}

interface MousePosition {
  x: number;
  y: number;
}

export function ParticleBackground() {
  const [mousePos, setMousePos] = useState<MousePosition>({ x: 0, y: 0 });
  const [orbs, setOrbs] = useState<Orb[]>([]);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const newOrbs: Orb[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 40 + 60,
      speedX: (Math.random() - 0.5) * 1,
      speedY: (Math.random() - 0.5) * 1,
      phase: Math.random() * Math.PI * 2,
      amplitude: Math.random() * 30 + 10,
      frequency: Math.random() * 0.02 + 0.01,
      isAttracted: Math.random() > 0.5,
      opacity: Math.random() * 0.4 + 0.3
    }));
    setOrbs(newOrbs);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const updateOrbs = () => {
      setTime(t => t + 1);
      setOrbs(prevOrbs => prevOrbs.map(orb => {
        const wavyX = Math.sin(time * orb.frequency + orb.phase) * orb.amplitude;
        const wavyY = Math.cos(time * orb.frequency + orb.phase) * orb.amplitude;

        let dx = mousePos.x - orb.x;
        let dy = mousePos.y - orb.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.min(100 / (distance + 1), 1);

        let newX = orb.x + orb.speedX + wavyX * 0.1;
        let newY = orb.y + orb.speedY + wavyY * 0.1;

        if (distance < 400) {
          const factor = orb.isAttracted ? influence : -influence;
          newX += dx * factor * 0.02;
          newY += dy * factor * 0.02;
        }

        if (newX < -100) newX = window.innerWidth + 100;
        if (newX > window.innerWidth + 100) newX = -100;
        if (newY < -100) newY = window.innerHeight + 100;
        if (newY > window.innerHeight + 100) newY = -100;

        return { ...orb, x: newX, y: newY };
      }));
    };

    const animationFrame = requestAnimationFrame(updateOrbs);
    return () => cancelAnimationFrame(animationFrame);
  }, [mousePos, time]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden bg-gradient-to-b from-gray-900 via-blue-900 to-gray-900">
      {orbs.map(orb => (
        <div
          key={orb.id}
          className="absolute rounded-full"
          style={{
            left: `${orb.x}px`,
            top: `${orb.y}px`,
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            opacity: orb.opacity,
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle at 30% 30%, 
              rgba(147, 197, 253, 0.6), 
              rgba(139, 92, 246, 0.4))`,
            boxShadow: `
              0 0 20px rgba(147, 197, 253, 0.3),
              0 0 40px rgba(139, 92, 246, 0.2) inset
            `
          }}
        />
      ))}
    </div>
  );
}