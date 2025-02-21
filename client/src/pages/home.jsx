import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/use-auth';
import { getQueryFn } from '../lib/queryClient';

const Home = () => {
  const { user } = useAuth();
  const { data: portfolios, isLoading } = useQuery({
    queryKey: ['/api/portfolios'],
    queryFn: getQueryFn(),
    enabled: !!user,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to Portfolio Builder</h1>
          <p className="text-lg text-gray-600 mb-8">Create and manage your professional portfolios</p>
          <Link href="/auth">
            <a className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Sign In to Get Started
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Portfolios</h1>
          <Link href="/portfolio/editor">
            <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
              Create New Portfolio
            </a>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : portfolios?.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No portfolios</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new portfolio.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {portfolios?.map((portfolio) => (
              <div
                key={portfolio.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    {portfolio.title || "Untitled Portfolio"}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Last updated: {new Date(portfolio.updatedAt).toLocaleDateString()}
                  </p>
                  <div className="flex space-x-4">
                    <Link href={`/portfolio/editor/${portfolio.id}`}>
                      <a className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Edit
                      </a>
                    </Link>
                    <Link href={`/portfolio/${portfolio.id}`}>
                      <a className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                        View
                      </a>
                    </Link>
                    <div className="flex-1"></div>
                    <span className={`text-sm ${portfolio.isPublished ? 'text-green-600' : 'text-gray-500'}`}>
                      {portfolio.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
