import { useState, useEffect, lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import { useCampaignCore } from "@/hooks/campaign";
import { useAuthStore } from "@/lib/auth";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { QuickSkeleton } from "@/components/shared/QuickSkeleton";

// Lazy load heavy components
const CampaignCalendarView = lazy(() => import("./calendar/CampaignCalendarView").then(m => ({ default: m.CampaignCalendarView })));
const CampaignFormDialog = lazy(() => import("./campaigns/CampaignFormDialog").then(m => ({ default: m.CampaignFormDialog })));
const CampaignWizard = lazy(() => import("./campaigns/CampaignWizard").then(m => ({ default: m.CampaignWizard })));
const CampaignAnalytics = lazy(() => import("./campaigns/CampaignAnalytics").then(m => ({ default: m.CampaignAnalytics })));
const CampaignAdvancedFilters = lazy(() => import("./campaigns/CampaignAdvancedFilters").then(m => ({ default: m.CampaignAdvancedFilters })));

// Keep lightweight components as static imports
import { CampaignHeader } from "./campaigns/CampaignHeader";
import { CampaignTabs } from "./campaigns/CampaignTabs";
import { CampaignLoadingState } from "./campaigns/CampaignLoadingState";
import { CampaignErrorState } from "./campaigns/CampaignErrorState";

const defaultFilters = {
  categories: [],
  status: "all",
  searchTerm: ""
};

// Lightweight fallback component for suspense
const CampaignSkeleton = () => (
  <div className="space-y-4">
    <QuickSkeleton height="h-8" width="w-48" />
    <QuickSkeleton height="h-64" width="w-full" />
  </div>
);

export function CampaignManagement() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("all");
  const [view, setView] = useState<"list" | "calendar">(location.pathname.includes("/calendar") ? "calendar" : "list");
  const [searchQuery, setSearchQuery] = useState("");
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);
  const [editingCampaign, setEditingCampaign] = useState<any>(null);
  
  const { user, profile } = useAuthStore();
  const { toast } = useToast();
  
  // Use campaign hook for data management
  const {
    campaigns,
    isLoading,
    isError,
    error,
    refetch,
    archiveCampaign,
    duplicateCampaign
  } = useCampaignCore({
    brandId: user?.id,
    enabled: !!user?.id
  });

  // Handle URL-based view switching
  useEffect(() => {
    setView(location.pathname.includes("/calendar") ? "calendar" : "list");
  }, [location.pathname]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleFilterUpdate = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleViewToggle = () => {
    setView(view === "list" ? "calendar" : "list");
  };

  const handleNewCampaign = () => {
    setShowWizard(true);
  };

  const handleEditCampaign = (campaign: any) => {
    setEditingCampaign(campaign);
    setFormDialogOpen(true);
  };

  const handleDuplicateCampaign = async (campaignId: string) => {
    try {
      await duplicateCampaign(campaignId);
      toast({
        title: "Campaign duplicated",
        description: "The campaign has been successfully duplicated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate campaign. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleArchiveCampaign = async (campaignId: string) => {
    try {
      await archiveCampaign(campaignId);
      toast({
        title: "Campaign archived",
        description: "The campaign has been archived successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to archive campaign. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Show loading state
  if (isLoading) {
    return <CampaignLoadingState />;
  }

  // Show error state
  if (isError) {
    return (
      <CampaignErrorState 
        error={error?.message || "Failed to load campaigns"} 
        onRetry={refetch}
      />
    );
  }

  // Filter campaigns based on active filters
  const filteredCampaigns = campaigns?.filter(campaign => {
    const matchesTab = activeTab === "all" || campaign.status === activeTab;
    const matchesSearch = searchQuery === "" || 
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filters.status === "all" || campaign.status === filters.status;
    const matchesCategories = filters.categories.length === 0 || 
      filters.categories.some(cat => campaign.categories?.includes(cat));

    return matchesTab && matchesSearch && matchesStatus && matchesCategories;
  }) || [];

  return (
    <div className="space-y-6">
      <CampaignHeader
        onNewCampaign={handleNewCampaign}
        onSearch={handleSearch}
        onViewToggle={handleViewToggle}
        view={view}
        onShowAdvancedFilters={() => setShowAdvancedFilters(true)}
        onShowAnalytics={() => setShowAnalytics(true)}
      />

      {view === "calendar" ? (
        <Suspense fallback={<CampaignSkeleton />}>
          <CampaignCalendarView campaigns={filteredCampaigns} />
        </Suspense>
      ) : (
        <CampaignTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          campaigns={filteredCampaigns}
          onEditCampaign={handleEditCampaign}
          onDuplicateCampaign={handleDuplicateCampaign}
          onArchiveCampaign={handleArchiveCampaign}
        />
      )}

      {/* Lazy loaded dialogs */}
      {showWizard && (
        <Dialog open={showWizard} onOpenChange={setShowWizard}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <Suspense fallback={<LoadingSpinner />}>
              <CampaignWizard onClose={() => setShowWizard(false)} />
            </Suspense>
          </DialogContent>
        </Dialog>
      )}

      {formDialogOpen && (
        <Suspense fallback={<LoadingSpinner />}>
          <CampaignFormDialog
            open={formDialogOpen}
            onOpenChange={setFormDialogOpen}
            campaign={editingCampaign}
            onSuccess={() => {
              setFormDialogOpen(false);
              setEditingCampaign(null);
              refetch();
            }}
          />
        </Suspense>
      )}

      {showAdvancedFilters && (
        <Dialog open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
          <DialogContent className="max-w-2xl">
            <Suspense fallback={<LoadingSpinner />}>
              <CampaignAdvancedFilters
                filters={filters}
                onFiltersChange={handleFilterUpdate}
                onClose={() => setShowAdvancedFilters(false)}
              />
            </Suspense>
          </DialogContent>
        </Dialog>
      )}

      {showAnalytics && (
        <Dialog open={showAnalytics} onOpenChange={setShowAnalytics}>
          <DialogContent className="max-w-4xl">
            <Suspense fallback={<LoadingSpinner />}>
              <CampaignAnalytics
                campaigns={filteredCampaigns}
                onClose={() => setShowAnalytics(false)}
              />
            </Suspense>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}