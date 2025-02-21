/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    "./client/src/**/*.{js,jsx}",
    "./src/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        'primary-neon': 'var(--primary-neon)',
        'secondary-neon': 'var(--secondary-neon)',
        'accent-green': 'var(--accent-green)',
        'dark-bg': 'var(--dark-bg)',
        'card-bg': 'var(--card-bg)',
      },
      fontFamily: {
        mono: ['Courier New', 'monospace'],
      },
      animation: {
        'matrix-fall': 'matrixFall 20s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'pulse': 'pulse 2s infinite',
      },
      backdropBlur: {
        'lg': '10px',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
