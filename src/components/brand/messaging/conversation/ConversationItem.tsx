
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ConversationItemProps {
  conversation: {
    id: string;
    creatorName: string;
    creatorHandle: string;
    avatar: string;
    lastMessage: string;
    timestamp: string;
    unread: boolean;
    campaign?: string;
  };
  isActive: boolean;
  onClick: () => void;
  formatTimestamp: (timestamp: string) => string;
}

export function ConversationItem({
  conversation,
  isActive,
  onClick,
  formatTimestamp
}: ConversationItemProps) {
  return (
    <div
      className={`p-3 cursor-pointer hover:bg-white/10 transition-colors 
        ${isActive 
          ? "bg-yellow-500/10 border-l-4 border-yellow-400" 
          : "border-l-4 border-transparent"}`}
      onClick={onClick}
    >
      <div className="flex gap-3 items-center">
        <div className="relative">
          <Avatar>
            <AvatarImage src={conversation.avatar} />
            <AvatarFallback className="bg-white/10 text-white">
              {conversation.creatorName.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          {conversation.unread && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-yellow-400"></span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <span className={`font-medium truncate ${conversation.unread ? "text-white font-semibold" : "text-white/90"}`}>
              {conversation.creatorName}
            </span>
            <span className="text-xs text-white/50">
              {formatTimestamp(conversation.timestamp)}
            </span>
          </div>
          <p className={`text-sm truncate ${conversation.unread ? "text-white/90" : "text-white/70"}`}>
            {conversation.lastMessage}
          </p>
          {conversation.campaign && (
            <Badge className="mt-1 bg-yellow-800/30 text-yellow-300 border-yellow-800/50 text-[9px]">
              {conversation.campaign}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
