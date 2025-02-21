import * as React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined,
      errorInfo: undefined
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error);
    console.error('Error info:', errorInfo);

    this.setState({
      error,
      errorInfo
    });

    // Show the error boundary UI
    const errorElement = document.getElementById('error-boundary');
    if (errorElement) {
      errorElement.classList.remove('hidden');
    }
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    const { hasError, error, errorInfo } = this.state;
    const { children } = this.props;

    if (hasError) {
      return (
        <div className="fixed inset-0 z-50 bg-dark-overlay backdrop-blur-sm flex items-center justify-center">
          <div className="glassmorphism p-8 max-w-lg mx-4 text-center">
            <h2 className="text-2xl font-bold mb-4 text-secondary-neon">System Error</h2>
            <p className="mb-4">
              {error?.message || 'An unexpected error has occurred.'}
            </p>
            <button
              onClick={this.handleReload}
              className="btn-neon px-6 py-2 rounded-full bg-primary-neon/20 hover:bg-primary-neon/30 transition-all"
            >
              Reload Application
            </button>
            {process.env.NODE_ENV === 'development' && errorInfo && (
              <details className="mt-4 text-left">
                <summary className="cursor-pointer text-primary-neon/70">
                  Error Details
                </summary>
                <pre className="mt-2 p-4 bg-dark-bg/50 rounded overflow-x-auto text-xs">
                  {errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return children;
  }
}

// Make the ErrorBoundary available globally for development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.ErrorBoundary = ErrorBoundary;
}

export default ErrorBoundary;
