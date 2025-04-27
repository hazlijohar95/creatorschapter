
import { useState, useEffect } from "react";
import { Conversation } from "./useConversations";

export function useActiveConversation(conversations: Conversation[]) {
  const [activeConversation, setActiveConversation] = useState<string>("");
  
  // Select the first conversation with unread messages, or the first conversation
  useEffect(() => {
    if (conversations.length > 0 && !activeConversation) {
      const unreadConversation = conversations.find(c => c.unread);
      setActiveConversation(unreadConversation?.id || conversations[0].id);
    }
    // If the active conversation is no longer in the list, reset it
    else if (conversations.length > 0 && !conversations.some(c => c.id === activeConversation)) {
      setActiveConversation(conversations[0].id);
    }
    // If there are no conversations, reset active conversation
    else if (conversations.length === 0) {
      setActiveConversation("");
    }
  }, [conversations, activeConversation]);

  return { activeConversation, setActiveConversation };
}
