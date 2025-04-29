
import { MessageSquare } from "lucide-react";
import { EmptyState } from "@/components/shared/EmptyState";

interface MessageEmptyStateProps {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function MessageEmptyState({
  title = "No conversation selected",
  description = "Select a conversation from the list or start a new one",
  action
}: MessageEmptyStateProps) {
  return (
    <EmptyState
      icon={<MessageSquare className="w-12 h-12 text-white/30" />}
      title={title}
      description={description}
      action={action}
    />
  );
}
