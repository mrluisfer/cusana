import React, { ReactNode } from "react";

export const Container = ({ children }: { children: ReactNode }) => {
  return (
    <main className="from-background to-muted/30 container mx-auto min-h-screen max-w-6xl bg-linear-to-b px-4">
      {children}
    </main>
  );
};
