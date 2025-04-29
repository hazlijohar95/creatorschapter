
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { MessageList } from "./message/MessageList";
import { useMessageThread } from "./useMessageThread";
import { EmptyState } from "@/components/shared/EmptyState";

interface MessageThreadProps {
  conversationId: string;
}

export function MessageThread({ conversationId }: MessageThreadProps) {
  const { messages, loading, error, typingStatus } = useMessageThread(conversationId);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <MessageList 
      messages={messages}
      conversationId={conversationId}
      typingStatus={typingStatus}
    />
  );
}
