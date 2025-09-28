import { Header } from "@/components/shared/header/Header";
import UserChat from "@/components/chat/user-chat";

export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        {children}
        <UserChat />
        <div className="h-16 md:hidden" />
      </div>
    </>
  );
}
