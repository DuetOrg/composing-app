import { useState } from "react";
import { ChatItem } from "@/components-test/input-test"; // Adjust the import path if necessary

// Mocked chat data
const mockChats = [
  { id: "1", title: "New Composition", content: "Lorem Ipsum" },
  { id: "2", title: "New Composition 2", content: "Lorem Ipsum" },
  { id: "3", title: "New Composition 3", content: "Lorem Ipsum" },
];

const SideNavBarTest = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  return (
    <div className="w-[250px] bg-gray-100 p-4 h-full overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Chats</h2>
      {mockChats.map((chat) => (
        <ChatItem
          key={chat.id}
          id={chat.id}
          title={chat.title}
          selected={chat.id === selectedChatId}
          onClick={() => setSelectedChatId(chat.id)}
        />
      ))}
    </div>
  );
};

export default SideNavBarTest;
