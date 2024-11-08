"use client";

import { useState, useEffect, useRef } from "react";
import { ChatInput } from "@/components-test/input-test";
import { ChatMessageList } from "@/components-test/message-list-test";
import ArtifactPanel from "@/components-test/ArtifactPanel";

type Message = {
  id: string;
  role: "function" | "system" | "data" | "user" | "assistant" | "tool";
  content: string;
};

export const ChatPanel = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [abcNotation, setAbcNotation] = useState<string | null>(null);
  const [showArtifactPanel, setShowArtifactPanel] = useState(false);
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

    const abcMatch = assistantResponse.content.match(/```abc\n([\s\S]*?)\n```/);
    if (abcMatch) {
      setAbcNotation(abcMatch[1]);
      setShowArtifactPanel(true);
    } else {
      setAbcNotation(null);
      setShowArtifactPanel(false);
    }
  };

  useEffect(() => {
    messagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className={`relative flex w-full h-full pt-6 ${showArtifactPanel ? "justify-between" : "justify-center"}`}>
      <div className={`flex flex-col ${showArtifactPanel ? "w-3/5" : "w-full max-w-3xl"} min-w-[400px] h-full overflow-y-scroll`}>
        <ChatMessageList
          messages={messages}
          containerRef={messagesRef}
          setCurrentArtifact={() => {}}
        />
        <ChatInput onSubmit={handleSend} />
      </div>

      {showArtifactPanel && abcNotation && (
        <div className="w-2/5 p-4 h-full overflow-y-auto">
          <ArtifactPanel
            type="application/abc"
            title="Classical Melody in D Minor"
            language="abc"
            content={abcNotation}
            onClose={() => setShowArtifactPanel(false)}
            recording={false}
            onCapture={() => {}}
          />
        </div>
      )}
    </div>
  );
};
