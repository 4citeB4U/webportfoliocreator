import { useEffect, useRef } from 'react';

interface OrbitalParticle {
  canvas: HTMLCanvasElement;
  x: number;
  y: number;
  angle: number;
  angularSpeed: number;
  orbitRadius: number;
  size: number;
  pulseSpeed: number;
  pulseOffset: number;
  opacity: number;
  currentSize: number;
  init(): void;
  update(): void;
  draw(ctx: CanvasRenderingContext2D, color: { r: number; g: number; b: number }): void;
}

class Particle implements OrbitalParticle {
  canvas: HTMLCanvasElement;
  x: number = 0;
  y: number = 0;
  angle: number = 0;
  angularSpeed: number = 0;
  orbitRadius: number = 0;
  size: number = 0;
  pulseSpeed: number = 0;
  pulseOffset: number = 0;
  opacity: number = 0;
  currentSize: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.init();
  }

  init() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;
    this.orbitRadius = Math.random() * (this.canvas.width * 0.15);
    this.angle = Math.random() * Math.PI * 2;
    this.angularSpeed = (0.2 + Math.random() * 0.5) * (Math.random() < 0.5 ? 1 : -1);
    this.x = centerX + Math.cos(this.angle) * this.orbitRadius;
    this.y = centerY + Math.sin(this.angle) * this.orbitRadius;
    this.size = Math.random() * 1.5 + 0.5; // Smaller particles
    this.pulseSpeed = Math.random() * 0.05 + 0.02;
    this.pulseOffset = Math.random() * Math.PI * 2;
    this.opacity = Math.random() * 0.3 + 0.7; // Higher base opacity
  }

  update() {
    const centerX = this.canvas.width / 2;
    const centerY = this.canvas.height / 2;

    this.angle += this.angularSpeed * 0.02;

    const baseX = centerX + Math.cos(this.angle) * this.orbitRadius;
    const baseY = centerY + Math.sin(this.angle) * this.orbitRadius;

    const time = Date.now() / 1000;
    const wobbleX = Math.sin(time * this.pulseSpeed + this.pulseOffset) * 1;
    const wobbleY = Math.cos(time * this.pulseSpeed + this.pulseOffset) * 1;

    this.x = baseX + wobbleX;
    this.y = baseY + wobbleY;

    this.currentSize = this.size * (1 + Math.sin(time * this.pulseSpeed) * 0.1);
  }

  draw(ctx: CanvasRenderingContext2D, color: { r: number; g: number; b: number }) {
    const time = Date.now() / 1000;
    const currentOpacity = this.opacity * (0.9 + Math.sin(time * this.pulseSpeed + this.pulseOffset) * 0.1);

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.currentSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${currentOpacity})`;
    ctx.fill();
  }
}

export default function AnimatedBackground() {
  const outerRingRef = useRef<HTMLCanvasElement>(null);
  const innerParticlesRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);

  useEffect(() => {
    const colors = [
      { r: 0, g: 149, b: 255 },    // Bright Blue
      { r: 66, g: 184, b: 255 },   // Light Blue
      { r: 0, g: 200, b: 255 },    // Cyan
      { r: 88, g: 161, b: 255 }    // Sky Blue
    ];

    let colorIndex = 0;
    let nextColorIndex = 1;
    let colorTransition = 0;
    const colorTransitionSpeed = 0.001;
    let pulseTime = 0;
    const pulseDuration = 6;
    const maxExpansion = 1.1; // Reduced expansion for smoother animation

    const resizeCanvas = () => {
      const container = document.getElementById('orbContainer');
      if (!container || !outerRingRef.current || !innerParticlesRef.current) return;

      const size = Math.min(container.offsetWidth, container.offsetHeight);
      outerRingRef.current.width = size;
      outerRingRef.current.height = size;
      innerParticlesRef.current.width = size;
      innerParticlesRef.current.height = size;
    };

    const initParticles = () => {
      if (!innerParticlesRef.current) return;
      particlesRef.current = Array.from({ length: 400 }, () => new Particle(innerParticlesRef.current!));
    };

    const drawOuterRing = (color: { r: number; g: number; b: number }) => {
      if (!outerRingRef.current) return;
      const ctx = outerRingRef.current.getContext('2d');
      if (!ctx) return;

      const centerX = outerRingRef.current.width / 2;
      const centerY = outerRingRef.current.height / 2;
      const baseRadius = outerRingRef.current.width * 0.25;

      const progress = (Math.sin(pulseTime * Math.PI * 2 / pulseDuration) + 1) / 2;
      const scaleFactor = 1 + (maxExpansion - 1) * progress;
      const opacity = 0.9 - (progress * 0.1); // Higher base opacity, less variation

      ctx.clearRect(0, 0, outerRingRef.current.width, outerRingRef.current.height);

      const radius = baseRadius * scaleFactor;
      const gradient = ctx.createRadialGradient(
        centerX, centerY, radius * 0.8, // Inner radius starts further out
        centerX, centerY, radius * 1.2  // Outer radius closer to inner
      );

      gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity})`);
      gradient.addColorStop(0.5, `rgba(${color.r}, ${color.g}, ${color.b}, ${opacity * 0.5})`);
      gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = (timestamp: number) => {
      colorTransition += colorTransitionSpeed;
      if (colorTransition >= 1) {
        colorTransition = 0;
        colorIndex = nextColorIndex;
        nextColorIndex = (nextColorIndex + 1) % colors.length;
      }

      pulseTime = (timestamp / 1000) % pulseDuration;

      const currentColor = {
        r: Math.round(colors[colorIndex].r + (colors[nextColorIndex].r - colors[colorIndex].r) * colorTransition),
        g: Math.round(colors[colorIndex].g + (colors[nextColorIndex].g - colors[colorIndex].g) * colorTransition),
        b: Math.round(colors[colorIndex].b + (colors[nextColorIndex].b - colors[colorIndex].b) * colorTransition)
      };

      if (innerParticlesRef.current) {
        const ctx = innerParticlesRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, innerParticlesRef.current.width, innerParticlesRef.current.height);
          particlesRef.current.forEach(particle => {
            particle.update();
            particle.draw(ctx, currentColor);
          });
        }
      }

      drawOuterRing(currentColor);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animationFrameRef.current = requestAnimationFrame(animate);

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div id="orbContainer" className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <canvas ref={outerRingRef} className="absolute" />
      <canvas ref={innerParticlesRef} className="absolute" />
    </div>
  );
}