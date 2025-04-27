
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CampaignFilterProps {
  value: string;
  onChange: (value: string) => void;
  availableCampaigns: string[];
}

export function CampaignFilter({ value, onChange, availableCampaigns }: CampaignFilterProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Campaign</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select campaign" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Campaigns</SelectItem>
          {availableCampaigns.map((campaign) => (
            <SelectItem key={campaign} value={campaign}>{campaign}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
