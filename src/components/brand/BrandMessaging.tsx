
import { useMessagingState } from "./messaging/useMessagingState";
import { ConversationList } from "./messaging/ConversationList";
import { MessageThread } from "./messaging/MessageThread";
import { MessageInput } from "./messaging/MessageInput";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { MessageEmptyState } from "./messaging/MessageEmptyState";
import { MessageThreadHeader } from "./messaging/MessageThreadHeader";

export function BrandMessaging() {
  const {
    conversations,
    loading,
    error,
    activeConversation,
    setActiveConversation,
    chatAreaVisible,
    setChatAreaVisible
  } = useMessagingState();
  
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
  
  // Find the active conversation data if available
  const activeConversationData = activeConversation 
    ? conversations.find(c => c.id === activeConversation) 
    : undefined;
  
  return (
    <div className="h-[calc(100vh-64px)] flex bg-black text-white">
      <ConversationList
        conversations={conversations}
        activeConversation={activeConversation}
        onConversationSelect={(id) => {
          setActiveConversation(id);
          setChatAreaVisible(true);
        }}
        isLoading={loading}
      />
      
      <div className={`flex-1 flex flex-col border-l border-white/10 bg-black ${!chatAreaVisible ? 'hidden md:flex' : 'flex'}`}>
        {activeConversation && (
          <>
            <MessageThreadHeader 
              conversationName={activeConversationData?.creatorName || "Conversation"}
              avatarUrl={activeConversationData?.avatar || ""}
            />
            <MessageThread conversationId={activeConversation} />
            <MessageInput conversationId={activeConversation} />
          </>
        )}

        {!activeConversation && (
          <MessageEmptyState
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
