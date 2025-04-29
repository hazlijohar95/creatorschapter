
import { SortByOption } from "../domain/opportunity";

/**
 * Filter component types
 */

export interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export interface CategoryFilterProps {
  categories: string[];
  selectedCategories: string[];
  onToggleCategory: (category: string) => void;
}

export interface BudgetRangeFilterProps {
  minBudget: number | null;
  maxBudget: number | null;
  onBudgetChange: (min: number | null, max: number | null) => void;
}

export interface SortOptionsProps {
  selectedSort: SortByOption;
  onSortChange: (sort: SortByOption) => void;
}

export interface ApplicationsFilterProps {
  count: number;
  statusFilter: string;
  onFilterChange: (value: string) => void;
}

export interface ActiveFilterBadgesProps {
  filters: any;
  totalOpportunities: number;
  filteredCount: number;
  onRemoveCategory: (category: string) => void;
  onResetSort: () => void;
  onResetAll: () => void;
}
