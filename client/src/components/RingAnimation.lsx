import { useEffect, useRef } from 'react';

interface Ring {
  radius: number;
  baseRadius: number;
  index: number;
  rotationAngle: number;
  orbitAngle: number;
  particles: Array<{
    angle: number;
    size: number;
    brightness: number;
    flickerSpeed: number;
  }>;
  state: 'waiting' | 'spinning' | 'orbiting';
  spinProgress: number;
  orbitProgress: number;
  orbitRadius: number;
  centerOffset: { x: number; y: number };
}

class RingClass implements Ring {
  constructor(radius: number, particleCount: number, index: number) {
    this.radius = radius;
    this.baseRadius = radius;
    this.index = index;
    this.rotationAngle = 0;
    this.orbitAngle = 0;
    this.particles = [];
    this.state = 'waiting';
    this.spinProgress = 0;
    this.orbitProgress = 0;
    this.orbitRadius = 0;
    this.centerOffset = { x: 0, y: 0 };

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        angle: (i / particleCount) * Math.PI * 2,
        size: 1.5 + Math.random() * 2,
        brightness: 0.3 + Math.random() * 0.7,
        flickerSpeed: 0.02 + Math.random() * 0.03
      });
    }
  }

  update(deltaTime: number): boolean {
    const spinDuration = 1000;
    const orbitDuration = 1000;

    switch (this.state) {
      case 'spinning':
        this.spinProgress += deltaTime / spinDuration;
        if (this.spinProgress >= 1) {
          this.spinProgress = 1;
          this.state = 'waiting';
          return true;
        }
        this.rotationAngle = this.easeInOutQuad(this.spinProgress) * Math.PI * 2;
        break;

      case 'orbiting':
        this.orbitProgress += deltaTime / orbitDuration;
        if (this.orbitProgress >= 1) {
          this.orbitProgress = 1;
          this.state = 'waiting';
          return true;
        }
        const orbitAngle = this.easeInOutQuad(this.orbitProgress) * Math.PI * 2;
        this.centerOffset = {
          x: Math.cos(orbitAngle) * this.orbitRadius,
          y: Math.sin(orbitAngle) * this.orbitRadius
        };
        break;
    }

    // Update particle effects
    this.particles.forEach(particle => {
      particle.brightness = 0.3 + Math.abs(Math.sin(Date.now() * 0.001 * particle.flickerSpeed)) * 0.7;
    });

    return false;
  }

  startSpin() {
    this.state = 'spinning';
    this.spinProgress = 0;
    this.rotationAngle = 0;
    this.centerOffset = { x: 0, y: 0 };
  }

  startOrbit() {
    this.state = 'orbiting';
    this.orbitProgress = 0;
    this.orbitRadius = this.baseRadius * 0.3;
  }

  draw(ctx: CanvasRenderingContext2D, centerX: number, centerY: number) {
    const drawX = centerX + this.centerOffset.x;
    const drawY = centerY + this.centerOffset.y;

    // Draw particles
    this.particles.forEach(particle => {
      const angle = particle.angle + this.rotationAngle;
      const x = drawX + Math.cos(angle) * this.radius;
      const y = drawY + Math.sin(angle) * this.radius;

      // Draw particle
      ctx.beginPath();
      ctx.arc(x, y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 255, 255, ${particle.brightness})`;
      ctx.fill();

      // Draw trail
      const trailLength = 5;
      for (let i = 1; i <= trailLength; i++) {
        const trailAngle = angle - (i * 0.1);
        const trailX = drawX + Math.cos(trailAngle) * this.radius;
        const trailY = drawY + Math.sin(trailAngle) * this.radius;
        ctx.beginPath();
        ctx.arc(trailX, trailY, particle.size * (1 - i/trailLength), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 255, ${particle.brightness * (1 - i/trailLength) * 0.5})`;
        ctx.fill();
      }
    });

    // Draw ring
    ctx.beginPath();
    ctx.arc(drawX, drawY, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  private easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  }
}

export default function RingAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const ringsRef = useRef<RingClass[]>([]);
  const lastTimeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    function initRings() {
      ringsRef.current = [];
      const baseRadius = Math.min(width, height) * 0.2;

      // Create rings with different sizes
      for (let i = 0; i < 4; i++) {
        const radius = baseRadius * (0.5 + i * 0.2);
        ringsRef.current.push(new RingClass(radius, 30 + i * 10, i));
      }

      // Start the first ring
      ringsRef.current[0].startSpin();
    }

    function drawLogo(centerX: number, centerY: number) {
      const radius = Math.min(width, height) * 0.15;

      // Draw central circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fill();
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.5)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw "AI" text
      ctx.font = `bold ${radius * 0.6}px Arial`;
      ctx.fillStyle = 'rgba(0, 255, 255, 0.9)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('AI', centerX, centerY);

      // Draw "AGENT LEE" text
      const text = 'AGENT LEE';
      ctx.font = `bold ${radius * 0.2}px Arial`;
      ctx.save();
      ctx.translate(centerX, centerY - radius * 0.8);
      ctx.fillText(text, 0, 0);
      ctx.restore();
    }

    let currentRingIndex = 0;
    let animationState: 'spinning' | 'orbiting' = 'spinning';

    function animate(currentTime: number) {
      if (!lastTimeRef.current) lastTimeRef.current = currentTime;
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      ctx.clearRect(0, 0, width, height);
      const centerX = width / 2;
      const centerY = height / 2;

      // Update and draw rings
      const currentRing = ringsRef.current[currentRingIndex];
      if (currentRing) {
        const completed = currentRing.update(deltaTime);
        if (completed) {
          currentRingIndex++;
          if (currentRingIndex >= ringsRef.current.length) {
            if (animationState === 'spinning') {
              animationState = 'orbiting';
              currentRingIndex = 0;
              ringsRef.current[0].startOrbit();
            } else {
              currentRingIndex = 0;
              animationState = 'spinning';
              ringsRef.current[0].startSpin();
            }
          } else {
            if (animationState === 'spinning') {
              ringsRef.current[currentRingIndex].startSpin();
            } else {
              ringsRef.current[currentRingIndex].startOrbit();
            }
          }
        }
      }

      // Draw all rings
      ringsRef.current.forEach(ring => ring.draw(ctx, centerX, centerY));

      // Draw logo
      drawLogo(centerX, centerY);

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initRings();
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-10" />;
}
