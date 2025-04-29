
import { useState } from "react";
import { useConversations } from "./useConversations";
import { useActiveConversation } from "./useActiveConversation";

export function useMessagingState() {
  const { conversations, loading: conversationsLoading, error } = useConversations();
  const { activeConversation, setActiveConversation } = useActiveConversation(conversations);
  const [chatAreaVisible, setChatAreaVisible] = useState(true);
  
  return {
    conversations,
    loading: conversationsLoading,
    error,
    activeConversation,
    setActiveConversation,
    chatAreaVisible,
    setChatAreaVisible
  };
}
