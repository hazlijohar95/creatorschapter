
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar, 
  BarChart, 
  Users, 
  Edit, 
  Trash, 
  Clock, 
  Tag 
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useCampaignDetails, useCampaignCreators, useCampaignMetrics } from "@/hooks/queries/useCampaigns";
import { CampaignFormDialog } from "./CampaignFormDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCampaign, deleteCampaign, updateCampaignStatus } from "@/services/campaignService";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/StatusBadge";

export function CampaignDetail() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: campaign, isLoading, error } = useCampaignDetails(campaignId);
  const { data: creators = [] } = useCampaignCreators(campaignId);
  const { data: metrics = [] } = useCampaignMetrics(campaignId);
  
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      if (!campaignId) throw new Error("Campaign ID is required");
      await updateCampaign(campaignId, {
        name: data.name,
        description: data.description,
        budget: data.budget,
        startDate: data.start_date,
        endDate: data.end_date,
        categories: data.categories
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
      toast({
        title: "Campaign Updated",
        description: "Campaign details have been successfully updated."
      });
      setEditDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const statusMutation = useMutation({
    mutationFn: async (status: string) => {
      if (!campaignId) throw new Error("Campaign ID is required");
      await updateCampaignStatus(campaignId, status);
      return status;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaign', campaignId] });
      toast({
        title: "Status Updated",
        description: "Campaign status has been successfully updated."
      });
    },
    onError: (error) => {
      toast({
        title: "Status Update Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!campaignId) throw new Error("Campaign ID is required");
      await deleteCampaign(campaignId);
    },
    onSuccess: () => {
      toast({
        title: "Campaign Deleted",
        description: "The campaign has been successfully deleted."
      });
      navigate("/brand-dashboard/campaigns");
    },
    onError: (error) => {
      toast({
        title: "Deletion Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  if (isLoading) {
    return <div className="p-6 text-center">Loading campaign details...</div>;
  }

  if (error || !campaign) {
    return (
      <div className="p-6 text-center">
        <p className="text-destructive">Error loading campaign details</p>
        <Button className="mt-4" onClick={() => navigate("/brand-dashboard/campaigns")}>
          Back to Campaigns
        </Button>
      </div>
    );
  }

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

  const progress = campaign.status === "completed" ? 100 : 
                  campaign.status === "active" ? 66 : 
                  campaign.status === "planning" ? 25 : 10;

  // Format dates for display
  const startDate = campaign.start_date ? format(new Date(campaign.start_date), "PPP") : "Not set";
  const endDate = campaign.end_date ? format(new Date(campaign.end_date), "PPP") : "Not set";

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="outline" size="sm" onClick={() => navigate("/brand-dashboard/campaigns")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{campaign.name}</h1>
          <div className="flex items-center gap-2 mt-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Created {campaign.created_at ? format(new Date(campaign.created_at), "PPP") : "Recently"}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2 items-center">
          <Select
            value={campaign.status}
            onValueChange={(value) => statusMutation.mutate(value)}
            disabled={statusMutation.isPending}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="planning">Planning</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon" onClick={() => setEditDialogOpen(true)}>
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="text-destructive" onClick={() => setDeleteDialogOpen(true)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{startDate} to {endDate}</span>
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress:</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Budget</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            ${campaign.budget?.toLocaleString() || "0"}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Creators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">{creators.length}</span>
              <Button variant="outline" size="sm">
                <Users className="mr-1 h-4 w-4" /> Invite
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-muted-foreground" />
        <div className="flex flex-wrap gap-1">
          {campaign.categories?.length ? (
            campaign.categories.map((category) => (
              <Badge key={category} variant="secondary" className="text-xs">
                {category}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground italic">No categories</span>
          )}
        </div>
      </div>
      
      {campaign.description && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{campaign.description}</p>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="creators" className="mt-8">
        <TabsList>
          <TabsTrigger value="creators">Creators</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>
        
        <TabsContent value="creators" className="mt-4 space-y-4">
          {creators.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <p className="mt-2">No creators assigned to this campaign yet</p>
              <Button className="mt-4" size="sm">
                <Users className="mr-2 h-4 w-4" /> Invite Creators
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {creators.map((creator) => (
                <Card key={creator.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={creator.profiles.avatar_url || ""} />
                        <AvatarFallback>
                          {creator.profiles.full_name?.substring(0, 2) || 'CR'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{creator.profiles.full_name}</h3>
                        <p className="text-sm text-muted-foreground">
                          @{creator.profiles.username || "creator"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2">
                      <StatusBadge status={creator.status} />
                    </div>
                    <div className="mt-4 flex justify-end gap-2">
                      <Button size="sm" variant="outline">Message</Button>
                      <Button size="sm">View Profile</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="metrics" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              {metrics.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <p className="mt-2">No metrics available yet for this campaign</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Impressions</p>
                      <p className="text-2xl font-bold">
                        {metrics[0]?.impressions?.toLocaleString() || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Clicks</p>
                      <p className="text-2xl font-bold">
                        {metrics[0]?.clicks?.toLocaleString() || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Conversions</p>
                      <p className="text-2xl font-bold">
                        {metrics[0]?.conversions?.toLocaleString() || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">ROI</p>
                      <p className="text-2xl font-bold">
                        {metrics[0]?.roi ? `${metrics[0].roi}%` : '0%'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content" className="mt-4 space-y-4">
          <div className="text-center py-8 text-muted-foreground">
            <p>Content management will be available soon</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Campaign Dialog */}
      <CampaignFormDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen}
        onSubmit={updateMutation.mutate}
        isSubmitting={updateMutation.isPending}
        initialData={campaign}
        mode="edit"
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the campaign
              "{campaign.name}" and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteMutation.mutate()}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default CampaignDetail;
