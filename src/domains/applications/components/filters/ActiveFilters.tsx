
import { Badge } from "@/components/ui/badge";

interface ActiveFiltersProps {
  campaign: string;
  minMatch: number;
  maxMatch: number;
  onClearCampaign: () => void;
  onClearMatchRange: () => void;
}

export function ActiveFilters({
  campaign,
  minMatch,
  maxMatch,
  onClearCampaign,
  onClearMatchRange,
}: ActiveFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {campaign !== "all" && (
        <Badge variant="outline" className="bg-gray-50 border border-gray-200 gap-1">
          Campaign: {campaign}
          <button
            className="ml-1 text-muted-foreground hover:text-gray-900"
            onClick={onClearCampaign}
          >
            ×
          </button>
        </Badge>
      )}
      
      {(minMatch > 0 || maxMatch < 100) && (
        <Badge variant="outline" className="bg-gray-50 border border-gray-200 gap-1">
          Match: {minMatch}% - {maxMatch}%
          <button
            className="ml-1 text-muted-foreground hover:text-gray-900"
            onClick={onClearMatchRange}
          >
            ×
          </button>
        </Badge>
      )}
    </div>
  );
}
