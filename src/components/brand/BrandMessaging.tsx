import { ConversationList } from "./messaging/ConversationList";
import { MessageThread } from "./messaging/MessageThread";
import { MessageInput } from "./messaging/MessageInput";
import { useActiveConversation } from "./messaging/useActiveConversation";
import { useConversations } from "./messaging/useConversations";

export function BrandMessaging() {
  const { conversations } = useConversations();
  const { activeConversation, setActiveConversation } = useActiveConversation(conversations);

  return (
    <div className="h-[calc(100vh-64px)] flex bg-black text-white">
      <ConversationList
        conversations={conversations}
        activeConversation={activeConversation}
        onConversationSelect={setActiveConversation}
      />
      <div className="flex-1 flex flex-col border-l border-white/10 bg-black">
        <MessageThread conversationId={activeConversation} />
        <MessageInput conversationId={activeConversation} />
      </div>
    </div>
  );
}
