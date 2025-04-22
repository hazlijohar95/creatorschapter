
import { useState } from "react";
import { Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MessageInputProps {
  conversationId: number;
}

export function MessageInput({ conversationId }: MessageInputProps) {
  const [messageInput, setMessageInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim()) {
      // TODO: Implement actual message sending logic
      console.log(`Sending message to conversation ${conversationId}: ${messageInput}`);
      setMessageInput("");
    }
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
        />
        <Button 
          type="submit" 
          className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 
            border border-yellow-500/30 shadow-sm"
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  );
}
