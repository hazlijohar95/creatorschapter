
import { useState } from "react";
import { useConversations } from "./messaging/useConversations";
import { useActiveConversation } from "./messaging/useActiveConversation";
import { ConversationList } from "./messaging/ConversationList";
import { MessageThread } from "./messaging/MessageThread";
import { MessageInput } from "./messaging/MessageInput";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { MessageSquare } from "lucide-react";

export function BrandMessaging() {
  const { conversations, loading: conversationsLoading, error } = useConversations();
  const { activeConversation, setActiveConversation } = useActiveConversation(conversations);
  
  const [chatAreaVisible, setChatAreaVisible] = useState(true);
  
  if (error) {
    return (
      <div className="h-[calc(100vh-64px)] flex items-center justify-center bg-black text-white">
        <div className="text-center p-6">
          <div className="text-red-400 mb-2">Error loading conversations</div>
          <div className="text-white/60">{error.message}</div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-[calc(100vh-64px)] flex bg-black text-white">
      <ConversationList
        conversations={conversations}
        activeConversation={activeConversation}
        onConversationSelect={(id) => {
          setActiveConversation(id);
          setChatAreaVisible(true);
        }}
        isLoading={conversationsLoading}
      />
      
      <div className={`flex-1 flex flex-col border-l border-white/10 bg-black ${!chatAreaVisible ? 'hidden md:flex' : 'flex'}`}>
        {activeConversation ? (
          <>
            <MessageThread conversationId={activeConversation} />
            <MessageInput conversationId={activeConversation} />
          </>
        ) : (
          <EmptyState
            icon={<MessageSquare className="w-12 h-12 text-white/30" />}
            title="No conversation selected"
            description="Select a conversation from the list or start a new one"
            action={{
              label: "Find Creators",
              onClick: () => window.location.href = "/brand-dashboard/creators"
            }}
          />
        )}
      </div>
    </div>
  );
}

export default BrandMessaging;
