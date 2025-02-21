/// <reference types="vite/client" />
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Development environment setup
const isDev = import.meta.env.DEV;

// Error tracking setup
if (isDev) {
  window.onerror = (message, source, lineno, colno, error) => {
    console.error('Global error:', { message, source, lineno, colno, error });
    return false;
  };

  window.onunhandledrejection = (event) => {
    console.error('Unhandled promise rejection:', event.reason);
  };
}

// Initialize application
const initApp = () => {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    throw new Error('Failed to find root element');
  }

  // Remove loading screen if it exists
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.remove();
    }, 500);
  }

  // Create and render root
  try {
    const root = createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Failed to render application:', error);
    // Show error UI
    rootElement.innerHTML = `
      <div class="fixed inset-0 z-50 bg-dark-bg flex items-center justify-center">
        <div class="glassmorphism p-8 max-w-lg mx-4 text-center">
          <h2 class="text-2xl font-bold mb-4 text-secondary-neon">Application Error</h2>
          <p class="mb-4">Failed to initialize Agent Lee. Please refresh the page.</p>
          <button onclick="window.location.reload()" class="btn-neon">
            Reload Application
          </button>
        </div>
      </div>
    `;
  }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

// Enable HMR in development
if (isDev && import.meta.hot) {
  import.meta.hot.accept();
}
