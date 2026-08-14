"use client";

import { useSetAtom } from "jotai";
import { KeyIcon, Trash2Icon, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { aiChatOpenAtom } from "@/atoms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAiChat } from "@/hooks/use-ai-chat";
import { AiChatInput } from "./ai-chat-input";
import { AiChatMessages } from "./ai-chat-messages";
import { AiChatTokenSetup } from "./ai-chat-token-setup";

export function AiChatSheet() {
  const { t } = useTranslation();
  const {
    messages,
    isStreaming,
    error,
    hasToken,
    sendMessage,
    cancelStream,
    clearChat,
    saveToken,
    removeToken,
  } = useAiChat();
  const setOpen = useSetAtom(aiChatOpenAtom);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/*
        El header es chrome del panel, no del chat: se renderiza también sin
        clave para que siempre haya forma de cerrar.
      */}
      <div className="flex shrink-0 items-center justify-between border-b px-4 py-3">
        <div>
          <h2 className="font-semibold text-base">{t("aiChat.title")}</h2>
          <p className="text-muted-foreground text-xs">
            {t("aiChat.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {hasToken && messages.length > 0 && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={clearChat}
              aria-label={t("aiChat.clearChat")}
            >
              <Trash2Icon className="size-3.5" />
            </Button>
          )}
          {hasToken && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={removeToken}
              aria-label={t("aiChat.changeKey")}
            >
              <KeyIcon className="size-3.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setOpen(false)}
            aria-label={t("aiChat.closePanel")}
          >
            <XIcon className="size-3.5" />
          </Button>
        </div>
      </div>

      {hasToken ? (
        <>
          <AiChatMessages
            messages={messages}
            isStreaming={isStreaming}
            onSuggestionAction={sendMessage}
          />

          {error && (
            <>
              <Separator />
              <div className="px-4 py-2">
                <Badge variant="destructive" className="text-xs">
                  {error}
                </Badge>
              </div>
            </>
          )}

          <AiChatInput
            onSendAction={sendMessage}
            onCancelAction={cancelStream}
            isStreaming={isStreaming}
          />
        </>
      ) : (
        <AiChatTokenSetup onSaveTokenAction={saveToken} />
      )}
    </div>
  );
}
