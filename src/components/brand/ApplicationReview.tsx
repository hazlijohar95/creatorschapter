import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicationFilterBar } from "./applications/ApplicationFilterBar";
import { ApplicationDetailPanel } from "./applications/ApplicationDetailPanel";
import { BulkActions } from "./applications/BulkActions";
import { ApplicationsGrid } from "./applications/ApplicationsGrid";
import { useApplications } from "@/hooks/useApplications";
import { Application } from "@/types/applications";
import { APPLICATIONS } from "@/data/mock-applications";

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

  const {
    applications,
    selectedApplications,
    handleApprove,
    handleReject,
    handleDiscuss,
    handleBulkAction,
    handleBulkMessage,
    toggleApplicationSelection,
    clearSelection
  } = useApplications(APPLICATIONS);

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

  const handleAddNote = (id: number, note: string) => {
    setApplications(apps => apps.map(app =>
      app.id === id ? { 
        ...app, 
        notes: app.notes ? [...app.notes, note] : [note] 
      } : app
    ));
    toast({
      title: "Note added",
      description: "Your note has been saved to this application."
    });
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
