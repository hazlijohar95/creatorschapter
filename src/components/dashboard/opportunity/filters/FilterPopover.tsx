
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import { useState } from "react";
import { FilterOptions } from "@/components/dashboard/types/opportunity";
import { CategoryFilter } from "./CategoryFilter";
import { BudgetRangeFilter } from "./BudgetRangeFilter";
import { SortOptions } from "./SortOptions";

const CATEGORIES = [
  "Instagram",
  "TikTok",
  "YouTube",
  "Blog",
  "Podcast",
  "Twitter",
  "Fashion",
  "Beauty",
  "Lifestyle",
  "Tech",
  "Food",
  "Travel",
  "Fitness",
];

interface FilterPopoverProps {
  filters: FilterOptions;
  onApplyFilters: (filters: FilterOptions) => void;
  onResetFilters: () => void;
}

export function FilterPopover({
  filters,
  onApplyFilters,
  onResetFilters,
}: FilterPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterOptions>({ ...filters });

  const handleCategoryToggle = (category: string) => {
    const updatedCategories = tempFilters.categories.includes(category)
      ? tempFilters.categories.filter((c) => c !== category)
      : [...tempFilters.categories, category];
    
    setTempFilters({ ...tempFilters, categories: updatedCategories });
  };

  const handleBudgetChange = (min: number | null, max: number | null) => {
    setTempFilters({ ...tempFilters, minBudget: min, maxBudget: max });
  };

  const handleSortChange = (sortBy: FilterOptions["sortBy"]) => {
    setTempFilters({ ...tempFilters, sortBy });
  };

  const handleApplyFilters = () => {
    onApplyFilters(tempFilters);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters: FilterOptions = {
      search: "",
      categories: [],
      minBudget: null,
      maxBudget: null,
      sortBy: "relevance",
    };
    setTempFilters(resetFilters);
    onResetFilters();
    setIsOpen(false);
  };

  // Count active filters for badge
  const activeFilterCount = 
    tempFilters.categories.length + 
    (tempFilters.minBudget !== null || tempFilters.maxBudget !== null ? 1 : 0) + 
    (tempFilters.sortBy !== "relevance" ? 1 : 0);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="flex gap-2 border-gray-200 rounded-xl">
          <Filter className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <Badge className="ml-1 bg-primary text-xs h-5 min-w-5 flex items-center justify-center p-0 rounded-full">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Filters & Sorting</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 text-xs" 
              onClick={handleResetFilters}
            >
              Reset
            </Button>
          </div>
          <Separator />

          <CategoryFilter 
            categories={CATEGORIES}
            selectedCategories={tempFilters.categories}
            onToggleCategory={handleCategoryToggle}
          />

          <BudgetRangeFilter
            minBudget={tempFilters.minBudget}
            maxBudget={tempFilters.maxBudget}
            onBudgetChange={handleBudgetChange}
          />

          <SortOptions
            selectedSort={tempFilters.sortBy}
            onSortChange={handleSortChange}
          />

          <Button
            className="w-full"
            onClick={handleApplyFilters}
          >
            Apply Filters
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
