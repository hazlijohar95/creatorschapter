
import { Button } from "@/components/ui/button";
import { Grid3X3, Calendar, Plus } from "lucide-react";

interface CampaignHeaderProps {
  onCreateClick: () => void;
  view: "list" | "calendar";
  onViewChange: (view: "list" | "calendar") => void;
}

export function CampaignHeader({ onCreateClick, view, onViewChange }: CampaignHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <h1 className="text-2xl font-bold">Campaign Management</h1>
      <div className="flex gap-2">
        <div className="flex rounded-md overflow-hidden border">
          <Button 
            variant={view === "list" ? "default" : "outline"} 
            onClick={() => onViewChange("list")}
            className="rounded-none"
          >
            <Grid3X3 className="mr-2 h-4 w-4" />
            List
          </Button>
          <Button 
            variant={view === "calendar" ? "default" : "outline"}
            onClick={() => onViewChange("calendar")}
            className="rounded-none"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Calendar
          </Button>
        </div>
        <Button onClick={onCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
        </Button>
      </div>
    </div>
  );
}
