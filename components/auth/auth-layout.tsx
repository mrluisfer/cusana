import { AuthHeader } from "./auth-header";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center">
      <div className="absolute top-12 w-full max-w-2xl px-8">
        <AuthHeader />
      </div>
      <div className="w-full max-w-md space-y-6 p-8">
        <h1 className="text-center text-2xl font-bold">{title}</h1>
        {children}
      </div>
    </div>
  );
}
