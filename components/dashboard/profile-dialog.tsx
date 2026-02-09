"use client";

import { authClient, useSession } from "@/lib/auth-client";
import Avatar from "boring-avatars";
import {
  CalendarIcon,
  CheckIcon,
  Loader2Icon,
  MailIcon,
  PencilIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

type ProfileDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const { data } = useSession();
  const user = data?.user;

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = useCallback(async () => {
    const trimmed = name.trim();
    if (!trimmed || trimmed === user?.name) {
      setIsEditing(false);
      setName(user?.name ?? "");
      return;
    }

    setIsSaving(true);
    try {
      await authClient.updateUser({ name: trimmed });
      setIsEditing(false);
    } catch {
      setName(user?.name ?? "");
    } finally {
      setIsSaving(false);
    }
  }, [name, user?.name]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSave();
      if (e.key === "Escape") {
        setIsEditing(false);
        setName(user?.name ?? "");
      }
    },
    [handleSave, user?.name],
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        setIsEditing(false);
        setName(user?.name ?? "");
      }
      onOpenChange(open);
    },
    [onOpenChange, user?.name],
  );

  const createdAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("es-MX", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Perfil</DialogTitle>
          <DialogDescription>Tu información de cuenta</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3 py-2">
          <Avatar name={user?.name || "User"} variant="beam" size={64} square />

          {/* Name - editable */}
          {isEditing ? (
            <div className="flex w-full max-w-48 items-center gap-1.5">
              <Input
                ref={inputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSave}
                className="h-8 text-center text-sm"
                disabled={isSaving}
              />
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2Icon className="size-3.5 animate-spin" />
                ) : (
                  <CheckIcon className="size-3.5" />
                )}
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="group hover:bg-muted flex items-center gap-1.5 rounded-md px-2 py-1 transition-colors"
            >
              <span className="text-foreground text-base font-medium">
                {user?.name}
              </span>
              <PencilIcon className="text-muted-foreground size-3 opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          )}
        </div>

        <Separator />

        {/* Info rows */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-md">
              <MailIcon className="text-muted-foreground size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-muted-foreground text-xs">Correo</p>
              <p className="text-foreground truncate text-sm">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-md">
              <ShieldCheckIcon className="text-muted-foreground size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-muted-foreground text-xs">
                Verificación de correo
              </p>
              <div className="mt-0.5">
                {user?.emailVerified ? (
                  <Badge variant="default" className="text-xs">
                    Verificado
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    No verificado
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {createdAt && (
            <div className="flex items-center gap-3">
              <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-md">
                <CalendarIcon className="text-muted-foreground size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-muted-foreground text-xs">Miembro desde</p>
                <p className="text-foreground text-sm">{createdAt}</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
