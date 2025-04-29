
import { Archive } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ConversationFooterProps {
  onArchiveClick: () => void;
}

export function ConversationFooter({ onArchiveClick }: ConversationFooterProps) {
  return (
    <div className="p-2 border-t border-white/10">
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-white/70 w-full justify-start"
        onClick={onArchiveClick}
      >
        <Archive className="h-4 w-4 mr-2" />
        Archived Messages
      </Button>
    </div>
  );
}
