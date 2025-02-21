import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'wouter';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '../../hooks/use-toast';
import DraggableComponent from '../../components/portfolio/DraggableComponent';
import DroppableArea from '../../components/portfolio/DroppableArea';
import ComponentLibrary, { DEFAULT_COMPONENTS } from '../../components/portfolio/ComponentLibrary';
import QRCodeDisplay from '../../components/QRCodeDisplay';
import { getQueryFn, apiRequest } from '../../lib/queryClient';

const PortfolioEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [components, setComponents] = useState([]);
  const [isDirty, setIsDirty] = useState(false);

  // Fetch portfolio data if editing existing
  const { data: portfolio, isLoading } = useQuery({
    queryKey: [`/api/portfolios/${id}`],
    queryFn: getQueryFn(),
    enabled: !!id,
  });

  // Load portfolio data when available
  useEffect(() => {
    if (portfolio?.content?.components) {
      setComponents(portfolio.content.components);
    }
  }, [portfolio]);

// Handle publish state
  const [isPublished, setIsPublished] = useState(portfolio?.isPublished || false);

  // Initialize published state from portfolio data
  useEffect(() => {
    if (portfolio?.isPublished !== undefined) {
      setIsPublished(portfolio.isPublished);
    }
  }, [portfolio?.isPublished]);

  // Save mutation
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const endpoint = id ? `/api/portfolios/${id}` : '/api/portfolios';
      const method = id ? 'PUT' : 'POST';

      const response = await apiRequest(method, endpoint, {
        title: data.title || 'Untitled Portfolio',
        content: {
          components: data.components
        },
        settings: data.settings || {},
        isPublished: data.isPublished
      });

      return response.json();
    },
    onSuccess: (data) => {
      setIsDirty(false);
      setIsPublished(data.isPublished);
      toast({
        title: 'Success',
        description: 'Portfolio saved successfully',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save portfolio',
        variant: 'destructive',
      });
    }
  });

  // Handle component drop
  const handleDrop = (dropData) => {
    const { id: componentId, type, targetPosition } = dropData;

    // Find component template from ComponentLibrary
    const componentTemplate = DEFAULT_COMPONENTS.find(c => c.id === componentId);
    if (!componentTemplate) return;

    // Create new component instance
    const newComponent = {
      id: `${componentId}-${Date.now()}`, // Unique ID
      type,
      content: componentTemplate.defaultContent,
      position: targetPosition
    };

    setComponents(prev => [...prev, newComponent]);
    setIsDirty(true);
  };

  // Handle component position update
  const handleComponentMove = (componentId, newPosition) => {
    setComponents(prev =>
      prev.map(component =>
        component.id === componentId
          ? { ...component, position: newPosition }
          : component
      )
    );
    setIsDirty(true);
  };

  // Handle start dragging
  const handleDragStart = (_componentId, _type) => {
    // Optional: Add visual feedback or state updates
  };

  // Handle end dragging
  const handleDragEnd = () => {
    // Optional: Clean up any drag state
  };

  // Handle save
  const handleSave = async () => {
    await saveMutation.mutateAsync({
      title: portfolio?.title || 'Untitled Portfolio',
      components,
      settings: portfolio?.settings || {}
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Component Library Sidebar */}
      <ComponentLibrary
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      />

      {/* Main Editor Area */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mb-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {portfolio?.title || 'New Portfolio'}
          </h1>
          <div className="flex items-center space-x-4 bg-white p-2 rounded shadow-sm">
            {id && (
              <div className="flex items-center space-x-2">
                <QRCodeDisplay url={window.location.origin + `/portfolio/${id}`} size={96} />
                <a
                  href={`/portfolio/${id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                >
                  Preview
                </a>
              </div>
            )}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  setIsPublished(!isPublished);
                  await saveMutation.mutateAsync({
                    title: portfolio?.title || 'Untitled Portfolio',
                    components,
                    settings: portfolio?.settings || {},
                    isPublished: !isPublished
                  });
                }}
                className={`px-4 py-2 rounded ${
                  isPublished
                    ? 'bg-gray-500 hover:bg-gray-600'
                    : 'bg-green-500 hover:bg-green-600'
                } text-white`}
              >
                {isPublished ? 'Unpublish' : 'Publish'}
              </button>
            </div>
            <button
              onClick={handleSave}
              disabled={!isDirty || saveMutation.isPending}
              className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {saveMutation.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Droppable Canvas Area */}
        <DroppableArea
          onDrop={handleDrop}
          style={{
            minHeight: '600px',
            margin: '0 auto',
            maxWidth: '1200px',
          }}
        >
          {components.map((component) => (
            <DraggableComponent
              key={component.id}
              id={component.id}
              type={component.type}
              position={component.position}
              onDragEnd={(_, newPosition) => handleComponentMove(component.id, newPosition)}
            >
              {/* Render component based on type */}
              {component.type === 'text' && (
                <div
                  style={component.content.style}
                  contentEditable
                  suppressContentEditableWarning
                  onBlur={(e) => {
                    const newText = e.target.innerText;
                    setComponents(prev =>
                      prev.map(c =>
                        c.id === component.id
                          ? { ...c, content: { ...c.content, text: newText } }
                          : c
                      )
                    );
                    setIsDirty(true);
                  }}
                >
                  {component.content.text}
                </div>
              )}
              {component.type === 'image' && (
                <img
                  src={component.content.src}
                  alt={component.content.alt}
                  style={component.content.style}
                />
              )}
              {component.type === 'button' && (
                <button style={component.content.style}>
                  {component.content.text}
                </button>
              )}
              {component.type === 'video' && (
                <video
                  src={component.content.src}
                  controls={component.content.controls}
                  style={component.content.style}
                />
              )}
            </DraggableComponent>
          ))}
        </DroppableArea>
      </div>
    </div>
  );
};

export default PortfolioEditor;
