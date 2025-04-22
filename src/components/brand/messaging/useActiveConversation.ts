import { useState } from "react";

interface Conversation {
  id: number;
  // ...other fields but we only care about the id here
}

export function useActiveConversation(conversations: Conversation[]) {
  // Default to first conversation if available, otherwise 0
  const [activeConversation, setActiveConversation] = useState(
    conversations.length > 0 ? conversations[0].id : 0
  );

  // When conversations update, if current active is no longer present, fallback to first
  // (could be improved if used with async data)
  // For now, the list is static, so this is sufficient.

  return {
    activeConversation,
    setActiveConversation,
  };
}
