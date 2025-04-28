
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CalendarEmptyStateProps {
  onCreateClick?: () => void;
}

export function CalendarEmptyState({ onCreateClick }: CalendarEmptyStateProps) {
  return (
    <div className="text-center p-8 border rounded-lg bg-muted/20">
      <h3 className="text-lg font-medium">No campaigns scheduled</h3>
      <p className="text-muted-foreground mt-1 mb-4">
        Create campaigns with start and end dates to see them on the calendar
      </p>
      {onCreateClick && (
        <Button onClick={onCreateClick} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Create Campaign
        </Button>
      )}
    </div>
  );
}
