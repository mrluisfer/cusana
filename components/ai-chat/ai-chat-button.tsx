"use client";

import { aiChatOpenAtom } from "@/atoms";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAtom } from "jotai";
import { MessageCircleIcon, XIcon } from "lucide-react";

export function AiChatButton({
  triggerClassName,
}: {
  triggerClassName?: string;
}) {
  const [open, setOpen] = useAtom(aiChatOpenAtom);

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="default"
            size="icon-lg"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={
              open ? "Cerrar asistente Cusana" : "Abrir asistente Cusana"
            }
            className={triggerClassName}
          />
        }
      >
        {open ? <XIcon /> : <MessageCircleIcon />}
        <span className="sr-only">CusanaAI</span>
      </TooltipTrigger>
      <TooltipContent>
        {open ? "Cerrar CusanaAI" : "Pregunta a CusanaAI"}
      </TooltipContent>
    </Tooltip>
  );
}
