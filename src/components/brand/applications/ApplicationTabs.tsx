
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Application } from "./types";
import { ApplicationList } from "./ApplicationList";

interface ApplicationTabsProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  filteredApplications: (tab: string) => Application[];
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
  onDiscuss: (id: number) => void;
  onViewProfile: (application: Application) => void;
  selectedApplications: number[];
  onToggleSelection: (id: number) => void;
}

export function ApplicationTabs({
  activeTab,
  setActiveTab,
  filteredApplications,
  onApprove,
  onReject,
  onDiscuss,
  onViewProfile,
  selectedApplications,
  onToggleSelection,
}: ApplicationTabsProps) {
  const tabs = ["all", "pending", "approved", "in_discussion", "rejected"];
  
  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="approved">Approved</TabsTrigger>
        <TabsTrigger value="in_discussion">In Discussion</TabsTrigger>
        <TabsTrigger value="rejected">Rejected</TabsTrigger>
      </TabsList>
      
      {tabs.map((tab) => (
        <TabsContent key={tab} value={tab} className="mt-4">
          <ApplicationList
            applications={filteredApplications(tab)}
            onApprove={onApprove}
            onReject={onReject}
            onDiscuss={onDiscuss}
            onViewProfile={onViewProfile}
            selectedApplications={selectedApplications}
            onToggleSelection={onToggleSelection}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}
