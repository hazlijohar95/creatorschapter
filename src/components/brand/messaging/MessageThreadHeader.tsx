
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface MessageThreadHeaderProps {
  conversationName?: string;
  avatarUrl?: string;
  isOnline?: boolean;
}

export function MessageThreadHeader({ 
  conversationName = "No conversation selected", 
  avatarUrl = "", 
  isOnline = false 
}: MessageThreadHeaderProps) {
  return (
    <div className="flex items-center gap-2 p-4 border-b border-white/10">
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarUrl} alt={conversationName} />
        <AvatarFallback className="bg-white/10 text-white">
          {conversationName.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <h3 className="font-medium text-white">{conversationName}</h3>
      </div>
      
      {isOnline && (
        <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
      )}
    </div>
  );
}
