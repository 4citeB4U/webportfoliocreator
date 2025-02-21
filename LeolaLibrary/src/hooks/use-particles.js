import { useEffect, useRef } from 'react';
import { loadSlim } from '@tsparticles/slim';
import { tsParticles } from "@tsparticles/engine";

export const useParticles = (
  containerRef: React.RefObject<HTMLElement>,
  options: any
) => {
  useEffect(() => {
    if (!containerRef.current) return;

    const initParticles = async () => {
      try {
        await loadSlim(tsParticles);

        await tsParticles.load(containerRef.current.id, {
          particles: {
            color: {
              value: options.particles?.color?.value || "#ffffff",
            },
            number: {
              value: options.particles?.number?.value || 50,
              density: {
                enable: true,
                area: 800
              }
            },
            opacity: {
              value: options.particles?.opacity?.value || 0.5
            },
            size: {
              value: options.particles?.size?.value || { min: 1, max: 3 }
            },
            move: {
              enable: true,
              speed: options.particles?.move?.speed || 1
            }
          }
        });
      } catch (error) {
        console.error("Error initializing particles:", error);
      }
    };

    initParticles();

    return () => {
      tsParticles.destroy(containerRef.current?.id);
    };
  }, [containerRef, options]);
};