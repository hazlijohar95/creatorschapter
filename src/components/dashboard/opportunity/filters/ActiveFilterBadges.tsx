
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilterOptions } from "@/components/dashboard/types/opportunity";

interface ActiveFilterBadgesProps {
  filters: FilterOptions;
  totalOpportunities: number;
  filteredCount: number;
  onRemoveCategory: (category: string) => void;
  onResetSort: () => void;
  onResetAll: () => void;
}

export function ActiveFilterBadges({
  filters,
  totalOpportunities,
  filteredCount,
  onRemoveCategory,
  onResetSort,
  onResetAll,
}: ActiveFilterBadgesProps) {
  const hasActiveFilters = 
    filters.categories.length > 0 || 
    filters.minBudget !== null || 
    filters.maxBudget !== null || 
    filters.sortBy !== "relevance" ||
    filters.search;

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {filteredCount < totalOpportunities && (
        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100">
          Showing {filteredCount} of {totalOpportunities} opportunities
        </Badge>
      )}
      
      {filters.categories.map((category) => (
        <Badge
          key={category}
          variant="outline"
          className="bg-gray-50 border border-gray-200 gap-1"
        >
          {category}
          <button
            className="ml-1 text-muted-foreground hover:text-gray-900"
            onClick={() => onRemoveCategory(category)}
          >
            ×
          </button>
        </Badge>
      ))}
      
      {filters.sortBy !== "relevance" && (
        <Badge
          variant="outline"
          className="bg-gray-50 border border-gray-200 gap-1"
        >
          Sort: {filters.sortBy === "budget" ? "Highest Paying" : 
                filters.sortBy === "newest" ? "Newest" : "Most Relevant"}
          <button
            className="ml-1 text-muted-foreground hover:text-gray-900"
            onClick={onResetSort}
          >
            ×
          </button>
        </Badge>
      )}
      
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-xs"
          onClick={onResetAll}
        >
          Clear All
        </Button>
      )}
    </div>
  );
}
