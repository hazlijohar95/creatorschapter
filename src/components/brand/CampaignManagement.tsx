
import { useState } from "react";
import { Briefcase, Plus, Calendar, Search, Filter, Grid3X3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useCampaigns } from "@/hooks/queries/useCampaigns";
import { useAuthStore } from "@/lib/auth";
import { CampaignCalendarView } from "./calendar/CampaignCalendarView";
import { CampaignFormDialog } from "./campaigns/CampaignFormDialog";
import { format } from "date-fns";
import { Link } from "react-router-dom";

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

  // Filter campaigns by search query
  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (campaign.description?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateCampaign = (data: any) => {
    createCampaign({
      ...data,
      brand_id: user?.id || "",
      status: "draft"
    });
    setFormDialogOpen(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Campaign Management</h1>
        <div className="flex gap-2">
          <div className="flex rounded-md overflow-hidden border">
            <Button 
              variant={view === "list" ? "default" : "outline"} 
              onClick={() => setView("list")}
              className="rounded-none"
            >
              <Grid3X3 className="mr-2 h-4 w-4" />
              List
            </Button>
            <Button 
              variant={view === "calendar" ? "default" : "outline"}
              onClick={() => setView("calendar")}
              className="rounded-none"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Calendar
            </Button>
          </div>
          <Button onClick={() => setFormDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-auto md:min-w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="w-full md:w-auto">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>
      
      {isLoading && (
        <div className="w-full flex items-center justify-center py-10">
          <span className="animate-spin mr-2">
            <Briefcase className="w-5 h-5" />
          </span>
          Loading campaigns...
        </div>
      )}

      {error && (
        <div className="w-full flex items-center justify-center py-10 text-destructive">
          Error loading campaigns: {(error as any).message}
        </div>
      )}

      {!isLoading && !error && view === "calendar" && (
        <CampaignCalendarView />
      )}

      {!isLoading && !error && view === "list" && (
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="planning">Planning</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-4">
            {filteredCampaigns.length === 0 ? (
              <div className="text-muted-foreground text-center py-8 italic border rounded-lg p-6">
                {searchQuery ? (
                  <>No campaigns found matching "{searchQuery}"</>
                ) : (
                  <>
                    No campaigns found{activeTab !== "all" ? ` for "${activeTab}"` : ""}.
                    <div className="mt-4">
                      <Button onClick={() => setFormDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Your First Campaign
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredCampaigns.map(campaign => (
                  <Link 
                    to={`/brand-dashboard/campaigns/${campaign.id}`} 
                    key={campaign.id}
                    className="block transition-all hover:scale-[1.01]"
                  >
                    <CampaignCard campaign={campaign} />
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}

      {/* Create Campaign Dialog */}
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

interface CampaignCardProps {
  campaign: {
    id: string;
    name: string;
    status: string;
    start_date?: string;
    end_date?: string;
    budget?: number;
    categories?: string[];
  };
}

function CampaignCard({ campaign }: CampaignCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "planning":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Dummy values for progress and creators (add real logic later)
  const progress = campaign.status === "completed" ? 100 : 
                   campaign.status === "active" ? 66 : 
                   campaign.status === "planning" ? 25 : 10;
  
  // Format dates if available
  const startDate = campaign.start_date ? format(new Date(campaign.start_date), "MMM d, yyyy") : "-";
  const endDate = campaign.end_date ? format(new Date(campaign.end_date), "MMM d, yyyy") : "-";
  
  // Mock creators for display - will be replaced with real data
  const creators: { id: number; name: string; avatar?: string; }[] = [];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{campaign.name}</CardTitle>
          <Badge className={getStatusColor(campaign.status)}>
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Timeline:</span>
              <span>{startDate} - {endDate}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Budget:</span>
              <span>{typeof campaign.budget === "number" ? `$${campaign.budget.toLocaleString()}` : "-"}</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress:</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </div>
          <div>
            <div className="text-sm mb-2">
              <span className="text-muted-foreground">Categories:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {campaign.categories?.length ? (
                  campaign.categories.map(category => (
                    <Badge key={category} variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted-foreground italic text-xs">No categories</span>
                )}
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-muted-foreground">Creators:</span>
              {creators.length === 0 ? (
                <div className="flex items-center gap-2 mt-1">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">+</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">Add creators</span>
                </div>
              ) : (
                <div className="flex -space-x-2 mt-1">
                  {creators.map(creator => (
                    <Avatar key={creator.id} className="border-2 border-background">
                      <AvatarImage src={creator.avatar} />
                      <AvatarFallback>
                        {creator.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CampaignManagement;
