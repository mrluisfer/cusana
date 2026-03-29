import { AiChatLayout } from "@/components/ai-chat/ai-chat-layout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AiChatLayout>{children}</AiChatLayout>;
}
