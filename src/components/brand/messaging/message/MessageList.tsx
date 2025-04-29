
import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import { EmptyState } from "@/components/shared/EmptyState";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  read_at: string | null;
  profiles: {
    full_name: string;
    avatar_url: string;
  };
}

interface MessageListProps {
  messages: Message[];
  conversationId: string;
  typingStatus: boolean;
}

export function MessageList({ messages, conversationId, typingStatus }: MessageListProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);
  
  if (!conversationId) {
    return (
      <EmptyState
        icon="💬"
        title="No conversation selected"
        description="Select a conversation to start messaging"
      />
    );
  }
  
  if (messages.length === 0) {
    return (
      <EmptyState
        icon="✉️"
        title="No messages yet"
        description="Start the conversation by sending a message"
      />
    );
  }
  
  return (
    <ScrollArea
      ref={scrollAreaRef}
      className="flex-1 p-4 bg-black/90 overflow-y-auto"
    >
      <div className="flex flex-col space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {typingStatus && <TypingIndicator />}
      </div>
    </ScrollArea>
  );
}
