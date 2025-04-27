
import { SortAsc } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SortSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px] bg-white border-gray-200">
        <div className="flex items-center gap-2">
          <SortAsc className="h-4 w-4" />
          <SelectValue placeholder="Sort by" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">Newest First</SelectItem>
        <SelectItem value="highestMatch">Highest Match</SelectItem>
        <SelectItem value="largestAudience">Largest Audience</SelectItem>
        <SelectItem value="highestEngagement">Highest Engagement</SelectItem>
      </SelectContent>
    </Select>
  );
}
