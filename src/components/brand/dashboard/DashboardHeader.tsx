
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

interface DashboardHeaderProps {
  onCreateCampaign: () => void;
  onViewApplications: () => void;
  showApplicationsButton: boolean;
}

export function DashboardHeader({ 
  onCreateCampaign, 
  onViewApplications, 
  showApplicationsButton 
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <h1 className="text-2xl font-bold">Brand Dashboard</h1>
      <div className="flex gap-2">
        <Button 
          variant="default" 
          onClick={onCreateCampaign}
          size="sm"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Campaign
        </Button>
        {showApplicationsButton && (
          <Button 
            variant="outline" 
            onClick={onViewApplications}
            size="sm"
          >
            View Applications
          </Button>
        )}
      </div>
    </div>
  );
}
