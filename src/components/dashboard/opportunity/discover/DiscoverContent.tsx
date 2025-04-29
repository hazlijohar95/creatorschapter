
import { Opportunity, FilterOptions } from "../../types/opportunity";
import { OpportunityFilters } from "../OpportunityFilters";
import { RecommendedOpportunities } from "../RecommendedOpportunities";
import { OpportunityList } from "../OpportunityList";

interface DiscoverContentProps {
  opportunities: Opportunity[];
  filteredOpportunities: Opportunity[];
  recommendedOpportunities: Opportunity[];
  isLoading: boolean;
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onViewOpportunity: (id: string) => void;
  onClearFilters: () => void;
}

export function DiscoverContent({
  opportunities,
  filteredOpportunities,
  recommendedOpportunities,
  isLoading,
  filters,
  onFilterChange,
  onViewOpportunity,
  onClearFilters,
}: DiscoverContentProps) {
  return (
    <div className="space-y-8">
      <OpportunityFilters
        filters={filters}
        onFilterChange={onFilterChange}
        totalOpportunities={opportunities.length}
        filteredCount={filteredOpportunities.length}
      />

      {filters.search === "" && filters.categories.length === 0 && (
        <RecommendedOpportunities
          opportunities={recommendedOpportunities}
          onViewOpportunity={onViewOpportunity}
        />
      )}

      <div>
        <h2 className="text-lg font-semibold font-space mb-4">
          {filters.search || filters.categories.length > 0
            ? "Search Results"
            : "Available Opportunities"}
        </h2>
        <OpportunityList
          opportunities={opportunities}
          filteredOpportunities={filteredOpportunities}
          isLoading={isLoading}
          onViewOpportunity={onViewOpportunity}
          onClearFilters={onClearFilters}
          filters={filters}
        />
      </div>
    </div>
  );
}
