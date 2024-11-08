// components/ChatInput.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CircleStopIcon,
  MicIcon,
  PaperclipIcon,
  PauseIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Textarea from "react-textarea-autosize";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AttachmentPreviewButton } from "@/components/chat/attachment-preview-button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui";

type Attachment = {
  url: string;
  name: string;
  contentType: string;
};

type ChatInputProps = {
  onSubmit: (message: string) => void;
};

export const ChatInput = ({ onSubmit }: ChatInputProps) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [model, setModel] = useState("Duet");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newAttachments = filesArray.map((file) => ({
        url: URL.createObjectURL(file),
        name: file.name,
        contentType: file.type,
      }));
      setAttachments((prevAttachments) => [...prevAttachments, ...newAttachments]);
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleModelChange = (newModel: string) => {
    setModel(newModel);
  };

  const handleSubmit = () => {
    if (input.trim()) {
      onSubmit(input);  // Call parent onSubmit function with the input message
      setInput("");
      setIsLoading(true);

      setTimeout(() => setIsLoading(false), 1000);  // Simulated loading delay
    }
  };

  return (
    <div className="sticky bottom-0 mx-auto w-full pt-6 flex flex-col gap-4 items-center">
      {showScrollButton && (
        <Button
          onClick={() => window.scrollTo(0, document.body.scrollHeight)}
          variant="outline"
          size="icon"
          className="rounded-full shadow-lg w-8 h-8 absolute right-4 bottom-20" // Moves the scroll button to the right
        >
          <ArrowDownIcon className="h-4 w-4" />
        </Button>
      )}

      <div className="w-full flex flex-col gap-1 bg-[#F4F4F4] p-2.5 pl-4 rounded-2xl border border-b-0 rounded-b-none shadow-md">
        {/* Attachment preview */}
        {attachments.length > 0 && (
          <div className="flex items-center gap-2 mb-2">
            {attachments.map((attachment, index) => (
              <AttachmentPreviewButton
                key={index}
                value={attachment}
                onRemove={(attachmentToRemove) =>
                  setAttachments((prev) =>
                    prev.filter((att) => att !== attachmentToRemove)
                  )
                }
              />
            ))}
          </div>
        )}

        <div className="flex gap-2 items-start">
          {/* Main input textarea */}
          <Textarea
            ref={inputRef}
            placeholder="Message Duet"
            className="min-h-15 max-h-96 overflow-auto w-full bg-transparent border-none resize-none focus-within:outline-none"
            autoFocus
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            name="message"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSubmit())}
          />

          {/* Hidden file input */}
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
          />

          {/* File upload button */}
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-8 bg-transparent rounded-2xl"
            onClick={handleFileUpload}
          >
            <PaperclipIcon className="w-4 h-4" />
          </Button>

          {/* Voice recording button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => setRecording(!recording)}
                  size="icon"
                  variant="outline"
                  className="w-10 h-8 bg-transparent rounded-2xl"
                >
                  {recording ? <PauseIcon className="w-4 h-4" /> : <MicIcon className="w-4 h-4" />}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{recording ? "Recording..." : "Click to record"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Submit button */}
          <Button
            onClick={isLoading ? () => setIsLoading(false) : handleSubmit}
            size="icon"
            className="w-10 h-8 rounded-2xl"
          >
            {isLoading ? <CircleStopIcon className="w-4 h-4" /> : <ArrowUpIcon className="w-4 h-4" />}
          </Button>
        </div>

        {/* Model selection dropdown */}
        <Select value={model} onValueChange={handleModelChange}>
          <SelectTrigger className="w-fit bg-[#F4F4F4] flex items-center gap-2 border-none">
            <SelectValue placeholder="Select Model" />
          </SelectTrigger>
          <SelectContent className="w-fit">
            <SelectItem value="Duet">Duet</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
