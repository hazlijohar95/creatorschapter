import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface MessageInputProps {
  conversationId: string;
}

export function MessageInput({ conversationId }: MessageInputProps) {
  const { user } = useAuthStore();
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !user) return;

    setLoading(true);

    // Find the receiver: we need to get receiver_id, i.e., "other" user in conversation
    const { data: conv } = await supabase
      .from("conversations")
      .select("brand_id, creator_id")
      .eq("id", conversationId)
      .maybeSingle();

    let receiverId =
      (conv && conv.brand_id === user.id) ? conv.creator_id : conv?.brand_id;

    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      receiver_id: receiverId,
      content: messageInput,
    });

    setMessageInput("");
    setLoading(false);
  };

  return (
    <div className="p-4 border-t border-white/10 bg-black/50">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder="Type your message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          className="flex-1 bg-white/5 border-white/10 text-white 
            focus:ring-yellow-500/50 focus:border-yellow-500/50"
          autoComplete="off"
          disabled={loading}
        />
        <Button
          type="submit"
          className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 
            border border-yellow-500/30 shadow-sm"
          disabled={loading}
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  );
}
