import { MessageCircle } from "lucide-react";
import Link from "next/link";

interface ChatUserProps {
  userId: string;
}

export default function ChatUser({ userId }: ChatUserProps) {
  return (
    <Link href={`/chat/${userId}`} className="w-full flex">
      <MessageCircle className="mr-2 h-4 w-4" />
      <span>Chat</span>
    </Link>
  );
}
