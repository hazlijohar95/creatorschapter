
import { useState } from "react";
import { Search, Archive, Check, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

interface Conversation {
  id: string;
  creatorName: string;
  creatorHandle: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  campaign?: string;
}

interface ConversationListProps {
  conversations: Conversation[];
  activeConversation: string;
  onConversationSelect: (id: string) => void;
  isLoading?: boolean;
}

export function ConversationList({
  conversations,
  activeConversation,
  onConversationSelect,
  isLoading = false,
}: ConversationListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "archived">("all");
  
  // Filter conversations based on search term and filter
  const filtered = conversations.filter(
    (c) => {
      // Apply search filter
      const matchesSearch = searchTerm 
        ? c.creatorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.creatorHandle.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (c.campaign && c.campaign.toLowerCase().includes(searchTerm.toLowerCase()))
        : true;
        
      // Apply status filter
      const matchesFilter = 
        filter === "all" ? true :
        filter === "unread" ? c.unread :
        // For archived, we would need to add this data to the model
        filter === "archived" ? false : 
        true;
        
      return matchesSearch && matchesFilter;
    }
  );

  // Group by date for better organization
  const groupedConversations = filtered.reduce<Record<string, Conversation[]>>(
    (groups, conversation) => {
      const date = new Date(conversation.timestamp);
      let groupName: string;
      
      if (isToday(date)) {
        groupName = "Today";
      } else if (isYesterday(date)) {
        groupName = "Yesterday";
      } else if (isThisWeek(date)) {
        groupName = "This Week";
      } else {
        groupName = "Earlier";
      }
      
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      
      groups[groupName].push(conversation);
      return groups;
    },
    {}
  );
  
  const formatConversationTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return format(date, "p"); // 12:00 AM/PM
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else if (isThisWeek(date)) {
      return format(date, "EEE"); // Mon, Tue, etc.
    }
    return format(date, "MMM d"); // Jan 1
  };

  return (
    <div className="w-80 bg-black/90 border-r border-white/10 flex flex-col h-full">
      <div className="p-4 border-b border-white/10">
        <h1 className="text-xl font-bold text-white">Messages</h1>
      </div>
      <div className="p-2 space-y-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-white/50" />
          <Input
            placeholder="Search conversations..."
            className="pl-8 bg-black/50 border-white/10 text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex justify-between items-center">
          <div className="flex space-x-1">
            <Button 
              size="sm" 
              variant={filter === "all" ? "default" : "ghost"}
              onClick={() => setFilter("all")}
              className={filter === "all" ? "bg-yellow-600 text-white" : "text-white/70"}
            >
              All
            </Button>
            <Button 
              size="sm" 
              variant={filter === "unread" ? "default" : "ghost"}
              onClick={() => setFilter("unread")}
              className={filter === "unread" ? "bg-yellow-600 text-white" : "text-white/70"}
            >
              Unread
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost" className="text-white/70">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 text-white border-white/20">
              <DropdownMenuItem onClick={() => setFilter("all")}>
                <Check className={`h-4 w-4 mr-2 ${filter === "all" ? "opacity-100" : "opacity-0"}`} />
                All Messages
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("unread")}>
                <Check className={`h-4 w-4 mr-2 ${filter === "unread" ? "opacity-100" : "opacity-0"}`} />
                Unread
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("archived")}>
                <Check className={`h-4 w-4 mr-2 ${filter === "archived" ? "opacity-100" : "opacity-0"}`} />
                Archived
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="sm" className="text-yellow-500" />
        </div>
      ) : (
        <ScrollArea className="flex-1">
          {Object.entries(groupedConversations).map(([groupName, groupConversations]) => (
            <div key={groupName}>
              <div className="px-3 py-2 text-xs font-medium text-white/50 border-b border-white/5">
                {groupName}
              </div>
              {groupConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-3 cursor-pointer hover:bg-white/10 transition-colors 
                    ${activeConversation === conversation.id 
                      ? "bg-yellow-500/10 border-l-4 border-yellow-400" 
                      : "border-l-4 border-transparent"}`}
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
                        <span className={`font-medium truncate ${conversation.unread ? "text-white font-semibold" : "text-white/90"}`}>
                          {conversation.creatorName}
                        </span>
                        <span className="text-xs text-white/50">
                          {formatConversationTimestamp(conversation.timestamp)}
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
              ))}
            </div>
          ))}
          
          {filtered.length === 0 && (
            <div className="px-4 py-10 text-sm text-white/60 text-center">
              {searchTerm ? 
                `No conversations found matching "${searchTerm}"` : 
                filter !== "all" ? 
                  `No ${filter} conversations found` : 
                  "No conversations found."}
            </div>
          )}
        </ScrollArea>
      )}
      
      <div className="p-2 border-t border-white/10">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white/70 w-full justify-start"
        >
          <Archive className="h-4 w-4 mr-2" />
          Archived Messages
        </Button>
      </div>
    </div>
  );
}
