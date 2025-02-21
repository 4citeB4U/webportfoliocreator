import DraggableComponent from './DraggableComponent';

export const DEFAULT_COMPONENTS = [
  {
    id: 'text-block',
    type: 'text',
    label: 'Text Block',
    defaultContent: {
      text: 'Double click to edit text',
      style: {
        fontSize: '16px',
        color: '#333333'
      }
    },
    preview: (
      <div className="p-4 bg-white shadow rounded">
        <p className="text-gray-600">Text Block</p>
      </div>
    )
  },
  {
    id: 'image-block',
    type: 'image',
    label: 'Image',
    defaultContent: {
      src: '/placeholder-image.jpg',
      alt: 'Image placeholder',
      style: {
        width: '300px',
        height: 'auto'
      }
    },
    preview: (
      <div className="p-4 bg-white shadow rounded">
        <div className="w-full h-24 bg-gray-200 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
    )
  },
  {
    id: 'button-block',
    type: 'button',
    label: 'Button',
    defaultContent: {
      text: 'Click Me',
      style: {
        padding: '10px 20px',
        backgroundColor: '#2196f3',
        color: 'white',
        border: 'none',
        borderRadius: '4px'
      }
    },
    preview: (
      <div className="p-4 bg-white shadow rounded">
        <button className="px-4 py-2 bg-blue-500 text-white rounded">
          Button
        </button>
      </div>
    )
  },
  {
    id: 'video-block',
    type: 'video',
    label: 'Video Player',
    defaultContent: {
      src: '',
      controls: true,
      style: {
        width: '400px',
        height: '225px'
      }
    },
    preview: (
      <div className="p-4 bg-white shadow rounded">
        <div className="w-full h-24 bg-gray-200 flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    )
  }
];

const ComponentLibrary = ({
  components = [],
  onDragStart,
  onDragEnd
}) => {
  const allComponents = [...DEFAULT_COMPONENTS, ...components];

  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Components</h3>
      <div className="space-y-4">
        {allComponents.map((component) => (
          <DraggableComponent
            key={component.id}
            id={component.id}
            type={component.type}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          >
            <div className="cursor-grab hover:bg-gray-50 transition-colors duration-150">
              <div className="mb-1 text-sm text-gray-600">{component.label}</div>
              {component.preview}
            </div>
          </DraggableComponent>
        ))}
      </div>
    </div>
  );
};

export default ComponentLibrary;
