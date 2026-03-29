"use client";

import { aiChatOpenAtom } from "@/atoms";
import { useAtom } from "jotai";
import { XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { AiChatSheet } from "./ai-chat-sheet";

export function AiChatPanel() {
  const [open, setOpen] = useAtom(aiChatOpenAtom);

  return (
    <aside
      className={`bg-background border-border fixed top-0 right-0 h-dvh w-[400px] border-l transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="flex w-full items-center justify-end pt-5 pr-5">
        <Button
          size={"icon"}
          variant={"ghost"}
          onClick={() => setOpen(false)}
          aria-label="Cerrar asistente Cusana"
        >
          <XIcon />
        </Button>
      </div>
      <AiChatSheet />
    </aside>
  );
}
