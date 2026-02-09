"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendIcon, SquareIcon } from "lucide-react";
import { useState } from "react";

type AiChatInputProps = {
  onSendAction: (message: string) => void;
  onCancelAction: () => void;
  isStreaming: boolean;
  disabled?: boolean;
};

export function AiChatInput({
  onSendAction,
  onCancelAction,
  isStreaming,
  disabled,
}: AiChatInputProps) {
  const [value, setValue] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isStreaming || !value.trim()) return;
    onSendAction(value);
    setValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 border-t p-3"
    >
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribe tu pregunta..."
        autoComplete="off"
        disabled={disabled}
        className="flex-1"
      />
      {isStreaming ? (
        <Button
          type="button"
          variant="destructive"
          size="icon"
          onClick={onCancelAction}
          aria-label="Detener"
        >
          <SquareIcon className="size-4" />
        </Button>
      ) : (
        <Button
          type="submit"
          size="icon"
          disabled={disabled || !value.trim()}
          aria-label="Enviar"
        >
          <SendIcon className="size-4" />
        </Button>
      )}
    </form>
  );
}
