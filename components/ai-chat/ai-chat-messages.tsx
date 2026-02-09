"use client";

import type { ChatMessage } from "@/lib/ai-chat/types";
import { cn } from "@/lib/utils";
import { BotIcon, UserIcon } from "lucide-react";
import { useEffect, useRef } from "react";

type AiChatMessagesProps = {
  messages: ChatMessage[];
  isStreaming: boolean;
};

function MessageBubble({
  message,
  isStreaming,
}: {
  message: ChatMessage;
  isStreaming: boolean;
}) {
  const isUser = message.role === "user";
  const isEmpty = !message.content;

  return (
    <div
      className={cn("flex gap-2.5", isUser ? "flex-row-reverse" : "flex-row")}
    >
      <div
        className={cn(
          "flex size-7 shrink-0 items-center justify-center",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground",
        )}
      >
        {isUser ? (
          <UserIcon className="size-3.5" />
        ) : (
          <BotIcon className="size-3.5" />
        )}
      </div>

      <div
        className={cn(
          "max-w-[85%] px-3 py-2 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground",
        )}
      >
        {isEmpty && isStreaming ? (
          <span className="inline-flex items-center gap-1">
            <span className="bg-foreground/40 size-1.5 animate-pulse" />
            <span className="bg-foreground/40 size-1.5 animate-pulse delay-150" />
            <span className="bg-foreground/40 size-1.5 animate-pulse delay-300" />
          </span>
        ) : (
          <span className="whitespace-pre-wrap">{message.content}</span>
        )}
      </div>
    </div>
  );
}

export function AiChatMessages({ messages, isStreaming }: AiChatMessagesProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        <div className="bg-primary/10 flex size-12 items-center justify-center">
          <BotIcon className="text-primary size-6" />
        </div>
        <div>
          <p className="font-medium">Asistente Cusana</p>
          <p className="text-muted-foreground mt-1 text-sm">
            Pregúntame sobre tus suscripciones, gastos o cualquier función de la
            app.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-3 overflow-y-auto p-4">
      {messages.map((message, index) => (
        <MessageBubble
          key={message.id}
          message={message}
          isStreaming={
            isStreaming &&
            index === messages.length - 1 &&
            message.role === "assistant"
          }
        />
      ))}
      <div ref={endRef} />
    </div>
  );
}
