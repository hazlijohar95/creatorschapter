
import { useState, useMemo } from "react";
import { format, isToday, isYesterday, isThisWeek } from "date-fns";

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

export function useConversationFilters(conversations: Conversation[]) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "unread" | "archived">("all");
  
  // Filter conversations based on search term and filter
  const filteredConversations = useMemo(() => {
    return conversations.filter((c) => {
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
        filter === "archived" ? false : 
        true;
        
      return matchesSearch && matchesFilter;
    });
  }, [conversations, searchTerm, filter]);

  // Group by date for better organization
  const groupedConversations = useMemo(() => {
    return filteredConversations.reduce<Record<string, Conversation[]>>(
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
  }, [filteredConversations]);
  
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

  return {
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    filteredConversations,
    groupedConversations,
    formatConversationTimestamp
  };
}
