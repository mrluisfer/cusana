import React, { ReactNode } from "react";

export const Container = ({ children }: { children: ReactNode }) => {
  return (
    <main className="min-h-screen bg-linear-to-b from-background to-muted/30 container max-w-6xl mx-auto px-4">
      {children}
    </main>
  );
};
