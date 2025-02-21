import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': join(__dirname, './src'),
      '@components': join(__dirname, './src/components'),
      '@assets': join(__dirname, './src/assets')
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: process.env.NODE_ENV === 'development',
    rollupOptions: {
      input: {
        main: join(__dirname, 'index.html'),
        'agent-lee': join(__dirname, 'src/agent-lee/index.html'),
        'landing-page': join(__dirname, 'src/landing-page/index.html'),
        prodriver: join(__dirname, 'src/prodriver/index.html'),
        leola: join(__dirname, 'src/leola/index.html'),
        dashboard: join(__dirname, 'src/dashboard/index.html')
      }
    }
  },
  server: {
    port: 3000,
    open: true,
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  preview: {
    port: 4000,
    open: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
});
