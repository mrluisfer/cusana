"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MessageCircleIcon } from "lucide-react";
import { useState } from "react";
import { AiChatSheet } from "./ai-chat-sheet";

export function AiChatButton({
  triggerClassName,
}: {
  triggerClassName?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(true)}
              aria-label="Abrir asistente Cusana"
              className={triggerClassName}
            />
          }
        >
          <MessageCircleIcon className="size-4" />
          <span className="sr-only">CusanaAI</span>
        </TooltipTrigger>
        <TooltipContent>Pregunta a CusanaAI</TooltipContent>
      </Tooltip>

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
