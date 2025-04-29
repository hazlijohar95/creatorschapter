
import { DiscoverContent } from "./discover/DiscoverContent";
import { ApplicationsContent } from "./applications/ApplicationsContent";
import { Application, FilterOptions, Opportunity } from "../types/opportunity";

interface OpportunityContentProps {
  activeTab: string;
  opportunities: Opportunity[];
  filteredOpportunities: Opportunity[];
  recommendedOpportunities: Opportunity[];
  applications: Application[];
  isLoading: boolean;
  filters: FilterOptions;
  onFilterChange: (filters: FilterOptions) => void;
  onViewOpportunity: (id: string) => void;
  onMessageBrand: (id: string) => void;
  onViewApplication: (id: string) => void;
  onClearFilters: () => void;
}

export function OpportunityContent({
  activeTab,
  opportunities,
  filteredOpportunities,
  recommendedOpportunities,
  applications,
  isLoading,
  filters,
  onFilterChange,
  onViewOpportunity,
  onMessageBrand,
  onViewApplication,
  onClearFilters,
}: OpportunityContentProps) {
  // Render content based on the active tab
  return (
    <>
      {activeTab === "discover" && (
        <DiscoverContent
          opportunities={opportunities}
          filteredOpportunities={filteredOpportunities}
          recommendedOpportunities={recommendedOpportunities}
          isLoading={isLoading}
          filters={filters}
          onFilterChange={onFilterChange}
          onViewOpportunity={onViewOpportunity}
          onClearFilters={onClearFilters}
        />
      )}
      
      {activeTab === "applications" && (
        <ApplicationsContent
          applications={applications}
          onViewApplication={onViewApplication}
          onMessageBrand={onMessageBrand}
        />
      )}
    </>
  );
}
