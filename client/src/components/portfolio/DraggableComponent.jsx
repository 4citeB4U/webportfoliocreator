const DraggableComponent = ({
  id,
  type,
  children,
  position,
  onDragStart,
  onDragEnd,
  style = {},
  className = ''
}) => {
  const handleDragStart = () => {
    // Attach the component data to the drag event
    const data = {
      id,
      type,
      position
    };

    // Call the parent's drag start handler if provided
    onDragStart?.(id, type, data);
  };

  // Handle drag end event
  const handleDragEnd = () => {
    onDragEnd?.();
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{
        position: position ? 'absolute' : 'relative',
        left: position?.x,
        top: position?.y,
        cursor: 'move',
        ...style
      }}
      className={`portfolio-component ${className}`.trim()}
    >
      {children}
    </div>
  );
};

export default DraggableComponent;
