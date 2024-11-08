"use client";

import { useState, useEffect, useRef } from "react";
import { ChatInput } from "@/components-test/input-test";
import { ChatMessageList } from "@/components-test/message-list-test";

// Define Message type with specific allowed values for role
type Message = {
  id: string;
  role: "function" | "system" | "data" | "user" | "assistant" | "tool";
  content: string;
};

export const ChatPanel = () => {
  const [messages, setMessages] = useState<Message[]>([]);  // State to manage messages
  const messagesRef = useRef<HTMLDivElement>(null);

  const handleSend = (userMessageContent: string) => {
    // Create the user message
    const userMessage: Message = {
      id: String(Date.now()), // Unique ID for each message
      role: "user",
      content: userMessageContent,
    };

    // Create the hardcoded response message
    const hardcodedMessage: Message = {
      id: String(Date.now() + 1), // Ensure unique ID
      role: "system",
      content: "This is a hardcoded response message.",
    };

    // Update the messages state to include the user message and the hardcoded response
    setMessages((prevMessages) => [...prevMessages, userMessage, hardcodedMessage]);
  };

  useEffect(() => {
    messagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative flex w-full flex-1 overflow-x-hidden overflow-y-scroll pt-6">
      <div className="relative mx-auto flex h-full w-full min-w-[400px] max-w-3xl flex-1 flex-col md:px-2">
        {/* Display the updated messages */}
        <ChatMessageList 
          messages={messages} 
          containerRef={messagesRef} 
          setCurrentArtifact={() => {}} // No-op function for setCurrentArtifact
        />

        {/* Input component */}
        <ChatInput onSubmit={handleSend} />
      </div>
    </div>
  );
};
