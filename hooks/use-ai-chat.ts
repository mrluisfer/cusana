"use client";

import { streamChatCompletion } from "@/lib/ai-chat/openai-stream";
import { CUSANA_SYSTEM_PROMPT } from "@/lib/ai-chat/system-prompt";
import type { ChatMessage, OpenAIChatMessage } from "@/lib/ai-chat/types";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";

const STORAGE_KEY = "cusana-openai-token";

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const tokenListeners = new Set<() => void>();

function notifyTokenListeners() {
  tokenListeners.forEach((listener) => listener());
}

function subscribeToToken(listener: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.storageArea === sessionStorage && event.key === STORAGE_KEY) {
      listener();
    }
  };

  tokenListeners.add(listener);
  window.addEventListener("storage", handleStorage);

  return () => {
    tokenListeners.delete(listener);
    window.removeEventListener("storage", handleStorage);
  };
}

function getTokenSnapshot() {
  if (typeof window === "undefined") return false;
  return !!sessionStorage.getItem(STORAGE_KEY);
}

function getServerTokenSnapshot() {
  return false;
}

export function useAiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const hasToken = useSyncExternalStore(
    subscribeToToken,
    getTokenSnapshot,
    getServerTokenSnapshot,
  );

  const getToken = useCallback((): string | null => {
    if (typeof window === "undefined") return null;
    return sessionStorage.getItem(STORAGE_KEY);
  }, []);

  const saveToken = useCallback((token: string) => {
    sessionStorage.setItem(STORAGE_KEY, token);
    notifyTokenListeners();
  }, []);

  const removeToken = useCallback(() => {
    sessionStorage.removeItem(STORAGE_KEY);
    notifyTokenListeners();
    setMessages([]);
    setError(null);
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      const token = getToken();
      if (!token || !content.trim()) return;

      setError(null);

      const userMessage: ChatMessage = {
        id: generateId(),
        role: "user",
        content: content.trim(),
        createdAt: new Date(),
      };

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: "assistant",
        content: "",
        createdAt: new Date(),
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setIsStreaming(true);

      // Build OpenAI messages array
      const openaiMessages: OpenAIChatMessage[] = [
        { role: "system", content: CUSANA_SYSTEM_PROMPT },
        ...messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user" as const, content: content.trim() },
      ];

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      await streamChatCompletion(
        token,
        openaiMessages,
        (chunk) => {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last && last.role === "assistant") {
              updated[updated.length - 1] = {
                ...last,
                content: last.content + chunk,
              };
            }
            return updated;
          });
        },
        () => {
          setIsStreaming(false);
          abortControllerRef.current = null;
        },
        (err) => {
          setIsStreaming(false);
          abortControllerRef.current = null;
          setError(err.message);

          // Remove empty assistant message on error
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            if (last?.role === "assistant" && !last.content) {
              return prev.slice(0, -1);
            }
            return prev;
          });
        },
        abortController.signal,
      );
    },
    [getToken, messages],
  );

  const cancelStream = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsStreaming(false);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isStreaming,
    error,
    hasToken,
    sendMessage,
    cancelStream,
    clearChat,
    getToken,
    saveToken,
    removeToken,
  };
}
