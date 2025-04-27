
import { RecommendedOpportunities } from "./RecommendedOpportunities";
import { Opportunity, FilterOptions } from "../types/opportunity";
import { OpportunityGridView } from "./OpportunityGridView";

interface OpportunityTabContentProps {
  sortedOpportunities: Opportunity[];
  recommendedOpportunities: Opportunity[];
  isLoading: boolean;
  onViewOpportunity: (id: string) => void;
  filters: FilterOptions;
  resetFilters: () => void;
}

export function OpportunityTabContent({
  sortedOpportunities,
  recommendedOpportunities,
  isLoading,
  onViewOpportunity,
  filters,
  resetFilters,
}: OpportunityTabContentProps) {
  const hasFilters = 
    filters.search !== "" || 
    filters.categories.length > 0 ||
    filters.minBudget !== null ||
    filters.maxBudget !== null ||
    filters.sortBy !== "relevance";

  return (
    <div className="space-y-8">
      {!hasFilters && (
        <RecommendedOpportunities
          opportunities={recommendedOpportunities}
          onViewOpportunity={onViewOpportunity}
        />
      )}

      <div>
        <h2 className="text-lg font-semibold font-space mb-4">
          {hasFilters
            ? "Search Results"
            : "Available Opportunities"}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 pt-2">
          <OpportunityGridView
            opportunities={sortedOpportunities}
            isLoading={isLoading}
            onViewOpportunity={onViewOpportunity}
            hasFilters={hasFilters}
            resetFilters={resetFilters}
          />
        </div>
      </div>
    </div>
  );
}
