import React, { useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui";
import SyntaxHighlighter from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import abcjs from "abcjs"; // Assumes abcjs is installed

// Component for rendering ABC Notation
const ABCNotationRenderer = ({ abcNotation }: { abcNotation: string }) => {
  const abcContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (abcContainerRef.current) {
      abcjs.renderAbc(abcContainerRef.current, abcNotation);
    }
  }, [abcNotation]);

  return <div ref={abcContainerRef}></div>;
};

const SideBySideView = ({ code, notation }: { code: string; notation: string }) => {
  return (
    <Dialog open>
      <DialogContent className="flex flex-row w-full max-w-4xl">
        {/* Left Column: Code */}
        <div className="w-1/2 p-4 border-r border-gray-300">
          <SyntaxHighlighter language="javascript" style={oneDark}>
            {code}
          </SyntaxHighlighter>
        </div>

        {/* Right Column: ABC Notation */}
        <div className="w-1/2 p-4">
          <h3 className="text-lg font-bold mb-4">ABC Notation</h3>
          <ABCNotationRenderer abcNotation={notation} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SideBySideView;
