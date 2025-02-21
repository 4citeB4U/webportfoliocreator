
/**
 * @fileoverview Particle background effect component using tsParticles
 * @module RWDParticles
 */

import { useCallback } from "react";
import { Particles } from "@tsparticles/react";
import type { Engine } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";

/**
 * RWDParticles Component
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.className] - Optional CSS class name
 * @returns {JSX.Element} Particle background component
 */

export function RWDParticles({ className = "" }: { className?: string }) {
  const particlesInit = useCallback(async (engine: Engine) => {
    try {
      await loadSlim(engine);
    } catch (error) {
      console.error("Failed to initialize particles:", error);
    }
  }, []);

  return (
    <Particles
      id="tsparticles"
      className={className}
      init={particlesInit}
      options={{
        fullScreen: false,
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onClick: { enable: false },
            onHover: { enable: false },
          },
        },
        particles: {
          color: {
            value: "#646464",
          },
          links: {
            color: "#646464",
            distance: 150,
            enable: true,
            opacity: 0.5,
            width: 1,
          },
          move: {
            direction: "none",
            enable: true,
            outModes: {
              default: "bounce",
            },
            random: false,
            speed: 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: 80,
          },
          opacity: {
            value: 0.5,
          },
          shape: {
            type: "circle",
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        detectRetina: true,
      }}
    />
  );
}
