
import { Badge } from "@/components/ui/badge";
import { SortAsc } from "lucide-react";
import { SortByOption } from "@/components/dashboard/types/opportunity";

interface SortOptionsProps {
  selectedSort: SortByOption;
  onSortChange: (sort: SortByOption) => void;
}

export function SortOptions({ selectedSort, onSortChange }: SortOptionsProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium flex items-center gap-2">
        <SortAsc className="h-4 w-4" /> Sort By
      </h4>
      <div className="flex flex-wrap gap-1">
        <Badge
          variant={selectedSort === "relevance" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => onSortChange("relevance")}
        >
          Most Relevant
        </Badge>
        <Badge
          variant={selectedSort === "newest" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => onSortChange("newest")}
        >
          Newest
        </Badge>
        <Badge
          variant={selectedSort === "budget" ? "default" : "outline"}
          className="cursor-pointer"
          onClick={() => onSortChange("budget")}
        >
          Highest Paying
        </Badge>
      </div>
    </div>
  );
}
