import { useState } from 'react';

/**
 * A component that accepts draggable items and manages their layout
 * @param {Object} props
 * @param {ReactNode} props.children - The draggable components
 * @param {function} props.onDrop - Callback when a component is dropped
 * @param {Object} props.style - Additional styles to apply to the drop area
 * @param {string} props.className - Additional CSS classes
 */
const DroppableArea = ({
  children,
  onDrop,
  style = {},
  className = ''
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (event) => {
    // Prevent default to allow drop
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';

    if (!isDragOver) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);

    try {
      // Get the component data from the drag event
      const data = JSON.parse(event.dataTransfer.getData('application/json'));

      // Calculate drop position relative to the droppable area
      const rect = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };

      // Call the onDrop callback with the drop data and position
      onDrop?.({
        ...data,
        targetPosition: position
      });
    } catch (error) {
      console.error('Failed to process drop:', error);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        position: 'relative',
        minHeight: '400px',
        background: '#f5f5f5',
        border: `2px dashed ${isDragOver ? '#2196f3' : '#ccc'}`,
        transition: 'border-color 0.2s ease',
        ...style
      }}
      className={`portfolio-droppable ${isDragOver ? 'drag-over' : ''} ${className}`.trim()}
    >
      {children}
      {isDragOver && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(33, 150, 243, 0.1)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />
      )}
    </div>
  );
};

export default DroppableArea;
