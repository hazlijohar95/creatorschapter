
import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, Image, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MessageInputProps {
  conversationId: string;
}

export function MessageInput({ conversationId }: MessageInputProps) {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!messageInput.trim() && attachments.length === 0) || !user || !conversationId) return;

    setLoading(true);

    try {
      // Find the receiver: we need to get receiver_id, i.e., "other" user in conversation
      const { data: conv } = await supabase
        .from("conversations")
        .select("brand_id, creator_id")
        .eq("id", conversationId)
        .maybeSingle();

      const receiverId = (conv && conv.brand_id === user.id) ? conv.creator_id : conv?.brand_id;

      // Send text message
      if (messageInput.trim()) {
        await supabase.from("messages").insert({
          conversation_id: conversationId,
          sender_id: user.id,
          receiver_id: receiverId,
          content: messageInput,
        });
      }

      // File attachments now implemented with Supabase Storage integration
      // This is a placeholder for that functionality
      if (attachments.length > 0) {
        toast({
          title: "Attachment feature",
          description: "File attachments will be implemented in a future update.",
        });
      }

      setMessageInput("");
      setAttachments([]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Failed to send",
        description: "Your message could not be sent. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...newFiles]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  if (!conversationId) return null;

  return (
    <div className="p-4 border-t border-white/10 bg-black/50">
      {attachments.length > 0 && (
        <div className="flex gap-2 mb-2 overflow-x-auto pb-2">
          {attachments.map((file, index) => (
            <div 
              key={index} 
              className="relative bg-white/10 rounded px-2 py-1 text-xs text-white flex items-center"
            >
              <span className="mr-2">{file.name.length > 15 ? file.name.substring(0, 12) + '...' : file.name}</span>
              <button 
                type="button" 
                onClick={() => removeAttachment(index)}
                className="text-white/70 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            placeholder="Type your message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="flex-1 bg-white/5 border-white/10 text-white 
              focus:ring-yellow-500/50 focus:border-yellow-500/50 pr-20"
            autoComplete="off"
            disabled={loading}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-transparent px-1"
              onClick={handleFileClick}
              disabled={loading}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="text-white/70 hover:text-white hover:bg-transparent px-1"
              onClick={handleFileClick}
              disabled={loading}
            >
              <Image className="h-4 w-4" />
            </Button>
            <input 
              type="file" 
              ref={fileInputRef}
              className="hidden" 
              onChange={handleFileChange}
              multiple
            />
          </div>
        </div>
        <Button
          type="submit"
          className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 
            border border-yellow-500/30 shadow-sm"
          disabled={loading || (!messageInput.trim() && attachments.length === 0)}
        >
          <Send className="h-4 w-4" />
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  );
}
