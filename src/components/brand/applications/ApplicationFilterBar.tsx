
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Search, Filter, SortAsc, RefreshCw } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface FilterValues {
  search: string;
  campaign: string;
  minMatch: number;
  maxMatch: number;
  sortBy: string;
}

interface ApplicationFilterBarProps {
  filterValues: FilterValues;
  setFilterValues: (filters: FilterValues) => void;
  availableCampaigns: string[];
}

export function ApplicationFilterBar({
  filterValues,
  setFilterValues,
  availableCampaigns
}: ApplicationFilterBarProps) {
  const [tempFilters, setTempFilters] = useState<FilterValues>(filterValues);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearchChange = (value: string) => {
    setFilterValues({
      ...filterValues,
      search: value
    });
  };

  const handleSortChange = (value: string) => {
    setFilterValues({
      ...filterValues,
      sortBy: value
    });
  };

  const handleCampaignChange = (value: string) => {
    setFilterValues({
      ...filterValues,
      campaign: value
    });
  };

  const handleApplyFilters = () => {
    setFilterValues(tempFilters);
    setIsOpen(false);
  };

  const handleResetFilters = () => {
    const resetFilters: FilterValues = {
      search: "",
      campaign: "all",
      minMatch: 0,
      maxMatch: 100,
      sortBy: "newest"
    };
    setTempFilters(resetFilters);
    setFilterValues(resetFilters);
    setIsOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by creator name or campaign..."
            className="w-full pl-8 bg-white border-gray-200 shadow-sm rounded-xl"
            value={filterValues.search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <div className="flex sm:ml-auto gap-2">
          <Select value={filterValues.sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-[180px] bg-white border-gray-200">
              <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="highestMatch">Highest Match</SelectItem>
              <SelectItem value="largestAudience">Largest Audience</SelectItem>
              <SelectItem value="highestEngagement">Highest Engagement</SelectItem>
            </SelectContent>
          </Select>

          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-10 flex gap-2 border-gray-200">
                <Filter className="h-4 w-4" />
                Filters
                {(filterValues.minMatch > 0 || filterValues.maxMatch < 100 || filterValues.campaign !== "all") && (
                  <Badge className="ml-1 bg-primary text-xs h-5 min-w-5 flex items-center justify-center p-0 rounded-full">
                    {(filterValues.minMatch > 0 || filterValues.maxMatch < 100 ? 1 : 0) + (filterValues.campaign !== "all" ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Filter Applications</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-xs gap-1" 
                    onClick={handleResetFilters}
                  >
                    <RefreshCw className="h-3 w-3" /> Reset
                  </Button>
                </div>
                <Separator />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Campaign</label>
                  <Select 
                    value={tempFilters.campaign} 
                    onValueChange={(val) => setTempFilters({...tempFilters, campaign: val})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select campaign" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Campaigns</SelectItem>
                      {availableCampaigns.map((campaign) => (
                        <SelectItem key={campaign} value={campaign}>{campaign}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Match Score Range</label>
                    <span className="text-sm text-muted-foreground">
                      {tempFilters.minMatch}% - {tempFilters.maxMatch}%
                    </span>
                  </div>
                  <Slider
                    defaultValue={[tempFilters.minMatch, tempFilters.maxMatch]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={([min, max]) => 
                      setTempFilters({...tempFilters, minMatch: min, maxMatch: max})
                    }
                  />
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

      {/* Active filters display */}
      <div className="flex flex-wrap gap-2">
        {filterValues.campaign !== "all" && (
          <Badge variant="outline" className="bg-gray-50 border border-gray-200 gap-1">
            Campaign: {filterValues.campaign}
            <button
              className="ml-1 text-muted-foreground hover:text-gray-900"
              onClick={() => setFilterValues({...filterValues, campaign: "all"})}
            >
              ×
            </button>
          </Badge>
        )}
        
        {(filterValues.minMatch > 0 || filterValues.maxMatch < 100) && (
          <Badge variant="outline" className="bg-gray-50 border border-gray-200 gap-1">
            Match: {filterValues.minMatch}% - {filterValues.maxMatch}%
            <button
              className="ml-1 text-muted-foreground hover:text-gray-900"
              onClick={() => setFilterValues({
                ...filterValues, 
                minMatch: 0, 
                maxMatch: 100
              })}
            >
              ×
            </button>
          </Badge>
        )}
      </div>
    </div>
  );
}
