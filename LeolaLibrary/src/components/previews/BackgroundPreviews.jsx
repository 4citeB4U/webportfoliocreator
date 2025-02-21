import { FC } from 'react';

export const ParticleBackgroundPreview: FC = () => (
  <svg className="w-full h-40" viewBox="0 0 800 400">
    {/* Background */}
    <rect width="800" height="400" fill="#000000"/>

    {/* Orbital Paths */}
    <ellipse cx="200" cy="200" rx="50" ry="50" fill="none" stroke="#3AF8FF" strokeWidth="1" opacity="0.2">
      <animate attributeName="opacity" values="0.2;0.4;0.2" dur="3s" repeatCount="indefinite"/>
    </ellipse>

    <ellipse cx="400" cy="150" rx="70" ry="70" fill="none" stroke="#FF00FF" strokeWidth="1" opacity="0.2">
      <animate attributeName="opacity" values="0.2;0.4;0.2" dur="4s" repeatCount="indefinite"/>
    </ellipse>

    {/* Attraction Points */}
    <circle cx="200" cy="200" r="4" fill="#3AF8FF">
      <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite"/>
    </circle>

    <circle cx="400" cy="150" r="4" fill="#FF00FF">
      <animate attributeName="r" values="4;6;4" dur="2.5s" repeatCount="indefinite"/>
    </circle>

    {/* Orbiting Particles */}
    <circle cx="200" cy="150" r="2" fill="#3AF8FF">
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 200 200"
        to="360 200 200"
        dur="3s"
        repeatCount="indefinite"/>
    </circle>

    <circle cx="400" cy="80" r="2" fill="#FF00FF">
      <animateTransform
        attributeName="transform"
        type="rotate"
        from="0 400 150"
        to="360 400 150"
        dur="4s"
        repeatCount="indefinite"/>
    </circle>
  </svg>
);

export const CrystallineBackgroundPreview: FC = () => (
  <svg className="w-full h-40" viewBox="0 0 800 400">
    {/* Background */}
    <rect width="800" height="400" fill="#000022"/>

    {/* Crystal Pattern Underlay */}
    <path d="M100,100 L150,50 L200,100 L150,150 Z" fill="none" stroke="#00FFFF" strokeWidth="1" opacity="0.1">
      <animate attributeName="opacity" values="0.1;0.3;0.1" dur="3s" repeatCount="indefinite"/>
    </path>

    {/* Crystal Nodes */}
    <circle cx="150" cy="50" r="4" fill="#00FFFF">
      <animate attributeName="r" values="2;4;2" dur="1s" repeatCount="indefinite"/>
    </circle>
    <circle cx="150" cy="50" r="8" fill="none" stroke="#00FFFF" strokeWidth="1">
      <animate attributeName="r" values="4;8;4" dur="1s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.5;0;0.5" dur="1s" repeatCount="indefinite"/>
    </circle>

    {/* Crystal Growth Lines */}
    <line x1="150" y1="50" x2="150" y2="150" stroke="#88FFFF" strokeWidth="1">
      <animate attributeName="y2" values="50;150;50" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.2;0.8;0.2" dur="2s" repeatCount="indefinite"/>
    </line>
  </svg>
);