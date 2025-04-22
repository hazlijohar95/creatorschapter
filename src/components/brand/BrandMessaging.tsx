
import { useState } from "react";
import { ConversationList } from "./messaging/ConversationList";
import { MessageThread } from "./messaging/MessageThread";
import { MessageInput } from "./messaging/MessageInput";

export function BrandMessaging() {
  const [activeConversation, setActiveConversation] = useState(1);

  return (
    <div className="h-[calc(100vh-64px)] flex bg-black text-white">
      <ConversationList 
        activeConversation={activeConversation} 
        onConversationSelect={setActiveConversation} 
      />
      <div className="flex-1 flex flex-col border-l border-white/10">
        <MessageThread conversationId={activeConversation} />
        <MessageInput conversationId={activeConversation} />
      </div>
    </div>
  );
}
