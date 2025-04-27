
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ApplicationHeaderProps {
  selectedApplications: number[];
  clearSelection: () => void;
  handleBulkAction: (action: "approve" | "reject" | "discuss") => void;
  handleBulkMessage: () => void;
}

export function ApplicationHeader({
  selectedApplications,
  clearSelection,
  handleBulkAction,
  handleBulkMessage,
}: ApplicationHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <h1 className="text-2xl font-bold font-space">Creator Applications</h1>
      
      <div className="flex flex-wrap gap-2">
        {selectedApplications.length > 0 && (
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
                <DropdownMenuItem onClick={() => handleBulkAction("approve")}>
                  <span className="mr-2 h-4 w-4 text-green-600">✓</span>
                  Approve Selected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("reject")}>
                  <span className="mr-2 h-4 w-4 text-red-600">✗</span>
                  Reject Selected
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("discuss")}>
                  <span className="mr-2 h-4 w-4 text-blue-600">✓</span>
                  Move to Discussion
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleBulkMessage}>
                  Send Message to Selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        <Button 
          size="sm" 
          variant="outline" 
          onClick={clearSelection}
          disabled={selectedApplications.length === 0}
        >
          Clear Selection
        </Button>
      </div>
    </div>
  );
}
