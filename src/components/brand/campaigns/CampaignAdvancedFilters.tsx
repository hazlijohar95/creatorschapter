
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Filter, Search } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface FilterOptions {
  dateRange?: { from: Date; to: Date };
  budget?: { min: number; max: number };
  categories: string[];
  status: string;
  searchTerm?: string; // Add searchTerm to the interface
}

interface CampaignAdvancedFiltersProps {
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
}

export function CampaignAdvancedFilters({ filters, onFilterChange }: CampaignAdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<FilterOptions>(filters);

  const handleApplyFilters = () => {
    onFilterChange(tempFilters);
    setIsOpen(false);
  };

  const resetFilters = () => {
    const defaultFilters: FilterOptions = {
      categories: [],
      status: "all",
      searchTerm: "" // Include searchTerm in defaultFilters
    };
    setTempFilters(defaultFilters);
    onFilterChange(defaultFilters);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="relative w-full md:w-auto md:min-w-[300px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search campaigns..."
          className="pl-8"
          value={filters.searchTerm || ""}
          onChange={(e) => onFilterChange({ ...filters, searchTerm: e.target.value })}
        />
      </div>
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex gap-2">
            <Filter className="h-4 w-4" />
            Advanced Filters
            {(tempFilters.categories.length > 0 || tempFilters.status !== "all") && (
              <Badge variant="secondary" className="ml-1">
                {tempFilters.categories.length + (tempFilters.status !== "all" ? 1 : 0)}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[320px] p-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Date Range</label>
              <div className="grid grid-cols-2 gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {tempFilters.dateRange?.from ? (
                        format(tempFilters.dateRange.from, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={tempFilters.dateRange?.from}
                      onSelect={(date) =>
                        setTempFilters({
                          ...tempFilters,
                          dateRange: { ...tempFilters.dateRange, from: date } as any,
                        })
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Status</label>
              <Select
                value={tempFilters.status}
                onValueChange={(value) =>
                  setTempFilters({ ...tempFilters, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-1 block">Budget Range</label>
              <div className="grid grid-cols-2 gap-2">
                <Input
                  type="number"
                  placeholder="Min"
                  value={tempFilters.budget?.min || ""}
                  onChange={(e) =>
                    setTempFilters({
                      ...tempFilters,
                      budget: {
                        ...tempFilters.budget,
                        min: parseInt(e.target.value),
                      },
                    })
                  }
                />
                <Input
                  type="number"
                  placeholder="Max"
                  value={tempFilters.budget?.max || ""}
                  onChange={(e) =>
                    setTempFilters({
                      ...tempFilters,
                      budget: {
                        ...tempFilters.budget,
                        max: parseInt(e.target.value),
                      },
                    })
                  }
                />
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={resetFilters}>
                Reset
              </Button>
              <Button onClick={handleApplyFilters}>Apply Filters</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
