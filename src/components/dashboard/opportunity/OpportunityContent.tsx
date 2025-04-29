
import { ApplicationsManagement } from "@/domains/applications/components/ApplicationsManagement";
import { OpportunityFilters } from "./OpportunityFilters";
import { RecommendedOpportunities } from "./RecommendedOpportunities";
import { OpportunityList } from "./OpportunityList";
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
  // Note: We're not using TabsContent here anymore
  // Instead, we're conditionally rendering content based on activeTab
  
  return (
    <>
      {activeTab === "discover" && (
        <div className="space-y-8">
          <OpportunityFilters
            filters={filters}
            onFilterChange={onFilterChange}
            totalOpportunities={opportunities.length}
            filteredCount={filteredOpportunities.length}
          />

          {filters.search === "" && filters.categories.length === 0 && (
            <RecommendedOpportunities
              opportunities={recommendedOpportunities}
              onViewOpportunity={onViewOpportunity}
            />
          )}

          <div>
            <h2 className="text-lg font-semibold font-space mb-4">
              {filters.search || filters.categories.length > 0
                ? "Search Results"
                : "Available Opportunities"}
            </h2>
            <OpportunityList
              opportunities={opportunities}
              filteredOpportunities={filteredOpportunities}
              isLoading={isLoading}
              onViewOpportunity={onViewOpportunity}
              onClearFilters={onClearFilters}
              filters={filters}
            />
          </div>
        </div>
      )}
      
      {activeTab === "applications" && (
        <div className="space-y-4">
          <ApplicationsManagement
            applications={applications}
            onViewDetails={onViewApplication}
            onMessageBrand={onMessageBrand}
          />
        </div>
      )}
    </>
  );
}
