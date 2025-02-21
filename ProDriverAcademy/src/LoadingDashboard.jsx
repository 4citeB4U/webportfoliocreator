import React from 'react';

const LoadingDashboard = () => {
  const canvasRef = React.useRef(null);
  const textParticlesRef = React.useRef([]);
  const backgroundParticlesRef = React.useRef([]);
  const animationFrameRef = React.useRef();

  const generateRWDPoints = (width, height) => {
    const points = [];
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return points;

    canvas.width = width;
    canvas.height = height;

    // Large RWD text in upper portion
    const fontSize = Math.min(width * 0.7, height * 0.3);
    ctx.font = `bold ${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Position text at top third of screen
    const text = 'RWD';
    const centerY = height * 0.2;

    // Add strong white glow
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 30;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, width / 2, centerY);

    // Sample points densely for clear definition
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;
    const spacing = 4;

    for (let y = 0; y < height; y += spacing) {
      for (let x = 0; x < width; x += spacing) {
        const alpha = data[((y * width + x) * 4) + 3];
        if (alpha > 128) {
          points.push({ x, y });
        }
      }
    }

    return points;
  };

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Initialize background particles
    const backgroundParticleCount = 150;
    for (let i = 0; i < backgroundParticleCount; i++) {
      backgroundParticlesRef.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 2,
        speedY: (Math.random() - 0.5) * 2,
        color: ['#FF00FF40', '#00FFFF40', '#FF2E9740', '#3AF8FF40'][Math.floor(Math.random() * 4)]
      });
    }

    // Generate letter points and create text particles
    const points = generateRWDPoints(canvas.width, canvas.height);
    textParticlesRef.current = points.map(() => ({
      x: Math.random() * canvas.width * 1.5 - canvas.width * 0.25,
      y: Math.random() * canvas.height * 1.5 - canvas.height * 0.25,
      targetX: 0,
      targetY: 0,
      size: Math.random() * 3 + 2,
      color: ['#FF00FF', '#00FFFF', '#FF2E97', '#3AF8FF'][Math.floor(Math.random() * 4)],
      isFormed: false
    }));

    // Assign target positions for text particles
    textParticlesRef.current.forEach((particle, index) => {
      if (index < points.length) {
        particle.targetX = points[index].x;
        particle.targetY = points[index].y;
      }
    });

    const animate = () => {
      if (!canvas || !ctx) return;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw background particles
      backgroundParticlesRef.current.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around screen edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw background particle with subtle glow
        ctx.save();
        ctx.shadowBlur = 5;
        ctx.shadowColor = particle.color;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Update and draw text particles
      textParticlesRef.current.forEach(particle => {
        if (!particle.isFormed) {
          // Move towards target position with increased speed
          const dx = particle.targetX - particle.x;
          const dy = particle.targetY - particle.y;
          particle.x += dx * 0.3;
          particle.y += dy * 0.3;

          // Check if particle has reached its target
          if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
            particle.isFormed = true;
            particle.x = particle.targetX;
            particle.y = particle.targetY;
          }
        }

        // Draw text particle with strong glow
        ctx.save();
        ctx.shadowBlur = 15;
        ctx.shadowColor = particle.color;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-screen bg-black overflow-hidden z-0">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ background: 'black' }}
      />
    </div>
  );
};

export default LoadingDashboard;
