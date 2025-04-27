
import { OpportunitySummary } from "../OpportunitySummary";
import { OpportunityFilters } from "./OpportunityFilters";
import { FilterOptions } from "../types/opportunity";

interface OpportunityHeaderProps {
  totalOpportunities: number;
  filteredCount: number;
  searchQuery: string;
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export function OpportunityHeader({
  totalOpportunities,
  filteredCount,
  searchQuery,
  filters,
  onFilterChange,
}: OpportunityHeaderProps) {
  return (
    <div className="space-y-8">
      <OpportunitySummary
        total={totalOpportunities}
        shown={filteredCount}
        searchQuery={searchQuery}
      />

      <OpportunityFilters
        filters={filters}
        onFilterChange={onFilterChange}
        totalOpportunities={totalOpportunities}
        filteredCount={filteredCount}
      />
    </div>
  );
}
