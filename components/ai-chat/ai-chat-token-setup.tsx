"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeyIcon, SaveIcon, ShieldCheckIcon } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

type AiChatTokenSetupProps = {
  onSaveTokenAction: (token: string) => void;
};

export function AiChatTokenSetup({ onSaveTokenAction }: AiChatTokenSetupProps) {
  const { t } = useTranslation();
  const [token, setToken] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = token.trim();

    if (!trimmed) {
      setError(t("aiChat.tokenSetup.errorEmpty"));
      return;
    }

    if (!trimmed.startsWith("sk-")) {
      setError(t("aiChat.tokenSetup.errorPrefix"));
      return;
    }

    setError("");
    onSaveTokenAction(trimmed);
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="bg-primary/10 flex size-12 items-center justify-center">
          <KeyIcon className="text-primary size-6" />
        </div>
        <h3 className="text-lg font-semibold">
          {t("aiChat.tokenSetup.title")}
        </h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {t("aiChat.tokenSetup.instructions")}{" "}
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
        />
        {error && <p className="text-destructive text-xs">{error}</p>}
        <Button type="submit" className="w-full">
          <SaveIcon />
          {t("aiChat.tokenSetup.save")}
        </Button>
      </form>

      <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
        <ShieldCheckIcon className="size-3.5" />
        {t("aiChat.tokenSetup.security")}
      </p>
    </div>
  );
}
