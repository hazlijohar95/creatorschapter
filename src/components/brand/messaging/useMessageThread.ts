
import { useState, useEffect } from "react";
import { useAuthStore } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { getConversationMessages, markMessagesAsRead } from "@/services/messagingService";

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

export function useMessageThread(conversationId: string) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
        setMessages(messagesData as Message[]);

        if (user) {
          await markMessagesAsRead(conversationId, user.id);
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
        async (payload) => {
          try {
            const { data, error } = await supabase
              .from("profiles")
              .select("full_name, avatar_url")
              .eq("id", payload.new.sender_id)
              .single();
              
            if (error) throw error;
            
            const newMessage = {
              ...payload.new,
              profiles: {
                full_name: data?.full_name || 'Unknown User',
                avatar_url: data?.avatar_url || ''
              }
            } as Message;
            
            setMessages((prev) => [...prev, newMessage]);
            
            if (user && payload.new.receiver_id === user.id) {
              await markMessagesAsRead(conversationId, user.id);
            }
          } catch (error) {
            console.error("Error processing new message:", error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, user]);
  
  return {
    messages,
    loading,
    error,
    typingStatus
  };
}
