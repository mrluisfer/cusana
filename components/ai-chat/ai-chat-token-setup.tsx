"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyIcon, ShieldCheckIcon } from "lucide-react";
import { useState } from "react";

type AiChatTokenSetupProps = {
  onSaveToken: (token: string) => void;
};

export function AiChatTokenSetup({ onSaveToken }: AiChatTokenSetupProps) {
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = token.trim();

    if (!trimmed) {
      setError("Ingresa tu clave de OpenAI.");
      return;
    }

    if (!trimmed.startsWith("sk-")) {
      setError("La clave debe comenzar con 'sk-'.");
      return;
    }

    setError("");
    onSaveToken(trimmed);
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="bg-primary/10 flex size-12 items-center justify-center">
          <KeyIcon className="text-primary size-6" />
        </div>
        <h3 className="text-lg font-semibold">Configura tu clave API</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          Para usar el asistente, necesitas una clave de API de OpenAI. Puedes
          obtenerla en{" "}
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2"
          >
            platform.openai.com
          </a>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
        <Input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="sk-..."
          autoComplete="off"
          autoFocus
        />
        {error && <p className="text-destructive text-xs">{error}</p>}
        <Button type="submit" className="w-full">
          Guardar clave
        </Button>
      </form>

      <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
        <ShieldCheckIcon className="size-3.5" />
        Tu clave se almacena solo en esta sesión del navegador.
      </p>
    </div>
  );
}
