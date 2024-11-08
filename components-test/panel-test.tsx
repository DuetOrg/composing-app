"use client";

import { useState, useEffect, useRef } from "react";
import { ChatInput } from "@/components-test/input-test";
import { ChatMessageList } from "@/components-test/message-list-test";
import abcjs from "abcjs"; // Ensure abcjs is installed

type Message = {
  id: string;
  role: "function" | "system" | "data" | "user" | "assistant" | "tool";
  content: string;
};

// Component for rendering ABC Notation
const ABCNotationRenderer = ({ abcNotation }: { abcNotation: string }) => {
  const abcContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (abcContainerRef.current) {
      abcjs.renderAbc(abcContainerRef.current, abcNotation);
    }
  }, [abcNotation]);

  return <div ref={abcContainerRef} className="w-full h-full"></div>;
};

export const ChatPanel = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [showSideBySide, setShowSideBySide] = useState(false); // Controls side-by-side view visibility
  const [abcNotation, setAbcNotation] = useState<string | null>(null); // Stores the ABC notation
  const messagesRef = useRef<HTMLDivElement>(null);

  const handleSend = (userMessageContent: string) => {
    const userMessage: Message = {
      id: String(Date.now()),
      role: "user",
      content: userMessageContent,
    };

    const assistantResponse: Message = {
      id: String(Date.now() + 1),
      role: "assistant",
      content: `Here is a classical melody in D minor:

\`\`\`abc
X:1
T:Classical Melody in D Minor
M:4/4
L:1/8
K:Dm
A2 | d2 e2 f2 g2 | a2 g2 f2 e2 | d2 c2 B2 A2 | G2 A2 B2 c2 |
d2 e2 f2 g2 | a2 g2 f2 e2 | d2 c2 B2 A2 | d4 z4 |
\`\`\`

This melody is composed in D minor, featuring a simple yet expressive progression. The ABC notation above can be rendered into standard sheet music using appropriate tools or libraries.`,
    };

    setMessages((prevMessages) => [...prevMessages, userMessage, assistantResponse]);

    // Extract ABC notation from the assistant's response
    const abcMatch = assistantResponse.content.match(/```abc\n([\s\S]*?)\n```/);
    if (abcMatch) {
      setAbcNotation(abcMatch[1]);
      setShowSideBySide(true);
    } else {
      setAbcNotation(null);
      setShowSideBySide(false);
    }
  };

  useEffect(() => {
    messagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative flex w-full flex-1 overflow-x-hidden overflow-y-scroll pt-6">
      <div className="relative mx-auto flex h-full w-full min-w-[400px] max-w-3xl flex-1 flex-col md:px-2">
        <ChatMessageList
          messages={messages}
          containerRef={messagesRef}
          setCurrentArtifact={() => {}}
        />
        <ChatInput onSubmit={handleSend} />
      </div>
      {showSideBySide && abcNotation && (
        <div className="w-1/2 p-4">
          <ABCNotationRenderer abcNotation={abcNotation} />
        </div>
      )}
    </div>
  );
};
