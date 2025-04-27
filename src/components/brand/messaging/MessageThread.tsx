import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { Check, CheckCheck, Clock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/shared/EmptyState";
import { getConversationMessages } from "@/services/messagingService";

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

interface MessageThreadProps {
  conversationId: string;
}

export function MessageThread({ conversationId }: MessageThreadProps) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [typingStatus, setTypingStatus] = useState(false);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!conversationId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const messagesData = await getConversationMessages(conversationId);
        
        const processedMessages = messagesData.map(msg => {
          return {
            ...msg,
            profiles: {
              full_name: msg.profiles?.full_name || 'Unknown User',
              avatar_url: msg.profiles?.avatar_url || ''
            }
          } as Message;
        });
        
        setMessages(processedMessages);

        if (user) {
          await supabase
            .from("messages")
            .update({ read_at: new Date().toISOString() })
            .eq("conversation_id", conversationId)
            .eq("receiver_id", user.id)
            .is("read_at", null);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          supabase
            .from("messages")
            .select(`
              id, 
              content, 
              sender_id, 
              created_at, 
              read_at,
              profiles!sender_id(
                full_name,
                avatar_url
              )
            `)
            .eq("id", payload.new.id)
            .single()
            .then(({ data, error }) => {
              if (data) {
                const newMessage = {
                  ...data,
                  profiles: {
                    full_name: data.profiles?.full_name || 'Unknown User',
                    avatar_url: data.profiles?.avatar_url || ''
                  }
                } as Message;
                
                setMessages((prev) => [...prev, newMessage]);
              } else if (error) {
                console.error("Error fetching new message:", error);
              }
            });

          if (user && payload.new.receiver_id === user.id) {
            supabase
              .from("messages")
              .update({ read_at: new Date().toISOString() })
              .eq("id", payload.new.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current;
      scrollContainer.scrollTop = scrollContainer.scrollHeight;
    }
  }, [messages]);

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, "p");
  };

  const MessageStatus = ({ message }: { message: Message }) => {
    if (message.sender_id !== user?.id) return null;

    if (message.read_at) {
      return <CheckCheck className="h-3 w-3 text-blue-500" />;
    } else {
      return <Check className="h-3 w-3 text-gray-400" />;
    }
  };

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
        {messages.map((message) => {
          const isCurrentUser = message.sender_id === user?.id;

          return (
            <div
              key={message.id}
              className={`flex items-end gap-2 ${
                isCurrentUser ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar className="h-8 w-8 mt-2 flex-shrink-0">
                <AvatarImage src={message.profiles?.avatar_url || ""} />
                <AvatarFallback className="bg-yellow-900">
                  {message.profiles?.full_name
                    ? message.profiles.full_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "?"}
                </AvatarFallback>
              </Avatar>

              <div
                className={`max-w-[80%] flex flex-col ${
                  isCurrentUser ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`rounded-lg px-4 py-2 ${
                    isCurrentUser
                      ? "bg-yellow-600 text-white"
                      : "bg-white/10 text-white"
                  }`}
                >
                  {message.content}
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-white/50">
                  <span>{formatMessageDate(message.created_at)}</span>
                  <MessageStatus message={message} />
                </div>
              </div>
            </div>
          );
        })}

        {typingStatus && (
          <div className="flex items-center gap-2 mt-2">
            <div className="flex space-x-1 px-4 py-2 bg-white/10 rounded-lg">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
