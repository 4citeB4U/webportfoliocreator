import React, { Suspense } from 'react';
import ErrorBoundary from './ErrorBoundary';
import DigitalLoadingScreen from './DigitalLoadingScreen';

const LoadingFallback = () => (
  <div className="fixed inset-0 z-50 bg-dark-bg flex items-center justify-center">
    <div className="text-center">
      <div className="text-4xl font-bold animate-pulse mb-4 text-primary-neon">
        LOADING
      </div>
      <div className="text-xl animate-pulse text-secondary-neon">
        AGENT LEE
      </div>
    </div>
  </div>
);

const App = ({ className = '' }) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <div className={`min-h-screen bg-dark-bg ${className}`}>
          <DigitalLoadingScreen />
        </div>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
