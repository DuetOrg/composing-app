import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CheckIcon, ClipboardIcon, XIcon } from 'lucide-react';
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard';
import ABCNotationRenderer from '@/components-test/ABCNotationRenderer';
import { CodeBlock } from '@/components/markdown/code-block';

interface ArtifactPanelProps {
  type: string;
  title: string;
  language?: string;
  content: string;
  onClose: () => void;
  recording: boolean;
  onCapture: (params: { selectionImg: string; artifactImg: string }) => void;
  generating?: boolean;
}

const ArtifactPanel: React.FC<ArtifactPanelProps> = ({
  type,
  title,
  language,
  content,
  onClose,
  recording,
  onCapture,
  generating,
}) => {
  const [mode, setMode] = useState<'code' | 'preview'>('preview');
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });
  const contentRef = useRef<HTMLDivElement>(null);

  const onCopy = () => {
    if (!isCopied) {
      copyToClipboard(content);
    }
  };

  const renderContent = () => {
    if (type === 'application/abc') {
      if (mode === 'preview') {
        return (
          <div className="relative w-full h-full overflow-y-auto">
            <div className="flex justify-center items-start p-4">
              <div className="max-w-fit transform scale-90 origin-top">
                <ABCNotationRenderer abcNotation={content} />
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div ref={contentRef} className="h-full overflow-y-auto p-4 bg-gray-100 rounded-lg">
            <CodeBlock
              language="abc"
              value={content}
              showHeader={true}
              className="w-full h-full"
            />
          </div>
        );
      }
    }

    // Additional content types can be handled here...
    return null;
  };

  return (
    <Card
      className="w-full h-full max-h-[70vh] border-none rounded-none flex flex-col"
      style={{
        maxHeight: 'calc(100vh - 20px)', // Dynamic height responsive to viewport
      }}
    >
      <CardHeader className="bg-slate-50 rounded-lg border-b py-2 px-4 flex items-center justify-between">
        <span className="font-semibold">{title || 'Generating...'}</span>
        <div className="flex gap-2 items-center">
          {type === 'application/abc' && !generating && (
            <Tabs value={mode} onValueChange={(value) => setMode(value as 'code' | 'preview')}>
              <TabsList className="bg-slate-200">
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>
            </Tabs>
          )}
          <Button onClick={onClose} size="icon" variant="ghost">
            <XIcon className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow overflow-hidden p-0">{renderContent()}</CardContent>
      
      <CardFooter className="bg-slate-50 border-t py-2 px-4 flex items-center flex-row-reverse gap-4">
        <Button onClick={onCopy} size="icon" variant="outline">
          {isCopied ? <CheckIcon className="w-4 h-4" /> : <ClipboardIcon className="w-4 h-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ArtifactPanel;
