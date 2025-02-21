import React from 'react';

interface BookEnhancerProps {
  children: React.ReactNode;
}

export const BookEnhancer: React.FC<BookEnhancerProps> = ({ children }) => {
  return (
    <div className="book-enhancer">
      <div className="book-content">
        {children}
      </div>
    </div>
  );
};