"use client";

import { BotIcon, SparklesIcon, UserIcon } from "lucide-react";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { ChatMessage } from "@/lib/ai-chat/types";
import { cn } from "@/lib/utils";

type AiChatMessagesProps = {
  messages: ChatMessage[];
  isStreaming: boolean;
  onSuggestionAction?: (text: string) => void;
};

const SUGGESTION_KEYS = [
  "cancel",
  "monthly",
  "topCategory",
  "duplicates",
] as const;

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
            <span className="size-1.5 animate-pulse bg-foreground/40" />
            <span className="size-1.5 animate-pulse bg-foreground/40 delay-150" />
            <span className="size-1.5 animate-pulse bg-foreground/40 delay-300" />
          </span>
        ) : (
          <span className="whitespace-pre-wrap">{message.content}</span>
        )}
      </div>
    </div>
  );
}

export function AiChatMessages({
  messages,
  isStreaming,
  onSuggestionAction,
}: AiChatMessagesProps) {
  const { t } = useTranslation();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 overflow-y-auto p-6 text-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10">
          <BotIcon className="size-6 text-primary" />
        </div>
        <div>
          <p className="font-medium">{t("aiChat.emptyTitle")}</p>
          <p className="mt-1 text-muted-foreground text-sm">
            {t("aiChat.emptySubtitle")}
          </p>
        </div>
        {onSuggestionAction && (
          <div className="w-full max-w-xs space-y-2">
            <p className="flex items-center justify-center gap-1.5 font-medium text-muted-foreground text-xs">
              <SparklesIcon className="size-3.5" />
              {t("aiChat.suggestionsLabel")}
            </p>
            <div className="flex flex-col gap-1.5">
              {SUGGESTION_KEYS.map((key) => {
                const text = t(`aiChat.suggestions.${key}`);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => onSuggestionAction(text)}
                    className="rounded-lg border border-border/60 bg-card px-3 py-2 text-left text-foreground text-sm transition-colors hover:border-border hover:bg-muted"
                  >
                    {text}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
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
