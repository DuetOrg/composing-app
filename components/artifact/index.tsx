"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CheckIcon, ClipboardIcon, XIcon } from "lucide-react";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import ABCNotationRenderer from "@/components-test/ABCNotationRenderer";
import { CodeBlock } from "@/components/markdown/code-block";
import Markdown from "@/components/markdown/markdown";

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

export const ArtifactPanel = ({
  type,
  title,
  language,
  content,
  onClose,
  recording,
  onCapture,
  generating = false, // Set a default value
}: ArtifactPanelProps) => {
  const [mode, setMode] = useState<"code" | "preview">("preview");
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });

  const onCopy = () => {
    if (isCopied) return;
    copyToClipboard(content);
  };

  return (
    <Card className="w-full border-none rounded-none flex flex-col h-full max-h-full">
      <CardHeader className="bg-slate-50 rounded-lg border rounded-b-none py-2 px-4 flex flex-row items-center gap-4 justify-between space-y-0">
        <span className="font-semibold">{title || "Generating..."}</span>
        <div className="flex gap-2 items-center">
          {/* Adjusted the condition here */}
          {type === 'application/abc' && !generating && (
            <Tabs
              value={mode}
              onValueChange={(value) => setMode(value as "code" | "preview")}
            >
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

      <CardContent className="border-l border-r p-4 w-full flex-1 max-h-full overflow-hidden relative">
        {type === "application/abc" && mode === "preview" && (
          <div className="w-full h-full">
            <CodeBlock
              language="abc"
              value={content}
              showHeader={true}
              className="w-full h-full max-w-full overflow-auto"
            />
          </div>
        )}
        {type === "application/abc" && mode === "code" && (
          <div className="w-full h-full flex justify-center items-center p-4 bg-gray-100 rounded-lg">
            <CodeBlock
              language="abc"
              value={content}
              showHeader={true}
              className="w-full h-full max-w-full overflow-auto"
            />
          </div>
        )}
        {type === "text/markdown" && (
          <Markdown
            text={content}
            className="h-full max-h-full overflow-auto py-4 px-4"
          />
        )}
        {type === "application/code" && language && (
          <div className="w-full h-full flex justify-center items-center p-4 bg-gray-100 rounded-lg">
            <CodeBlock
              language={language}
              value={content}
              showHeader={true}
              className="w-full h-full max-w-full overflow-auto"
            />
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-slate-50 border rounded-lg rounded-t-none py-2 px-4 flex items-center flex-row-reverse gap-4">
        <Button onClick={onCopy} size="icon" variant="outline" className="w-8 h-8">
          {isCopied ? (
            <CheckIcon className="w-4 h-4" />
          ) : (
            <ClipboardIcon className="w-4 h-4" />
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ArtifactPanel;
