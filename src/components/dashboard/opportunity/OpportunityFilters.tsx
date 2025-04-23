
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Filter, Search, SortAsc } from "lucide-react";
import { useState } from "react";
import { FilterOptions } from "../types/opportunity";

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
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterOptions>({ ...filters });

  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, search: value });
  };

  const handleCategoryToggle = (category: string) => {
    const updatedCategories = tempFilters.categories.includes(category)
      ? tempFilters.categories.filter((c) => c !== category)
      : [...tempFilters.categories, category];
    
    setTempFilters({ ...tempFilters, categories: updatedCategories });
  };

  const handleSortChange = (sortBy: FilterOptions["sortBy"]) => {
    setTempFilters({ ...tempFilters, sortBy });
  };

  const handleApplyFilters = () => {
    onFilterChange(tempFilters);
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
    onFilterChange(resetFilters);
    setIsOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search opportunities..."
            className="w-full pl-8 bg-white border-gray-200 shadow-sm rounded-xl"
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            aria-label="Search opportunities"
          />
        </div>

        <div className="flex gap-2 items-center">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex gap-2 border-gray-200 rounded-xl">
                <Filter className="h-4 w-4" />
                Filters
                {(filters.categories.length > 0 || 
                  filters.minBudget !== null || 
                  filters.maxBudget !== null || 
                  filters.sortBy !== "relevance") && (
                  <Badge className="ml-1 bg-primary text-xs h-5 min-w-5 flex items-center justify-center p-0 rounded-full">
                    {filters.categories.length + 
                      (filters.minBudget !== null || filters.maxBudget !== null ? 1 : 0) + 
                      (filters.sortBy !== "relevance" ? 1 : 0)}
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

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Categories</h4>
                  <div className="flex flex-wrap gap-1">
                    {CATEGORIES.map((category) => (
                      <Badge
                        key={category}
                        variant={
                          tempFilters.categories.includes(category)
                            ? "default"
                            : "outline"
                        }
                        className="cursor-pointer"
                        onClick={() => handleCategoryToggle(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Budget Range ($)</h4>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={tempFilters.minBudget || ""}
                      onChange={(e) =>
                        setTempFilters({
                          ...tempFilters,
                          minBudget: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                    />
                    <span>-</span>
                    <Input
                      type="number"
                      placeholder="Max"
                      value={tempFilters.maxBudget || ""}
                      onChange={(e) =>
                        setTempFilters({
                          ...tempFilters,
                          maxBudget: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <SortAsc className="h-4 w-4" /> Sort By
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    <Badge
                      variant={
                        tempFilters.sortBy === "relevance" ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => handleSortChange("relevance")}
                    >
                      Most Relevant
                    </Badge>
                    <Badge
                      variant={
                        tempFilters.sortBy === "newest" ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => handleSortChange("newest")}
                    >
                      Newest
                    </Badge>
                    <Badge
                      variant={
                        tempFilters.sortBy === "budget" ? "default" : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => handleSortChange("budget")}
                    >
                      Highest Paying
                    </Badge>
                  </div>
                </div>

                <Button
                  className="w-full"
                  onClick={handleApplyFilters}
                >
                  Apply Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

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
              onClick={() =>
                onFilterChange({
                  ...filters,
                  categories: filters.categories.filter((c) => c !== category),
                })
              }
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
              onClick={() =>
                onFilterChange({
                  ...filters,
                  sortBy: "relevance",
                })
              }
            >
              ×
            </button>
          </Badge>
        )}
        
        {(filters.categories.length > 0 || 
          filters.minBudget !== null || 
          filters.maxBudget !== null || 
          filters.sortBy !== "relevance" ||
          filters.search) && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={handleResetFilters}
          >
            Clear All
          </Button>
        )}
      </div>
    </div>
  );
}
