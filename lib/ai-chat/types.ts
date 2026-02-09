export type ChatRole = "user" | "assistant" | "system";

export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  createdAt: Date;
}

export interface OpenAIChatMessage {
  role: ChatRole;
  content: string;
}
