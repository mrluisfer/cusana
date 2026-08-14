import type { ReactNode } from "react";

export const Container = ({ children }: { children: ReactNode }) => {
  return (
    <main className="mx-auto min-h-screen max-w-7xl bg-linear-to-b from-background to-muted/20 px-4 sm:px-6 lg:px-8">
      {children}
    </main>
  );
};
