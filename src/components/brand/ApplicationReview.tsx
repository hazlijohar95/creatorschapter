
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicationFilterBar } from "@/domains/applications/components/ApplicationFilterBar";
import { ApplicationDetailPanel } from "./applications/ApplicationDetailPanel";
import { BulkActions } from "./applications/BulkActions";
import { ApplicationsGrid } from "./applications/ApplicationsGrid";
import { useApplicationsManager } from "@/hooks/useApplicationsManager";
import { Application, Status } from "@/types/applications";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { validateApplication } from "@/utils/applicationTransformers";

export function ApplicationReview() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [filterValues, setFilterValues] = useState({
    search: "",
    campaign: "all",
    minMatch: 0,
    maxMatch: 100,
    sortBy: "newest"
  });
  
  const { toast } = useToast();

  const {
    applications,
    selectedApplications,
    handleApprove,
    handleReject,
    handleDiscuss,
    handleBulkAction,
    addNote,
    toggleApplicationSelection,
    clearSelection,
    isUpdating,
    isAddingNote,
    isLoadingData,
    loadMoreApplications
  } = useApplicationsManager();

  const handleBulkMessage = () => {
    toast({
      title: "Messaging feature coming soon",
      description: "This feature will be implemented in a future update."
    });
  };

  const filteredApplications = (tab: string) => {
    let filtered = tab === "all" 
      ? applications 
      : applications.filter(a => a.status === tab as Status);

    if (filterValues.search) {
      const searchLower = filterValues.search.toLowerCase();
      filtered = filtered.filter(app => 
        app.creatorName.toLowerCase().includes(searchLower) || 
        app.creatorHandle.toLowerCase().includes(searchLower) ||
        app.campaign.toLowerCase().includes(searchLower)
      );
    }

    if (filterValues.campaign !== "all") {
      filtered = filtered.filter(app => app.campaign === filterValues.campaign);
    }

    filtered = filtered.filter(app => 
      app.match >= filterValues.minMatch && app.match <= filterValues.maxMatch
    );

    return filtered;
  };

  const handleViewDetail = (application: Application) => {
    // Validate application before showing detail panel
    if (validateApplication(application)) {
      setSelectedApplication(application);
      setDetailPanelOpen(true);
    } else {
      toast({
        title: "Error displaying application",
        description: "There was an error loading the application details. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleAddNote = (id: string, note: string) => {
    addNote({ id, note });
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold font-space">Creator Applications</h1>
        
        <div className="flex flex-wrap gap-2">
          <BulkActions 
            selectedApplications={selectedApplications}
            onBulkAction={handleBulkAction}
            onBulkMessage={handleBulkMessage}
            onClearSelection={clearSelection}
          />
        </div>
      </div>

      <ApplicationFilterBar 
        filterValues={filterValues}
        setFilterValues={setFilterValues}
        availableCampaigns={Array.from(new Set(applications.map(app => app.campaign)))}
      />

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="in_discussion">In Discussion</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        {["all", "pending", "approved", "in_discussion", "rejected"].map(tab => (
          <TabsContent key={tab} value={tab} className="mt-4">
            <ApplicationsGrid 
              applications={filteredApplications(tab)}
              onApprove={handleApprove}
              onReject={handleReject}
              onDiscuss={handleDiscuss}
              onViewProfile={handleViewDetail}
              selectedApplications={selectedApplications}
              onToggleSelection={toggleApplicationSelection}
              useVirtualization={filteredApplications(tab).length > 20}
            />
            
            {filteredApplications(tab).length >= 20 && (
              <div className="flex justify-center mt-6">
                <Button 
                  onClick={loadMoreApplications}
                  variant="outline"
                  disabled={isLoadingData}
                  className="w-40"
                >
                  {isLoadingData ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>

      <ApplicationDetailPanel 
        application={selectedApplication}
        isOpen={detailPanelOpen}
        onClose={() => setDetailPanelOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
        onDiscuss={handleDiscuss}
        onAddNote={handleAddNote}
      />
    </div>
  );
}

export default ApplicationReview;
