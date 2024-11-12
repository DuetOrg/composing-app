"use client";

import { ChatPanel } from "@/components-test/panel-test";
import { SideNavBar } from "@/components/side-navbar";

const TestChatPage = () => {
  // Remove the session check and any redirect logic
  const session = true;  // Hard-coded session simulation

  return (
    <div className="flex gap-4 w-full h-screen max-h-screen overflow-hidden px-2 pl-0">
      <SideNavBar />
      {/* Pass hard-coded ID or null as needed */}
      <ChatPanel/>
    </div>
  );
};

export default TestChatPage;

