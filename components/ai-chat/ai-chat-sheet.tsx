"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useAiChat } from "@/hooks/use-ai-chat";
import { KeyIcon, Trash2Icon } from "lucide-react";
import { AiChatInput } from "./ai-chat-input";
import { AiChatMessages } from "./ai-chat-messages";
import { AiChatTokenSetup } from "./ai-chat-token-setup";

export function AiChatSheet() {
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

  if (!hasToken) {
    return <AiChatTokenSetup onSaveToken={saveToken} />;
  }

  return (
    <div className="flex h-full flex-col">
      <SheetHeader className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <SheetTitle className="text-base">Asistente Cusana</SheetTitle>
            <SheetDescription className="text-xs">
              Pregunta sobre tus suscripciones y gastos.
            </SheetDescription>
          </div>
          <div className="flex items-center gap-1">
            {messages.length > 0 && (
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={clearChat}
                aria-label="Limpiar chat"
              >
                <Trash2Icon className="size-3.5" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={removeToken}
              aria-label="Cambiar clave API"
            >
              <KeyIcon className="size-3.5" />
            </Button>
          </div>
        </div>
      </SheetHeader>

      <AiChatMessages messages={messages} isStreaming={isStreaming} />

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
    </div>
  );
}
