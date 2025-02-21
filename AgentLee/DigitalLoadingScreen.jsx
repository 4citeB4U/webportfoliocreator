import React, { useEffect, useRef, useState } from 'react';

export const DigitalLoadingScreen = () => {
  const canvasRef = useRef(null);
  const [characters, setCharacters] = useState([]);
  const [isForming, setIsForming] = useState(false);

  const text = "AGENT LEE";
  const fontSize = 72;
  const charSize = 16;
  const charCount = 600;

  const getRandomChar = () => {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef';
    return chars[Math.floor(Math.random() * chars.length)];
  };

  useEffect(() => {
    const initializeCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `bold ${fontSize}px "Courier New", monospace`;
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const textX = canvas.width / 2;
      const textY = 120;

      for (let i = 0; i < 3; i++) {
        ctx.fillText(text, textX, textY);
      }

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        const textPoints = [];

        for (let y = 0; y < canvas.height; y += 3) {
          for (let x = 0; x < canvas.width; x += 3) {
            const i = (y * canvas.width + x) * 4;
            if (pixels[i] > 128) {
              textPoints.push({ x, y });
            }
          }
        }

        while (textPoints.length < charCount) {
          textPoints.push(...textPoints);
        }

        const initialChars = Array.from({ length: charCount }, (_, i) => {
          let x, y;
          const position = Math.random();

          if (position < 0.25) {
            x = -20;
            y = Math.random() * canvas.height;
          } else if (position < 0.5) {
            x = canvas.width + 20;
            y = Math.random() * canvas.height;
          } else if (position < 0.75) {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? -20 : canvas.height + 20;
          } else {
            x = Math.random() * canvas.width;
            y = Math.random() * canvas.height;
          }

          const targetPoint = textPoints[i % textPoints.length];

          return {
            x,
            y,
            char: getRandomChar(),
            targetX: targetPoint.x,
            targetY: targetPoint.y,
            vx: 0,
            vy: 0,
            alpha: 0.9,
            size: charSize,
            changeTimer: Math.random() * 20,
            delay: Math.random() * 1000,
            active: false
          };
        });

        setCharacters(initialChars);

        setTimeout(() => {
          setIsForming(true);
        }, 500);
      } catch (error) {
        console.error('Error initializing canvas:', error);
      }
    };

    initializeCanvas();

    const handleResize = () => {
      initializeCanvas();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!characters.length) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = Date.now();

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const updatedChars = characters.map((char) => {
        if (elapsed < char.delay) return char;

        if (!char.active) {
          char.active = true;
        }

        char.changeTimer--;
        if (char.changeTimer <= 0) {
          char.char = getRandomChar();
          char.changeTimer = Math.random() * 20;
        }

        if (isForming && char.active) {
          const dx = char.targetX - char.x;
          const dy = char.targetY - char.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          char.vx += dx * 0.001;
          char.vy += dy * 0.001;

          char.vx += (Math.random() - 0.5) * 0.02;
          char.vy += (Math.random() - 0.5) * 0.02;

          const friction = dist < 50 ? 0.95 : 0.99;
          char.vx *= friction;
          char.vy *= friction;

          const speed = Math.sqrt(char.vx * char.vx + char.vy * char.vy);
          if (speed > 1.5) {
            char.vx = (char.vx / speed) * 1.5;
            char.vy = (char.vy / speed) * 1.5;
          }
        }

        char.x += char.vx;
        char.y += char.vy;

        return char;
      });

      ctx.font = `${charSize}px "Courier New", monospace`;
      updatedChars.forEach((char) => {
        ctx.fillStyle = `rgba(0, 255, 255, ${char.alpha * 0.4})`;
        ctx.shadowColor = 'rgba(0, 255, 255, 0.8)';
        ctx.shadowBlur = 12;
        ctx.fillText(char.char, char.x, char.y);

        ctx.fillStyle = `rgba(200, 255, 255, ${char.alpha})`;
        ctx.shadowBlur = 4;
        ctx.fillText(char.char, char.x, char.y);
      });

      setCharacters(updatedChars);
      requestAnimationFrame(animate);
    };

    const animationFrame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [characters, isForming]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
};

export default DigitalLoadingScreen;
