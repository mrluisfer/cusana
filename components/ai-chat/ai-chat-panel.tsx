"use client";

import { useAtomValue } from "jotai";
import { aiChatOpenAtom } from "@/atoms";
import { AiChatSheet } from "./ai-chat-sheet";

export function AiChatPanel() {
  const open = useAtomValue(aiChatOpenAtom);

  return (
    <aside
      className={`fixed top-0 right-0 flex h-dvh w-[400px] flex-col border-border border-l bg-background transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
    >
      <AiChatSheet />
    </aside>
  );
}
