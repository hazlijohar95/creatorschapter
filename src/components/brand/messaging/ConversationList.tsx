import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Conversation {
  id: string;
  creatorName: string;
  creatorHandle: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
}

interface ConversationListProps {
  conversations: Conversation[];
  activeConversation: string;
  onConversationSelect: (id: string) => void;
}

export function ConversationList({
  conversations,
  activeConversation,
  onConversationSelect
}: ConversationListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filtered = searchTerm
    ? conversations.filter(
        (c) =>
          c.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.creatorHandle.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : conversations;

  return (
    <div className="w-80 bg-black/90 border-r border-white/10 flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h1 className="text-xl font-bold text-white">Messages</h1>
      </div>
      <div className="p-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
          <Input
            placeholder="Search conversations..."
            className="pl-8 bg-black/50 border-white/10 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        {filtered.map((conversation) => (
          <div
            key={conversation.id}
            className={`p-3 cursor-pointer hover:bg-white/10 transition-colors 
              ${activeConversation === conversation.id 
                ? "bg-yellow-500/10 border-l-4 border-yellow-400" 
                : ""}`}
            onClick={() => onConversationSelect(conversation.id)}
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
                  <span className="font-medium truncate text-white">{conversation.creatorName}</span>
                  <span className="text-xs text-white/50">{conversation.timestamp}</span>
                </div>
                <p className="text-sm text-white/70 truncate">{conversation.lastMessage}</p>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="px-4 py-10 text-sm text-white/60 text-center">
            No conversations found.
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
