
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CampaignEmptyStateProps {
  activeTab: string;
  onCreateClick: () => void;
}

export function CampaignEmptyState({ activeTab, onCreateClick }: CampaignEmptyStateProps) {
  return (
    <div className="text-muted-foreground text-center py-8 italic border rounded-lg p-6">
      No campaigns found{activeTab !== "all" ? ` for "${activeTab}"` : ""}.
      <div className="mt-4">
        <Button onClick={onCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          Create Your First Campaign
        </Button>
      </div>
    </div>
  );
}
