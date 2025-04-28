
import { useState } from "react";
import { useCampaignCore } from "@/hooks/campaign";
import { useAuthStore } from "@/lib/auth";
import { CampaignCalendarView } from "./calendar/CampaignCalendarView";
import { CampaignFormDialog } from "./campaigns/CampaignFormDialog";
import { CampaignWizard } from "./campaigns/CampaignWizard";
import { CampaignHeader } from "./campaigns/CampaignHeader";
import { CampaignAdvancedFilters } from "./campaigns/CampaignAdvancedFilters";
import { CampaignTabs } from "./campaigns/CampaignTabs";
import { CampaignLoadingState } from "./campaigns/CampaignLoadingState";
import { CampaignErrorState } from "./campaigns/CampaignErrorState";
import { CampaignAnalytics } from "./campaigns/CampaignAnalytics";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const defaultFilters = {
  categories: [],
  status: "all",
  searchTerm: ""
};

export function CampaignManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const [view, setView] = useState<"list" | "calendar">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [filters, setFilters] = useState(defaultFilters);
  
  const { user } = useAuthStore();
  const { toast } = useToast();
  const { 
    campaigns = [], 
    isLoading, 
    error, 
    createCampaign, 
    isCreating 
  } = useCampaignCore({ 
    brandId: user?.id || "", 
    status: activeTab !== "all" ? activeTab : undefined
  });

  const analyticsData = [
    { name: "Jan", impressions: 1200, engagements: 800 },
    { name: "Feb", impressions: 1800, engagements: 1200 },
    { name: "Mar", impressions: 2400, engagements: 1600 },
  ];

  const handleCreateCampaign = (data: any) => {
    createCampaign({
      ...data,
      brandId: user?.id || "",
      status: "draft"
    });
    setFormDialogOpen(false);
  };
  
  const handleCreateCampaignWizard = (data: any) => {
    createCampaign({
      brandId: user?.id || "",
      name: data.name,
      description: data.description,
      budget: data.budget,
      startDate: data.start_date,
      endDate: data.end_date,
      categories: data.categories,
      status: "draft"
    });
    setWizardOpen(false);
    
    toast({
      title: "Campaign Created",
      description: "Your campaign has been successfully created and saved as a draft."
    });
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    if (newFilters.searchTerm !== undefined) {
      setSearchQuery(newFilters.searchTerm);
    }
  };
  
  const handleCreateClick = () => setWizardOpen(true);

  if (isLoading) return <CampaignLoadingState />;
  if (error) return <CampaignErrorState error={error as Error} />;

  return (
    <div className="p-6 space-y-6">
      <CampaignHeader 
        onCreateClick={handleCreateClick}
        view={view}
        onViewChange={setView}
      />
      
      <CampaignAdvancedFilters 
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <CampaignAnalytics data={analyticsData} />

      {view === "calendar" ? (
        <CampaignCalendarView 
          campaigns={campaigns} 
          onCreateClick={handleCreateClick} 
        />
      ) : (
        <CampaignTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          campaigns={campaigns}
          searchQuery={searchQuery}
          onCreateClick={handleCreateClick}
        />
      )}

      <CampaignFormDialog 
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        onSubmit={handleCreateCampaign}
        isSubmitting={isCreating}
        mode="create"
      />
      
      <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-auto p-0 gap-0">
          <CampaignWizard
            onComplete={handleCreateCampaignWizard}
            onCancel={() => setWizardOpen(false)}
            isSubmitting={isCreating}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CampaignManagement;
