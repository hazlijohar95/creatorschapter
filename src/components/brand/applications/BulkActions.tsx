
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronDown, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BulkActionsProps {
  selectedApplications: number[];
  onBulkAction: (action: "approve" | "reject" | "discuss") => void;
  onBulkMessage: () => void;
  onClearSelection: () => void;
}

export function BulkActions({
  selectedApplications,
  onBulkAction,
  onBulkMessage,
  onClearSelection,
}: BulkActionsProps) {
  if (selectedApplications.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline" className="bg-muted">
        {selectedApplications.length} selected
      </Badge>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="outline" className="flex items-center gap-1">
            Bulk Actions <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onBulkAction("approve")}>
            <Check className="mr-2 h-4 w-4 text-green-600" />
            Approve Selected
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onBulkAction("reject")}>
            <X className="mr-2 h-4 w-4 text-red-600" />
            Reject Selected
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onBulkAction("discuss")}>
            <Check className="mr-2 h-4 w-4 text-blue-600" />
            Move to Discussion
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onBulkMessage}>
            Send Message to Selected
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onClearSelection}
      >
        Clear Selection
      </Button>
    </div>
  );
}
