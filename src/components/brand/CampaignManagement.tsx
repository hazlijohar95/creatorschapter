
import { useState } from "react";
import { Briefcase, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth";

type Campaign = {
  id: string;
  name: string;
  status: string;
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
};

export function CampaignManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const { user } = useAuthStore();

  const { data: campaigns, isLoading, error } = useQuery({
    queryKey: ["brand-campaigns", user?.id],
    enabled: !!user,
    queryFn: async () => {
      // Fetch campaigns belonging to this brand
      const { data, error } = await supabase
        .from("campaigns")
        .select("*")
        .eq("brand_id", user?.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Campaign[];
    },
  });

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

  // Campaigns filtered by status
  const filteredCampaigns = (status: string) => {
    if (!campaigns) return [];
    if (status === "all") return campaigns;
    return campaigns.filter((c) => c.status === status);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Campaign Management</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Campaign
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

      {!isLoading && !error && (
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="planning">Planning</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          {["all", "active", "planning", "draft", "completed"].map((status) => (
            <TabsContent key={status} value={status} className="mt-4">
              {filteredCampaigns(status).length === 0 ? (
                <div className="text-muted-foreground text-center py-8 italic">
                  No campaigns found{status !== "all" ? ` for "${status}"` : ""}.
                </div>
              ) : (
                <div className="grid gap-4">
                  {filteredCampaigns(status).map((campaign) => (
                    <CampaignCard key={campaign.id} campaign={campaign} />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}

interface CampaignCardProps {
  campaign: Campaign;
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
  const progress = campaign.status === "completed"
    ? 100
    : campaign.status === "active"
      ? 66
      : campaign.status === "planning"
        ? 25
        : 10;
  const creators: { id: number; name: string; avatar?: string }[] = [];

  return (
    <Card>
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
              <span>
                {campaign.start_date
                  ? new Date(campaign.start_date).toLocaleDateString()
                  : "-"}
                {" - "}
                {campaign.end_date
                  ? new Date(campaign.end_date).toLocaleDateString()
                  : "-"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Budget:</span>
              <span>
                {typeof campaign.budget === "number"
                  ? `$${campaign.budget}`
                  : "-"}
              </span>
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
              <span className="text-muted-foreground">Creators:</span>
              {creators.length === 0 && (
                <p className="italic text-muted-foreground mt-1">No creators assigned yet</p>
              )}
            </div>
            <div className="flex -space-x-2">
              {creators.map((creator) => (
                <Avatar key={creator.id} className="border-2 border-white">
                  <AvatarImage src={creator.avatar} />
                  <AvatarFallback>
                    {creator.name.substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
              ))}
              <Button size="sm" variant="outline" className="rounded-full h-8 w-8 p-0 ml-2">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" size="sm">
            Details
          </Button>
          <Button size="sm">Manage</Button>
        </div>
      </CardContent>
    </Card>
  );
}
