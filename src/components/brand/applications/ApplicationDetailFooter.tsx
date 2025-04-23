
import { Button } from "@/components/ui/button";
import { X, MessageSquare, Check } from "lucide-react";

interface Props {
  status: "pending" | "approved" | "rejected" | "in_discussion";
  onReject: () => void;
  onDiscuss: () => void;
  onApprove: () => void;
}

export function ApplicationDetailFooter({
  status,
  onReject,
  onDiscuss,
  onApprove
}: Props) {
  if (status !== "pending") return null;

  return (
    <>
      <Button
        variant="outline"
        className="flex-1 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800 hover:border-red-300"
        onClick={onReject}
      >
        <X className="mr-1 h-4 w-4" /> Reject
      </Button>
      <Button
        variant="outline"
        className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-300"
        onClick={onDiscuss}
      >
        <MessageSquare className="mr-1 h-4 w-4" /> Move to Discussion
      </Button>
      <Button
        variant="outline"
        className="flex-1 border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800 hover:border-green-300"
        onClick={onApprove}
      >
        <Check className="mr-1 h-4 w-4" /> Approve
      </Button>
    </>
  );
}
