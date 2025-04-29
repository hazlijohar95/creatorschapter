
import { Check, CheckCheck } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/lib/auth";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  read_at: string | null;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const { user } = useAuthStore();
  const isCurrentUser = message.sender_id === user?.id;

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "p");
  };

  return (
    <div
      className={`flex items-end gap-2 ${
        isCurrentUser ? "flex-row-reverse" : ""
      }`}
    >
      <Avatar className="h-8 w-8 mt-2 flex-shrink-0">
        <AvatarImage src={message.profiles.avatar_url || ""} />
        <AvatarFallback className="bg-yellow-900">
          {message.profiles.full_name
            ? message.profiles.full_name
                .split(" ")
                .map((n) => n[0])
                .join("")
            : "?"}
        </AvatarFallback>
      </Avatar>

      <div
        className={`max-w-[80%] flex flex-col ${
          isCurrentUser ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`rounded-lg px-4 py-2 ${
            isCurrentUser
              ? "bg-yellow-600 text-white"
              : "bg-white/10 text-white"
          }`}
        >
          {message.content}
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs text-white/50">
          <span>{formatMessageDate(message.created_at)}</span>
          {isCurrentUser && (
            message.read_at ? (
              <CheckCheck className="h-3 w-3 text-blue-500" />
            ) : (
              <Check className="h-3 w-3 text-gray-400" />
            )
          )}
        </div>
      </div>
    </div>
  );
}
