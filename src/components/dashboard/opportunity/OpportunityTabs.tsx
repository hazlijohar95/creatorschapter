
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OpportunityTab } from "../types/opportunity";

interface OpportunityTabsProps {
  activeTab: OpportunityTab;
  onTabChange: (value: OpportunityTab) => void;
  applicationsCount: number;
  children: React.ReactNode;
}

export function OpportunityTabs({ 
  activeTab, 
  onTabChange,
  applicationsCount,
  children
}: OpportunityTabsProps) {
  return (
    <Tabs 
      defaultValue="discover" 
      value={activeTab} 
      onValueChange={(value) => onTabChange(value as OpportunityTab)}
      className="space-y-6"
    >
      <TabsList className="mb-4">
        <TabsTrigger value="discover">Discover Opportunities</TabsTrigger>
        <TabsTrigger value="applications">
          My Applications
          {applicationsCount > 0 && (
            <span className="ml-1.5 bg-primary text-primary-foreground text-xs rounded-full px-1.5 py-0.5 min-w-[20px] text-center">
              {applicationsCount}
            </span>
          )}
        </TabsTrigger>
      </TabsList>
      
      {/* Render TabsContent components here */}
      <TabsContent value="discover">
        {activeTab === "discover" && children}
      </TabsContent>
      
      <TabsContent value="applications">
        {activeTab === "applications" && children}
      </TabsContent>
    </Tabs>
  );
}
