"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { MessageCircleIcon } from "lucide-react";
import { useState } from "react";
import { AiChatSheet } from "./ai-chat-sheet";

export function AiChatButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="default"
        className="z-40 shadow-lg"
        onClick={() => setOpen(true)}
        aria-label="Abrir asistente Cusana"
      >
        <MessageCircleIcon className="size-5" />
        <span className="font-mono">Pregunta a CusanaAI</span>
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="flex flex-col gap-0 p-0 sm:max-w-md"
          showCloseButton={false}
        >
          <AiChatSheet />
        </SheetContent>
      </Sheet>
    </>
  );
}
