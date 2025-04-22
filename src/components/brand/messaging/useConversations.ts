
import { useState } from "react";

// In the future, replace this with an actual data fetching hook (React Query, SWR, etc)
const INITIAL_CONVERSATIONS = [
  {
    id: 1,
    creatorName: "Alex Johnson",
    creatorHandle: "@alexcreates",
    avatar: "",
    lastMessage: "When do you need the content by?",
    timestamp: "10:25 AM",
    unread: true,
  },
  {
    id: 2,
    creatorName: "Jamie Smith",
    creatorHandle: "@jamiesmith",
    avatar: "",
    lastMessage: "I'll send you the draft tomorrow",
    timestamp: "Yesterday",
    unread: false,
  },
  {
    id: 3,
    creatorName: "Taylor Wilson",
    creatorHandle: "@taylorwilson",
    avatar: "",
    lastMessage: "Thanks for the opportunity!",
    timestamp: "May 20",
    unread: false,
  },
];

export function useConversations() {
  const [conversations] = useState(INITIAL_CONVERSATIONS);
  // Add loading/error states if implementing actual fetching
  return { conversations };
}
