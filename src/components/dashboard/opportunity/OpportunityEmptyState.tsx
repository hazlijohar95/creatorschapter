
import { Button } from "@/components/ui/button";
import { FilterOptions } from "../types/opportunity";

interface OpportunityEmptyStateProps {
  hasFilters: boolean;
  resetFilters: () => void;
}

export function OpportunityEmptyState({ hasFilters, resetFilters }: OpportunityEmptyStateProps) {
  return (
    <div className="col-span-full flex flex-col items-center mt-8 py-16">
      <span className="text-4xl mb-2">😕</span>
      <h2 className="text-lg font-semibold mb-2">No opportunities found</h2>
      <p className="text-muted-foreground mb-4">
        Try adjusting your search or filters to find more opportunities.
      </p>
      {hasFilters && (
        <Button onClick={resetFilters}>
          Clear Filters
        </Button>
      )}
    </div>
  );
}
