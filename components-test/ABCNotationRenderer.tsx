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

  return <div ref={abcContainerRef} className="w-full h-full p-4 m-"></div>; // Add padding for a bit of extra space
};

export default ABCNotationRenderer;
