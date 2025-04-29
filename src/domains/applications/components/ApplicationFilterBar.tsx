
import { SearchField } from "./filters/SearchField";
import { SortSelect } from "./filters/SortSelect";
import { CampaignFilter } from "./filters/CampaignFilter";
import { MatchScoreFilter } from "./filters/MatchScoreFilter";
import { ActiveFilters } from "./filters/ActiveFilters";
import { useState } from "react";
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
  setFilterValues: React.Dispatch<React.SetStateAction<FilterValues>>;
  availableCampaigns: string[];
}

export function ApplicationFilterBar({
  filterValues,
  setFilterValues,
  availableCampaigns,
}: ApplicationFilterBarProps) {
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleSearchChange = (value: string) => {
    setFilterValues(prev => ({ ...prev, search: value }));
  };

  const handleSortChange = (value: string) => {
    setFilterValues(prev => ({ ...prev, sortBy: value }));
  };

  const handleCampaignChange = (value: string) => {
    setFilterValues(prev => ({ ...prev, campaign: value }));
  };

  const handleMatchScoreChange = (values: [number, number]) => {
    setFilterValues(prev => ({ ...prev, minMatch: values[0], maxMatch: values[1] }));
  };

  const handleClearCampaign = () => {
    setFilterValues(prev => ({ ...prev, campaign: "all" }));
  };

  const handleClearMatchRange = () => {
    setFilterValues(prev => ({ ...prev, minMatch: 0, maxMatch: 100 }));
  };

  const hasActiveFilters = filterValues.campaign !== "all" || 
    filterValues.minMatch > 0 || 
    filterValues.maxMatch < 100;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <SearchField value={filterValues.search} onChange={handleSearchChange} />
        <SortSelect value={filterValues.sortBy} onChange={handleSortChange} />
      </div>
      
      <div className="space-y-4">
        <button 
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
          className="text-sm font-medium text-primary flex items-center gap-1"
        >
          {showAdvancedFilters ? "Hide" : "Show"} Advanced Filters
        </button>
        
        {showAdvancedFilters && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CampaignFilter
                value={filterValues.campaign}
                onChange={handleCampaignChange}
                availableCampaigns={availableCampaigns}
              />
              
              <MatchScoreFilter
                minMatch={filterValues.minMatch}
                maxMatch={filterValues.maxMatch}
                onChange={handleMatchScoreChange}
              />
            </div>
            
            <Separator className="my-2" />
          </>
        )}
        
        {hasActiveFilters && (
          <ActiveFilters
            campaign={filterValues.campaign}
            minMatch={filterValues.minMatch}
            maxMatch={filterValues.maxMatch}
            onClearCampaign={handleClearCampaign}
            onClearMatchRange={handleClearMatchRange}
          />
        )}
      </div>
    </div>
  );
}
