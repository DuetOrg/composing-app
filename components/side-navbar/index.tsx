"use client";

import { ChatItem } from "@/components/side-navbar/chat-item";
import { UserSettings } from "@/components/side-navbar/user-settings";
import { Button } from "@/components/ui/button";
import { UserButton } from "@/components/user-button";
import { getChats } from "@/lib/db";
import { useSupabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon, SidebarIcon, SquarePenIcon } from "lucide-react";
//import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";

export const SideNavBar = () => {
  const [open, setOpen] = useState(false);
  const params = useParams();
  
  const { supabase, session } = useSupabase();
  const userId = session?.user.id;

  // Log session and userId to debug authentication issues
  console.log("Session:", session);
  console.log("User ID:", userId);

  const {
    data: chats,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["chats", userId],
    queryFn: async () => {
      if (!userId) {
        console.warn("User ID is undefined, skipping chat fetch");
        return [];
      }
      return await getChats(supabase, userId);
    },
    enabled: !!userId,
  });

  // Log chats and errors to debug data fetching issues
  useEffect(() => {
    if (chats) console.log("Fetched chats:", chats);
    if (error) console.error("Error fetching chats:", error);
  }, [chats, error]);

  if (open) {
    return (
      <div className="h-screen max-h-screen overflow-hidden flex flex-col gap-4 justify-between px-2 py-2 pb-4 bg-slate-50 w-[200px]">
        <div className="flex flex-col gap-2">
          <Link href="/" className="text-lg font-semibold text-center">
            Duet
          </Link>

          <div className="flex items-center justify-between gap-2">
            <Button onClick={() => setOpen(false)} size="icon" variant="ghost">
              <SidebarIcon className="w-4 h-4" />
            </Button>

            <Link href="/new">
              <Button size="icon" variant="ghost">
                <SquarePenIcon className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col flex-1 gap-2 overflow-hidden">
          <span className="font-medium">Chats</span>
          {chats && chats.length > 0 ? (
            <div className="flex flex-col flex-1 gap-2 overflow-auto">
              {chats.map((item, index) => (
                <ChatItem
                  key={index}
                  id={item.id}
                  title={item.title}
                  selected={item.id === params.id}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No chats available</p>
          )}

          {isLoading && <Loader2Icon className="w-4 h-4 animate-spin" />}
          {error && <p className="text-red-500">Could not fetch chats</p>}
        </div>

        <div className="flex flex-col gap-4 mt-2">
          {/* <a
            href="https://github.com/13point5/open-artifacts"
            target="_blank"
            className="text-black flex items-center gap-4 px-1"
          >
            <Image src="/github.svg" height="24" width="24" alt="github logo" />
            <span className="text-sm font-medium">GitHub Repo</span>
          </a> */}
          <UserSettings showLabel />
          <UserButton expanded />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen max-h-screen flex flex-col gap-2 justify-between px-2 py-2 pb-4 items-center">
      <div className="flex flex-col gap-2">
        <Link href="/" className="text-lg font-semibold text-center">
          Duet
        </Link>

        <div className="flex items-center gap-2">
          <Button onClick={() => setOpen(true)} size="icon" variant="ghost">
            <SidebarIcon className="w-4 h-4" />
          </Button>

          <Link href="/new">
            <Button size="icon" variant="ghost">
              <SquarePenIcon className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        {/* <a
          href="https://github.com/13point5/open-artifacts"
          target="_blank"
          className="text-black"
        >
          <Image src="/github.svg" height="24" width="24" alt="github logo" />
        </a> */}
        <UserSettings />
        <UserButton />
      </div>
    </div>
  );
};
