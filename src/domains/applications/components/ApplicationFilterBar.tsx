
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter, RefreshCw } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { SearchField } from "./filters/SearchField";
import { SortSelect } from "./filters/SortSelect";
import { CampaignFilter } from "./filters/CampaignFilter";
import { MatchScoreFilter } from "./filters/MatchScoreFilter";
import { ActiveFilters } from "./filters/ActiveFilters";

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
        <SearchField 
          value={filterValues.search}
          onChange={handleSearchChange}
        />

        <div className="flex sm:ml-auto gap-2">
          <SortSelect 
            value={filterValues.sortBy}
            onChange={handleSortChange}
          />

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

                <CampaignFilter 
                  value={tempFilters.campaign}
                  onChange={(val) => setTempFilters({...tempFilters, campaign: val})}
                  availableCampaigns={availableCampaigns}
                />

                <MatchScoreFilter 
                  minMatch={tempFilters.minMatch}
                  maxMatch={tempFilters.maxMatch}
                  onChange={([min, max]) => 
                    setTempFilters({...tempFilters, minMatch: min, maxMatch: max})
                  }
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
        </div>
      </div>

      <ActiveFilters 
        campaign={filterValues.campaign}
        minMatch={filterValues.minMatch}
        maxMatch={filterValues.maxMatch}
        onClearCampaign={() => setFilterValues({...filterValues, campaign: "all"})}
        onClearMatchRange={() => setFilterValues({
          ...filterValues, 
          minMatch: 0, 
          maxMatch: 100
        })}
      />
    </div>
  );
}
