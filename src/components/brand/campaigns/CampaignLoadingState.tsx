
import { Briefcase } from "lucide-react";

export function CampaignLoadingState() {
  return (
    <div className="w-full flex items-center justify-center py-10">
      <span className="animate-spin mr-2">
        <Briefcase className="w-5 h-5" />
      </span>
      Loading campaigns...
    </div>
  );
}
