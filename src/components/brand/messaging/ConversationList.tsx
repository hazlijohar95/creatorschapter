import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data (to be replaced with actual data fetching)
const CONVERSATIONS = [
  {
    id: 1,
    creatorName: "Alex Johnson",
    creatorHandle: "@alexcreates",
    avatar: "",
    lastMessage: "When do you need the content by?",
    timestamp: "10:25 AM",
    unread: true,
  },
  {
    id: 2,
    creatorName: "Jamie Smith",
    creatorHandle: "@jamiesmith",
    avatar: "",
    lastMessage: "I'll send you the draft tomorrow",
    timestamp: "Yesterday",
    unread: false,
  },
  {
    id: 3,
    creatorName: "Taylor Wilson",
    creatorHandle: "@taylorwilson",
    avatar: "",
    lastMessage: "Thanks for the opportunity!",
    timestamp: "May 20",
    unread: false,
  },
];

interface ConversationListProps {
  activeConversation: number;
  onConversationSelect: (id: number) => void;
}

export function ConversationList({ 
  activeConversation, 
  onConversationSelect 
}: ConversationListProps) {
  const [searchTerm, setSearchTerm] = useState("");

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
        {CONVERSATIONS.map((conversation) => (
          <div
            key={conversation.id}
            className={`p-3 cursor-pointer hover:bg-white/5 transition-colors 
              ${activeConversation === conversation.id 
                ? "bg-yellow-500/10" 
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
                  <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-yellow-500"></span>
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
      </ScrollArea>
    </div>
  );
}
