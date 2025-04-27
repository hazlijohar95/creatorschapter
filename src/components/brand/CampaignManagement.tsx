
import { useState } from "react";
import { useCampaigns } from "@/hooks/queries/useCampaigns";
import { useAuthStore } from "@/lib/auth";
import { CampaignCalendarView } from "./calendar/CampaignCalendarView";
import { CampaignFormDialog } from "./campaigns/CampaignFormDialog";
import { CampaignHeader } from "./campaigns/CampaignHeader";
import { CampaignAdvancedFilters } from "./campaigns/CampaignAdvancedFilters";
import { CampaignTabs } from "./campaigns/CampaignTabs";
import { CampaignLoadingState } from "./campaigns/CampaignLoadingState";
import { CampaignErrorState } from "./campaigns/CampaignErrorState";
import { CampaignAnalytics } from "./campaigns/CampaignAnalytics";

const defaultFilters = {
  categories: [],
  status: "all"
};

export function CampaignManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const [view, setView] = useState<"list" | "calendar">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);
  
  const { user } = useAuthStore();
  const { 
    campaigns = [], 
    isLoading, 
    error, 
    createCampaign, 
    isCreating 
  } = useCampaigns({ 
    brandId: user?.id || "", 
    status: activeTab !== "all" ? activeTab : undefined
  });

  // Mock analytics data - replace with real data from your backend
  const analyticsData = [
    { name: "Jan", impressions: 1200, engagements: 800 },
    { name: "Feb", impressions: 1800, engagements: 1200 },
    { name: "Mar", impressions: 2400, engagements: 1600 },
  ];

  const handleCreateCampaign = (data: any) => {
    createCampaign({
      ...data,
      brand_id: user?.id || "",
      status: "draft"
    });
    setFormDialogOpen(false);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  if (isLoading) return <CampaignLoadingState />;
  if (error) return <CampaignErrorState error={error as Error} />;

  return (
    <div className="p-6 space-y-6">
      <CampaignHeader 
        onCreateClick={() => setFormDialogOpen(true)}
        view={view}
        onViewChange={setView}
      />
      
      <CampaignAdvancedFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <CampaignAnalytics data={analyticsData} />

      {view === "calendar" ? (
        <CampaignCalendarView />
      ) : (
        <CampaignTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          campaigns={campaigns}
          searchQuery={searchQuery}
          onCreateClick={() => setFormDialogOpen(true)}
        />
      )}

      <CampaignFormDialog 
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSubmit={handleCreateCampaign}
        isSubmitting={isCreating}
        mode="create"
      />
    </div>
  );
}

export default CampaignManagement;
