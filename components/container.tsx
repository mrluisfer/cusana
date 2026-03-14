import React, { ReactNode } from "react";

export const Container = ({ children }: { children: ReactNode }) => {
  return (
    <main className="from-background to-muted/20 mx-auto min-h-screen max-w-7xl bg-linear-to-b px-4 sm:px-6 lg:px-8">
      {children}
    </main>
  );
};
