
import { FilterOptions } from "../types/opportunity";
import { SearchField } from "./filters/SearchField";
import { FilterPopover } from "./filters/FilterPopover";
import { ActiveFilterBadges } from "./filters/ActiveFilterBadges";

interface OpportunityFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  totalOpportunities: number;
  filteredCount: number;
}

export function OpportunityFilters({
  filters,
  onFilterChange,
  totalOpportunities,
  filteredCount,
}: OpportunityFiltersProps) {
  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, search: value });
  };

  const handleApplyFilters = (newFilters: FilterOptions) => {
    onFilterChange(newFilters);
  };

  const handleRemoveCategory = (category: string) => {
    onFilterChange({
      ...filters,
      categories: filters.categories.filter((c) => c !== category),
    });
  };

  const handleResetSort = () => {
    onFilterChange({
      ...filters,
      sortBy: "relevance",
    });
  };

  const handleResetFilters = () => {
    onFilterChange({
      search: "",
      categories: [],
      minBudget: null,
      maxBudget: null,
      sortBy: "relevance",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <SearchField 
          value={filters.search}
          onChange={handleSearchChange}
        />

        <div className="flex gap-2 items-center">
          <FilterPopover
            filters={filters}
            onApplyFilters={handleApplyFilters}
            onResetFilters={handleResetFilters}
          />
        </div>
      </div>

      <ActiveFilterBadges
        filters={filters}
        totalOpportunities={totalOpportunities}
        filteredCount={filteredCount}
        onRemoveCategory={handleRemoveCategory}
        onResetSort={handleResetSort}
        onResetAll={handleResetFilters}
      />
    </div>
  );
}
