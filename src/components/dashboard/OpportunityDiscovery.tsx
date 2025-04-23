
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPublicCampaigns } from "@/services/campaignService";
import { applyToCampaign } from "@/services/applicationService";
import { getCreatorProfile } from "@/services/profileService";
import { CampaignCard } from "./OpportunityDiscovery/CampaignCard";
import { ApplicationDialog } from "./OpportunityDiscovery/ApplicationDialog";
import { Campaign } from "./OpportunityDiscovery/types";

// Type guard to ensure a campaign is properly structured
function isValidCampaign(campaign: any): campaign is Campaign {
  return (
    campaign &&
    typeof campaign === "object" &&
    "id" in campaign &&
    "name" in campaign &&
    "description" in campaign &&
    "profiles" in campaign &&
    typeof campaign.profiles === "object" &&
    "full_name" in campaign.profiles &&
    "username" in campaign.profiles
  );
}

export default function OpportunityDiscovery() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [applicationMessage, setApplicationMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Fetch creator profile to calculate match scores
  const { data: creatorProfile } = useQuery({
    queryKey: ["creator-profile", user?.id],
    queryFn: () => getCreatorProfile(user!.id),
    enabled: !!user,
  });

  // Fetch available campaigns
  const { data: campaignsResponse = [], isLoading: loadingCampaigns } = useQuery({
    queryKey: ["public-campaigns", searchQuery],
    queryFn: () => getPublicCampaigns({ search: searchQuery }),
    enabled: !!user,
  });

  // Filter out invalid campaign data
  const campaigns: Campaign[] = Array.isArray(campaignsResponse)
    ? campaignsResponse.filter(isValidCampaign)
    : [];

  // Apply to a campaign mutation
  const applyMutation = useMutation({
    mutationFn: (campaignId: string) => applyToCampaign(campaignId, user!.id, applicationMessage),
    onSuccess: () => {
      toast({
        title: "Application submitted",
        description: "Your application has been successfully submitted.",
      });
      queryClient.invalidateQueries({ queryKey: ["creator-applications"] });
      queryClient.invalidateQueries({ queryKey: ["public-campaigns"] });
      setDialogOpen(false);
      setApplicationMessage("");
    },
    onError: (error) => {
      toast({
        title: "Failed to apply",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
      console.error("Application error:", error);
    },
  });

  // Calculate match score based on creator profile and campaign
  const calculateMatchScore = (campaign: Campaign) => {
    if (!creatorProfile) return 70; // Default score

    let score = 70; // Base score

    // Match based on categories if available
    if (campaign.categories && creatorProfile.categories) {
      const matchingCategories = campaign.categories.filter((cat) =>
        creatorProfile.categories?.includes(cat)
      );

      if (matchingCategories.length > 0) {
        score += matchingCategories.length * 5;
      }
    }

    // Cap at 100
    return Math.min(score, 100);
  };

  // Apply to campaign
  const handleApply = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setDialogOpen(true);
  };

  // Submit application
  const submitApplication = () => {
    if (!selectedCampaign || !applicationMessage.trim()) return;
    applyMutation.mutate(selectedCampaign.id);
  };

  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search opportunities..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filters
        </Button>
      </div>

      {loadingCampaigns ? (
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="text-center p-12">
          <p className="text-lg font-medium">No opportunities found</p>
          <p className="text-muted-foreground">Try a different search or check back later</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              matchScore={calculateMatchScore(campaign)}
              onViewDetails={() => setSelectedCampaign(campaign)}
              onApply={() => handleApply(campaign)}
            />
          ))}
        </div>
      )}

      {/* Application Dialog */}
      <ApplicationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        selectedCampaign={selectedCampaign}
        applicationMessage={applicationMessage}
        setApplicationMessage={setApplicationMessage}
        onSubmit={submitApplication}
        isSubmitting={applyMutation.isPending}
      />
    </div>
  );
}
