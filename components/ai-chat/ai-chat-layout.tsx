"use client";

import { aiChatOpenAtom } from "@/atoms";
import { useAtomValue } from "jotai";
import { AiChatPanel } from "./ai-chat-panel";

export function AiChatLayout({ children }: { children: React.ReactNode }) {
  const open = useAtomValue(aiChatOpenAtom);

  return (
    <>
      <div
        className={`transition-[margin-right] duration-300 ease-in-out ${open ? "mr-[400px]" : "mr-0"}`}
      >
        {children}
      </div>
      <AiChatPanel />
    </>
  );
}
