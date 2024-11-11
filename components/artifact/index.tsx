// components/ChatPanel.tsx
"use client";

import { ArtifactPanel } from "@/components/artifact";
import { ChatInput, Props as ChatInputProps } from "@/components/chat/input";
import { ChatMessageList } from "@/components/chat/message-list";
import { Message, useChat } from "ai/react";
import { getSettings } from "@/lib/userSettings";
import { addMessage, createChat, getChatMessages } from "@/lib/db";
import { Loader2Icon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "@/lib/supabase";
import { Chat, Models, Attachment } from "@/app/types";
import { ArtifactMessagePartData } from "@/lib/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useScrollAnchor } from "@/lib/hooks/use-scroll-anchor";

type Props = {
  id: string | null;
};

export const ChatPanel = ({ id }: Props) => {
  const settings = getSettings();
  const { supabase, session } = useSupabase();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [chatId, setChatId] = useState(id);
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [fetchingMessages, setFetchingMessages] = useState(false);
  const [currentArtifact, setCurrentArtifact] = useState<ArtifactMessagePartData | null>(null);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [selectedArtifacts, setSelectedArtifacts] = useState<string[]>([]);

  const fetchMessages = async () => {
    if (chatId) {
      setFetchingMessages(true);
      const messages = await getChatMessages(supabase, chatId);
      setInitialMessages(
        messages.map((message: { id: number; role: string; text: string; attachments: unknown }) => ({
          id: String(message.id),
          role: message.role as Message["role"],
          content: message.text,
          experimental_attachments: (message.attachments as Attachment[]) || [],
        }))
      );
      setFetchingMessages(false);
    } else {
      setInitialMessages([]);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const createChatMutation = useMutation({
    mutationFn: async ({
      title,
    }: {
      title: string;
      firstMessage: Message;
      secondMessage: Message;
    }) => await createChat(supabase, title, session?.user.id),
    onSuccess: async (newChat, { firstMessage, secondMessage }) => {
      queryClient.setQueryData<Chat[]>(["chats"], (oldChats) => {
        return [...(oldChats || []), newChat];
      });
      setChatId(newChat.id);
      await addMessage(supabase, newChat.id, firstMessage);
      await addMessage(supabase, newChat.id, secondMessage);
      router.push(`/chat/${newChat.id}`);
    },
  });

  const {
    messages,
    input,
    setInput,
    append,
    stop: stopGenerating,
    isLoading: generatingResponse,
  } = useChat({
    initialMessages,
    onFinish: async (message) => {
      if (chatId) {
        await addMessage(supabase, chatId, message);
      }
    },
    sendExtraMessageFields: true,
  });

  const { messagesRef, scrollRef, showScrollButton, handleManualScroll } = useScrollAnchor(messages);

  useEffect(() => {
    if (!chatId && messages.length === 2 && !generatingResponse) {
      createChatMutation.mutate({
        title: messages[0].content.slice(0, 100),
        firstMessage: messages[0],
        secondMessage: messages[1],
      });
    }
  }, [chatId, messages, generatingResponse]);

  const handleAddAttachment: ChatInputProps["onAddAttachment"] = (newAttachments) => {
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const handleRemoveAttachment: ChatInputProps["onRemoveAttachment"] = (attachment) => {
    setAttachments((prev) => prev.filter((item) => item.url !== attachment.url));
  };

  const handleSend = async () => {
    const query = input.trim();
    if (!query) return;

    const settings = getSettings();

    if (settings.model === Models.claude && !settings.anthropicApiKey) {
      toast.error("Please enter your Claude API Key");
      return;
    }

    if (settings.model.startsWith("gpt") && !settings.openaiApiKey) {
      toast.error("Please enter your OpenAI API Key");
      return;
    }

    const messageAttachments = [
      ...attachments.filter((item) => item.contentType?.startsWith("image")).map((item) => ({ url: item.url, contentType: item.contentType })),
      ...selectedArtifacts.map((url) => ({ url })),
    ];

    append(
      {
        role: "user",
        content: query,
        experimental_attachments: messageAttachments,
      },
      {
        body: {
          model: settings.model,
          apiKey: settings.model.startsWith("gpt") ? settings.openaiApiKey : settings.anthropicApiKey,
        },
      }
    );

    setInput("");

    if (chatId) {
      await addMessage(supabase, chatId, { role: "user", content: query }, attachments);
    }

    setAttachments([]);
    setSelectedArtifacts([]);
  };

  return (
    <div className={`relative flex ${currentArtifact ? 'justify-between' : 'justify-center'} w-full h-full overflow-hidden pt-6`}>
      <div className={`flex flex-col ${currentArtifact ? 'w-2/3' : 'w-full max-w-3xl'} min-w-[400px] h-full overflow-y-scroll`}>
        {fetchingMessages && <Loader2Icon className="animate-spin mx-auto" />}
        <ChatMessageList messages={messages} setCurrentArtifact={setCurrentArtifact} containerRef={messagesRef} />
        <ChatInput
          input={input}
          setInput={setInput}
          onSubmit={handleSend}
          isLoading={generatingResponse}
          attachments={attachments}
          onAddAttachment={handleAddAttachment}
          onRemoveAttachment={handleRemoveAttachment}
          showScrollButton={showScrollButton}
          handleManualScroll={handleManualScroll}
          stopGenerating={stopGenerating}
        />
      </div>

      {currentArtifact && (
        <div className="w-1/3 p-4 h-full overflow-y-auto">
          <ArtifactPanel
            title={currentArtifact.title}
            id={currentArtifact.id}
            type={currentArtifact.type}
            generating={currentArtifact.generating}
            content={currentArtifact.content}
            language={currentArtifact.language}
            onClose={() => setCurrentArtifact(null)}
          />
        </div>
      )}
    </div>
  );
};
