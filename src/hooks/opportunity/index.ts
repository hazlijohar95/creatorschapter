
import { useOpportunityData } from "./useOpportunityData";
import { useOpportunityFilters } from "./useOpportunityFilters";
import { useOpportunityActions } from "./useOpportunityActions";
import { useState } from "react";
import { OpportunityTab } from "@/components/dashboard/types/opportunity";

export function useOpportunities() {
  const [activeTab, setActiveTab] = useState<OpportunityTab>("discover");
  
  // Get opportunity data from the data hook
  const { 
    opportunities, 
    applications, 
    recommendedOpportunities,
    isLoading 
  } = useOpportunityData();
  
  // Get filtering and sorting functionality from the filters hook
  const { 
    filters, 
    setFilters, 
    filteredOpportunities, 
    handleClearFilters 
  } = useOpportunityFilters(opportunities);
  
  // Get actions functionality from the actions hook
  const { 
    selectedOpportunity,
    selectedApplication,
    isDetailModalOpen,
    isApplicationDialogOpen,
    isActionLoading,
    handleApply,
    handleViewOpportunity,
    handleViewApplication,
    handleMessageBrand,
    setIsDetailModalOpen,
    setIsApplicationDialogOpen
  } = useOpportunityActions();

  // Create combined loading state
  const combinedIsLoading = isLoading || isActionLoading;

  // View opportunity details with pre-bound opportunities
  const viewOpportunity = (id: string) => handleViewOpportunity(id, opportunities);
  
  // View application details with pre-bound applications and opportunities
  const viewApplication = (id: string) => handleViewApplication(id, applications, opportunities);
  
  // Message brand with pre-bound applications
  const messageBrand = (id: string) => handleMessageBrand(id, applications);

  return {
    // Data
    opportunities,
    applications,
    recommendedOpportunities,
    filteredOpportunities,
    selectedOpportunity,
    selectedApplication,
    
    // UI state
    activeTab,
    isLoading: combinedIsLoading,
    filters,
    isDetailModalOpen,
    isApplicationDialogOpen,
    
    // Actions
    setActiveTab,
    setFilters,
    handleApply,
    handleViewOpportunity: viewOpportunity,
    handleViewApplication: viewApplication,
    handleMessageBrand: messageBrand,
    handleClearFilters,
    setIsDetailModalOpen,
    setIsApplicationDialogOpen,
  };
}

// Re-export individual hooks for direct use when needed
export { useOpportunityData } from "./useOpportunityData";
export { useOpportunityFilters } from "./useOpportunityFilters";
export { useOpportunityActions } from "./useOpportunityActions";
