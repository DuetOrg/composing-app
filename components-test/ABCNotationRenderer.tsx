// components/ABCNotationRenderer.tsx
import React, { useEffect, useRef } from 'react';
import abcjs from 'abcjs';

interface ABCNotationRendererProps {
  abcNotation: string;
}

const ABCNotationRenderer: React.FC<ABCNotationRendererProps> = ({ abcNotation }) => {
  const abcContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (abcContainerRef.current) {
      abcjs.renderAbc(abcContainerRef.current, abcNotation);
    }
  }, [abcNotation]);

  return (
    <div
      ref={abcContainerRef}
      className="w-full h-full bg-gray-100 p-6 overflow-auto" // Full width and height with padding
      style={{ minHeight: '716px', maxWidth: '100vw' }} // Ensures it spans across the full width of the viewport
    ></div>
  );
};

export default ABCNotationRenderer;
