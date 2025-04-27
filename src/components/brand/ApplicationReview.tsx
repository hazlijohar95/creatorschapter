
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicationFilterBar } from "@/domains/applications/components/ApplicationFilterBar";
import { ApplicationDetailPanel } from "./applications/ApplicationDetailPanel";
import { BulkActions } from "./applications/BulkActions";
import { ApplicationsGrid } from "./applications/ApplicationsGrid";
import { useApplicationsManager } from "@/hooks/useApplicationsManager";
import { Application } from "@/types/applications";
import { APPLICATIONS } from "@/data/mock-applications";
import { useToast } from "@/hooks/use-toast";
import { ApplicationsManagement } from "@/domains/applications/components/ApplicationsManagement";

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
    isAddingNote
  } = useApplicationsManager(APPLICATIONS);

  const handleBulkMessage = () => {
    toast({
      title: "Messaging feature coming soon",
      description: "This feature will be implemented in a future update."
    });
  };

  const filteredApplications = (tab: string) => {
    let filtered = tab === "all" 
      ? applications 
      : applications.filter(a => a.status === tab);

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
    setSelectedApplication(application);
    setDetailPanelOpen(true);
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
            />
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
