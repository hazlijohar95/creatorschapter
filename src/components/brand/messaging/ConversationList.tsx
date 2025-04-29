
import { ScrollArea } from "@/components/ui/scroll-area";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { ConversationFilter } from "./conversation/ConversationFilter";
import { ConversationGroup } from "./conversation/ConversationGroup";
import { ConversationHeader } from "./conversation/ConversationHeader";
import { ConversationFooter } from "./conversation/ConversationFooter";
import { ConversationEmpty } from "./conversation/ConversationEmpty";
import { useConversationFilters } from "./hooks/useConversationFilters";

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
  const {
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    groupedConversations,
    formatConversationTimestamp
  } = useConversationFilters(conversations);
  
  return (
    <div className="w-80 bg-black/90 border-r border-white/10 flex flex-col h-full">
      <ConversationHeader title="Messages" />
      
      <ConversationFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filter={filter}
        onFilterChange={setFilter}
      />
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="sm" className="text-yellow-500" />
        </div>
      ) : (
        <ScrollArea className="flex-1">
          {Object.entries(groupedConversations).map(([groupName, groupConversations]) => (
            <ConversationGroup
              key={groupName}
              groupName={groupName}
              conversations={groupConversations}
              activeConversation={activeConversation}
              onConversationSelect={onConversationSelect}
              formatTimestamp={formatConversationTimestamp}
            />
          ))}
          
          {Object.keys(groupedConversations).length === 0 && (
            <ConversationEmpty 
              searchTerm={searchTerm} 
              filter={filter}
            />
          )}
        </ScrollArea>
      )}
      
      <ConversationFooter onArchiveClick={() => console.log("Archive clicked")} />
    </div>
  );
}
