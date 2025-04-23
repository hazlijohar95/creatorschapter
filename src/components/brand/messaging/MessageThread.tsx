import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth";
import { useEffect } from "react";

interface MessageThreadProps {
  conversationId: string;
}

export function MessageThread({ conversationId }: MessageThreadProps) {
  const { user } = useAuthStore();

  const { data: messages = [], refetch } = useQuery({
    queryKey: ["messages", conversationId],
    enabled: !!conversationId && !!user,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("id, sender_id, content, created_at")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  useEffect(() => {
    refetch();
  }, [conversationId, refetch]);

  return (
    <>
      <div className="flex items-center p-4 border-b border-white/10 bg-black/50">
        <Avatar className="mr-3">
          <AvatarImage src="" />
          <AvatarFallback className="bg-white/10 text-white">AJ</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold text-base text-white">Conversation</h2>
          <p className="text-xs text-white/50">Brand & Creator</p>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message: any) => (
            <div
              key={message.id}
              className={`w-full flex ${
                message.sender_id === user?.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-3 rounded-xl text-[15px] 
                  ${
                    message.sender_id === user?.id
                      ? "bg-yellow-500/10 text-white border border-yellow-500/20"
                      : "bg-white/5 text-white border border-white/10"
                  }`}
              >
                <p className="break-words">{message.content}</p>
                <p
                  className={`text-xs mt-2 opacity-70 
                    ${
                      message.sender_id === user?.id
                        ? "text-yellow-500/70"
                        : "text-white/50"
                    }`}
                >
                  {message.created_at &&
                    new Date(message.created_at).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  );
}
