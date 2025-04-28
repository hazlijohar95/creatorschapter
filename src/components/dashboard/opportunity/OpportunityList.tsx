
import { OpportunityCard } from "./OpportunityCard";
import { Button } from "@/components/ui/button";
import { Opportunity, FilterOptions } from "../types/opportunity";

interface OpportunityListProps {
  opportunities: Opportunity[];
  filteredOpportunities: Opportunity[];
  isLoading: boolean;
  onViewOpportunity: (id: string) => void;
  onClearFilters: () => void;
  filters: FilterOptions;
}

export function OpportunityList({
  opportunities,
  filteredOpportunities,
  isLoading,
  onViewOpportunity,
  onClearFilters,
  filters,
}: OpportunityListProps) {
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse border h-[280px] rounded-lg bg-muted/40"
          >
            <div className="h-24 bg-muted rounded-t-lg" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/2" />
              <div className="h-16 bg-muted rounded w-full" />
              <div className="h-8 bg-muted rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredOpportunities.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center mt-8 py-16">
        <span className="text-4xl mb-2">😕</span>
        <h2 className="text-lg font-semibold mb-2">No opportunities found</h2>
        <p className="text-muted-foreground mb-4">
          Try adjusting your search or filters to find more opportunities.
        </p>
        {(filters.search || filters.categories.length > 0) && (
          <Button onClick={onClearFilters}>Clear Filters</Button>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-2">
      {filteredOpportunities.map((opp) => (
        <OpportunityCard
          key={opp.id}
          opportunity={opp}
          onViewOpportunity={onViewOpportunity}
        />
      ))}
    </div>
  );
}
