import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '../../lib/queryClient';

const PortfolioView = () => {
  const { id } = useParams();

  // Fetch portfolio data
  const { data: portfolio, isLoading, error } = useQuery({
    queryKey: [`/api/portfolios/${id}`],
    queryFn: getQueryFn(),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Portfolio Not Found</h2>
          <p className="text-gray-600">This portfolio doesn&apos;t exist or is not published.</p>
        </div>
      </div>
    );
  }

  // If the portfolio is not published and the viewer is not the owner, show error
  if (!portfolio.isPublished) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Private Portfolio</h2>
          <p className="text-gray-600">This portfolio is not currently published.</p>
        </div>
      </div>
    );
  }

  const renderComponent = (component) => {
    switch (component.type) {
      case 'text':
        return (
          <div
            key={component.id}
            style={{
              ...component.content.style,
              position: 'absolute',
              left: `${component.position.x}px`,
              top: `${component.position.y}px`,
            }}
          >
            {component.content.text}
          </div>
        );

      case 'image':
        return (
          <img
            key={component.id}
            src={component.content.src}
            alt={component.content.alt}
            style={{
              ...component.content.style,
              position: 'absolute',
              left: `${component.position.x}px`,
              top: `${component.position.y}px`,
            }}
          />
        );

      case 'button':
        return (
          <button
            key={component.id}
            style={{
              ...component.content.style,
              position: 'absolute',
              left: `${component.position.x}px`,
              top: `${component.position.y}px`,
            }}
          >
            {component.content.text}
          </button>
        );

      case 'video':
        return (
          <video
            key={component.id}
            src={component.content.src}
            controls={component.content.controls}
            style={{
              ...component.content.style,
              position: 'absolute',
              left: `${component.position.x}px`,
              top: `${component.position.y}px`,
            }}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Portfolio Header */}
      <header className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {portfolio.title}
          </h1>
        </div>
      </header>

      {/* Portfolio Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          className="relative bg-white rounded-lg shadow-sm"
          style={{
            minHeight: '600px',
            ...portfolio.settings?.style
          }}
        >
          {portfolio.content.components?.map(renderComponent)}
        </div>
      </main>
    </div>
  );
};

export default PortfolioView;
