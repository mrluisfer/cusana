import type { OpenAIChatMessage } from "./types";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const MODEL = "gpt-4o-mini";

/** Translated error strings injected by the caller so messages follow the active language. */
export type StreamErrorMessages = {
  invalidKey: string;
  rateLimit: string;
  readError: string;
  unknown: string;
};

const DEFAULT_ERROR_MESSAGES: StreamErrorMessages = {
  invalidKey: "Invalid API key. Check your OpenAI key.",
  rateLimit: "Rate limit reached. Try again in a few moments.",
  readError: "Could not read the server response.",
  unknown: "Unknown error",
};

export async function streamChatCompletion(
  apiKey: string,
  messages: OpenAIChatMessage[],
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (error: Error) => void,
  signal?: AbortSignal,
  errorMessages: StreamErrorMessages = DEFAULT_ERROR_MESSAGES,
): Promise<void> {
  try {
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        stream: true,
        max_tokens: 1024,
      }),
      signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message = errorData?.error?.message ?? `Error ${response.status}`;

      if (response.status === 401) {
        throw new Error(errorMessages.invalidKey);
      }
      if (response.status === 429) {
        throw new Error(errorMessages.rateLimit);
      }
      throw new Error(message);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error(errorMessages.readError);
    }

    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data: ")) continue;

        const data = trimmed.slice(6);
        if (data === "[DONE]") {
          onDone();
          return;
        }

        try {
          const parsed = JSON.parse(data);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            onChunk(content);
          }
        } catch {
          // Skip malformed JSON chunks
        }
      }
    }

    onDone();
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      onDone();
      return;
    }
    onError(
      error instanceof Error ? error : new Error(errorMessages.unknown),
    );
  }
}
