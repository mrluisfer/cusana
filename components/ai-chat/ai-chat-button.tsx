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
import { useTranslation } from "react-i18next";

export function AiChatButton({
  triggerClassName,
}: {
  triggerClassName?: string;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useAtom(aiChatOpenAtom);

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="default"
            size="icon-lg"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? t("aiChat.closeAria") : t("aiChat.openAria")}
            className={triggerClassName}
          />
        }
      >
        {open ? <XIcon /> : <MessageCircleIcon />}
        <span className="sr-only">CusanaAI</span>
      </TooltipTrigger>
      <TooltipContent>
        {open ? t("aiChat.close") : t("aiChat.open")}
      </TooltipContent>
    </Tooltip>
  );
}
