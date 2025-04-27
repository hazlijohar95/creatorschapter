
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CampaignList } from "./CampaignList";
import { CampaignEmptyState } from "./CampaignEmptyState";

interface Campaign {
  id: string;
  name: string;
  status: string;
  start_date?: string;
  end_date?: string;
  budget?: number;
  categories?: string[];
}

interface CampaignTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  campaigns: Campaign[];
  searchQuery: string;
  onCreateClick: () => void;
}

export function CampaignTabs({
  activeTab,
  onTabChange,
  campaigns,
  searchQuery,
  onCreateClick
}: CampaignTabsProps) {
  return (
    <Tabs defaultValue="all" value={activeTab} onValueChange={onTabChange}>
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="planning">Planning</TabsTrigger>
        <TabsTrigger value="draft">Draft</TabsTrigger>
        <TabsTrigger value="completed">Completed</TabsTrigger>
      </TabsList>
      
      <TabsContent value={activeTab} className="mt-4">
        {campaigns.length === 0 ? (
          <CampaignEmptyState activeTab={activeTab} onCreateClick={onCreateClick} />
        ) : (
          <CampaignList 
            campaigns={campaigns}
            searchQuery={searchQuery}
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
