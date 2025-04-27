
import { useState } from "react";
import { Briefcase } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCampaigns } from "@/hooks/queries/useCampaigns";
import { useAuthStore } from "@/lib/auth";
import { CampaignCalendarView } from "./calendar/CampaignCalendarView";
import { CampaignFormDialog } from "./campaigns/CampaignFormDialog";
import { CampaignHeader } from "./campaigns/CampaignHeader";
import { CampaignFilters } from "./campaigns/CampaignFilters";
import { CampaignList } from "./campaigns/CampaignList";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function CampaignManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const [view, setView] = useState<"list" | "calendar">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  
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

  const handleCreateCampaign = (data: any) => {
    createCampaign({
      ...data,
      brand_id: user?.id || "",
      status: "draft"
    });
    setFormDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="w-full flex items-center justify-center py-10">
        <span className="animate-spin mr-2">
          <Briefcase className="w-5 h-5" />
        </span>
        Loading campaigns...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full flex items-center justify-center py-10 text-destructive">
        Error loading campaigns: {(error as any).message}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <CampaignHeader 
        onCreateClick={() => setFormDialogOpen(true)}
        view={view}
        onViewChange={setView}
      />
      
      <CampaignFilters 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {view === "calendar" ? (
        <CampaignCalendarView />
      ) : (
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="planning">Planning</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-4">
            {campaigns.length === 0 ? (
              <div className="text-muted-foreground text-center py-8 italic border rounded-lg p-6">
                No campaigns found{activeTab !== "all" ? ` for "${activeTab}"` : ""}.
                <div className="mt-4">
                  <Button onClick={() => setFormDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Campaign
                  </Button>
                </div>
              </div>
            ) : (
              <CampaignList 
                campaigns={campaigns}
                searchQuery={searchQuery}
              />
            )}
          </TabsContent>
        </Tabs>
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
