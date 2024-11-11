// components/ArtifactPanel.tsx
"use client";

import { ReactArtifact } from "@/components/artifact/react";
import { CodeBlock } from "@/components/markdown/code-block";
import Markdown from "@/components/markdown/markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useCopyToClipboard } from "@/lib/hooks/use-copy-to-clipboard";
import { ArtifactMessagePartData } from "@/lib/utils";
import { CheckIcon, ClipboardIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { Props as ReactArtifactProps } from "@/components/artifact/react";
import { HTMLArtifact } from "@/components/artifact/html";
import ABCNotationRenderer from "@/components-test/ABCNotationRenderer";

type Props = {
  onClose: () => void;
  recording: boolean;
  onCapture: ReactArtifactProps["onCapture"];
} & ArtifactMessagePartData;

export type ArtifactMode = "code" | "preview";

export const ArtifactPanel = ({
  type,
  title,
  language,
  content,
  onClose,
  recording,
  onCapture,
  generating,
}: Props) => {
  const [mode, setMode] = useState<ArtifactMode>("preview");

  const { isCopied, copyToClipboard } = useCopyToClipboard({
    timeout: 2000,
  });

  const onCopy = () => {
    if (isCopied) return;
    copyToClipboard(content);
  };

  return (
    <Card className="w-full border-none rounded-none flex flex-col h-full max-h-full">
      <CardHeader className="bg-slate-50 rounded-lg border rounded-b-none py-2 px-6 flex flex-row items-center gap-4 justify-between space-y-0">
        <span className="font-semibold text-xl">{title || "Generating..."}</span>

        <div className="flex gap-2 items-center">
          <Tabs value={mode} onValueChange={(value) => setMode(value as ArtifactMode)}>
            <TabsList className="bg-slate-200">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="code">Code</TabsTrigger>
            </TabsList>
          </Tabs>

          <Button onClick={onClose} size="icon" variant="ghost">
            <XIcon className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent
        id="artifact-content"
        className="border-l border-r p-4 w-full flex-1 max-h-full overflow-hidden relative"
      >
        <Tabs value={mode} onValueChange={(value) => setMode(value as ArtifactMode)}>
          <TabsContent value="preview">
            <div className="w-full h-full flex justify-center items-center p-6 bg-gray-100 rounded-lg">
              <div className="max-w-3xl w-full">
                <ABCNotationRenderer abcNotation={content} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="code">
            <div className="w-full h-full flex justify-center items-center p-6 bg-gray-100 rounded-lg">
              <div className="max-w-3xl w-full">
                <CodeBlock
                  language="abc"
                  value={content}
                  showHeader={true}
                  className="overflow-auto"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="bg-slate-50 border rounded-lg rounded-t-none py-2 px-6 flex items-center flex-row-reverse gap-4">
        <Button onClick={onCopy} size="icon" variant="outline" className="w-8 h-8">
          {isCopied ? <CheckIcon className="w-4 h-4" /> : <ClipboardIcon className="w-4 h-4" />}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ArtifactPanel;
