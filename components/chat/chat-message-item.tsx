import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessageItemProps {
  content: string;
  username: string;
  timestamp: string;
  isOwnMessage?: boolean;
}

export function ChatMessageItem({
  content,
  username,
  timestamp,
  isOwnMessage = false,
}: ChatMessageItemProps) {
  const initials = username
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={cn("flex gap-3 mb-4", isOwnMessage && "flex-row-reverse")}>
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarFallback
          className={cn(
            "text-xs",
            isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"
          )}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
      <div
        className={cn(
          "flex flex-col gap-1 max-w-[70%]",
          isOwnMessage && "items-end"
        )}
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{username}</span>
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        </div>
        <div
          className={cn(
            "rounded-lg px-3 py-2 text-sm",
            isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted"
          )}
        >
          {content}
        </div>
      </div>
    </div>
  );
}
