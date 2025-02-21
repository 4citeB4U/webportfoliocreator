import { useEffect, useRef } from 'react';
import { loadSlim } from "@tsparticles/slim";
import type { Engine, Container, ISourceOptions } from "@tsparticles/engine";

interface ParticleOptions {
  particles?: {
    color?: {
      value?: string;
    };
    number?: {
      value?: number;
      density?: {
        enable?: boolean;
        area?: number;
      };
    };
    opacity?: {
      value?: number;
    };
    size?: {
      value?: number | { min: number; max: number };
    };
    move?: {
      enable?: boolean;
      speed?: number;
    };
  };
}

export function useParticles(containerId: string, options: ParticleOptions): Engine | null {
  const engineRef = useRef<Engine | null>(null);
  const containerRef = useRef<Container | null>(null);

  useEffect(() => {
    const initParticles = async () => {
      try {
        engineRef.current = await loadSlim();

        if (!engineRef.current) {
          console.error("Failed to initialize particles engine");
          return;
        }

        if (containerRef.current) {
          await containerRef.current.destroy();
        }

        const particlesConfig: ISourceOptions = {
          particles: {
            color: {
              value: options.particles?.color?.value ?? "#ffffff",
            },
            number: {
              value: options.particles?.number?.value ?? 50,
              density: {
                enable: options.particles?.number?.density?.enable ?? true,
                area: options.particles?.number?.density?.area ?? 800
              }
            },
            opacity: {
              value: options.particles?.opacity?.value ?? 0.5
            },
            size: {
              value: options.particles?.size?.value ?? { min: 1, max: 3 }
            },
            move: {
              enable: options.particles?.move?.enable ?? true,
              speed: options.particles?.move?.speed ?? 1
            }
          }
        };

        containerRef.current = await engineRef.current.load(containerId, particlesConfig);
      } catch (error) {
        console.error("Error initializing particles:", error);
      }
    };

    initParticles();

    return () => {
      containerRef.current?.destroy();
    };
  }, [containerId, options]);

  return engineRef.current;
}