import { useEffect } from 'react';

declare global {
  interface Window {
    particlesJS: any;
    pJSDom: any[];
  }
}

export default function ParticleBackground() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/particles.js/2.0.0/particles.min.js';
    script.async = true;

    script.onload = () => {
      window.particlesJS('particles-js', {
        particles: {
          number: {
            value: 80,
            density: {
              enable: true,
              value_area: 800
            }
          },
          color: {
            value: "#ffffff"
          },
          shape: {
            type: "circle"
          },
          opacity: {
            value: 0.9,
            random: false,
            anim: {
              enable: true,
              speed: 0.5,
              opacity_min: 0.7,
              sync: false
            }
          },
          size: {
            value: 2,
            random: true,
            anim: {
              enable: true,
              speed: 1,
              size_min: 1,
              sync: false
            }
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.7,
            width: 1
          },
          move: {
            enable: true,
            speed: 4,
            direction: "none",
            random: false,
            straight: false,
            out_mode: "bounce",
            attract: {
              enable: true,
              rotateX: 600,
              rotateY: 1200
            }
          }
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: {
              enable: true,
              mode: "grab"
            },
            onclick: {
              enable: true,
              mode: "repulse"
            },
            resize: true
          },
          modes: {
            grab: {
              distance: 200,
              line_linked: {
                opacity: 0.8
              }
            },
            repulse: {
              distance: 200,
              duration: 0.4
            }
          }
        },
        retina_detect: true
      });
    };

    document.body.appendChild(script);

    return () => {
      const scriptElement = document.querySelector(`script[src="${script.src}"]`);
      if (scriptElement) {
        document.body.removeChild(scriptElement);
      }
    };
  }, []);

  return <div id="particles-js" className="fixed inset-0 z-0" />;
}