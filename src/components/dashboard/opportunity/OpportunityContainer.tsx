
import { OpportunityTabs } from "./OpportunityTabs";
import { OpportunityContent } from "./OpportunityContent";
import { OpportunitySummary } from "../OpportunitySummary";
import { OpportunityDetailModal } from "./OpportunityDetailModal";
import { OpportunitySkeleton } from "./OpportunitySkeleton";
import { useOpportunities } from "@/hooks/useOpportunities";

export function OpportunityContainer() {
  const {
    opportunities,
    applications,
    recommendedOpportunities,
    filteredOpportunities,
    selectedOpportunity,
    activeTab,
    isLoading,
    filters,
    isDetailModalOpen,
    handleApply,
    setActiveTab,
    setFilters,
    handleViewOpportunity,
    handleViewApplication,
    handleMessageBrand,
    handleClearFilters,
    setIsDetailModalOpen,
  } = useOpportunities();

  if (isLoading) {
    return <OpportunitySkeleton />;
  }

  return (
    <div className="space-y-8 pb-12 px-4 md:px-8 max-w-[1300px] mx-auto animate-fade-in">
      <OpportunitySummary
        total={opportunities.length}
        shown={filteredOpportunities.length}
        searchQuery={filters.search}
      />

      <OpportunityTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        applicationsCount={applications.length}
      >
        <OpportunityContent
          activeTab={activeTab}
          opportunities={opportunities}
          filteredOpportunities={filteredOpportunities}
          recommendedOpportunities={recommendedOpportunities}
          applications={applications}
          isLoading={isLoading}
          filters={filters}
          onFilterChange={setFilters}
          onViewOpportunity={handleViewOpportunity}
          onMessageBrand={handleMessageBrand}
          onViewApplication={handleViewApplication}
          onClearFilters={handleClearFilters}
        />
      </OpportunityTabs>

      <OpportunityDetailModal
        opportunity={selectedOpportunity}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onApply={handleApply}
      />
    </div>
  );
}
