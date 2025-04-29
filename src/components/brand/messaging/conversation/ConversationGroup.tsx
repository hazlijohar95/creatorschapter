
import { ConversationItem } from "./ConversationItem";

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

interface ConversationGroupProps {
  groupName: string;
  conversations: Conversation[];
  activeConversation: string;
  onConversationSelect: (id: string) => void;
  formatTimestamp: (timestamp: string) => string;
}

export function ConversationGroup({
  groupName,
  conversations,
  activeConversation,
  onConversationSelect,
  formatTimestamp
}: ConversationGroupProps) {
  return (
    <div key={groupName}>
      <div className="px-3 py-2 text-xs font-medium text-white/50 border-b border-white/5">
        {groupName}
      </div>
      {conversations.map((conversation) => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isActive={activeConversation === conversation.id}
          onClick={() => onConversationSelect(conversation.id)}
          formatTimestamp={formatTimestamp}
        />
      ))}
    </div>
  );
}
