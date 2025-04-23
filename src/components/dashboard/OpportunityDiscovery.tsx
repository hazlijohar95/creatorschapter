
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Search, Filter, BookOpen, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuthStore } from "@/lib/auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  getPublicCampaigns, 
  applyToCampaign, 
  hasAppliedToCampaign 
} from "@/services/campaignService";
import { getCreatorProfile } from "@/services/profileService";

interface Campaign {
  id: string;
  name: string;
  description: string;
  budget: number;
  start_date: string | null;
  end_date: string | null;
  categories: string[] | null;
  status: string;
  profiles: {
    full_name: string;
    username: string;
  }
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
  const { data: campaigns = [], isLoading: loadingCampaigns } = useQuery({
    queryKey: ["public-campaigns", searchQuery],
    queryFn: () => getPublicCampaigns({ search: searchQuery }),
    enabled: !!user,
  });
  
  // Apply to a campaign mutation
  const applyMutation = useMutation({
    mutationFn: (campaignId: string) => 
      applyToCampaign(campaignId, user!.id, applicationMessage),
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
    }
  });
  
  // Calculate match score based on creator profile and campaign
  const calculateMatchScore = (campaign: Campaign) => {
    if (!creatorProfile) return 70; // Default score
    
    let score = 70; // Base score
    
    // Match based on categories
    if (campaign.categories && creatorProfile.categories) {
      const matchingCategories = campaign.categories.filter(cat => 
        creatorProfile.categories?.includes(cat)
      );
      
      if (matchingCategories.length > 0) {
        score += matchingCategories.length * 5;
      }
    }
    
    // Cap at 100
    return Math.min(score, 100);
  };
  
  // Function to check if creator has already applied
  const checkApplicationStatus = async (campaignId: string) => {
    if (!user) return { hasApplied: false, status: null };
    
    try {
      return await hasAppliedToCampaign(campaignId, user.id);
    } catch (error) {
      console.error("Error checking application status:", error);
      return { hasApplied: false, status: null };
    }
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
    campaign => campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
          {filteredCampaigns.map(campaign => (
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
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apply to Campaign</DialogTitle>
            <DialogDescription>
              Tell the brand why you're a great fit for this campaign.
            </DialogDescription>
          </DialogHeader>
          
          {selectedCampaign && (
            <>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">{selectedCampaign.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedCampaign.profiles.full_name}
                  </p>
                </div>
                
                <Textarea
                  placeholder="Write your application message here..."
                  value={applicationMessage}
                  onChange={(e) => setApplicationMessage(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={submitApplication}
                  disabled={!applicationMessage.trim() || applyMutation.isPending}
                >
                  {applyMutation.isPending ? (
                    <><span className="animate-spin">●</span> Submitting...</>
                  ) : (
                    <>Submit Application</>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface CampaignCardProps {
  campaign: Campaign;
  matchScore: number;
  onViewDetails: () => void;
  onApply: () => void;
}

function CampaignCard({ campaign, matchScore, onViewDetails, onApply }: CampaignCardProps) {
  const { user } = useAuthStore();
  const [applicationStatus, setApplicationStatus] = useState<{
    hasApplied: boolean;
    status: string | null;
  }>({ hasApplied: false, status: null });
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      if (!user) return;
      setChecking(true);
      try {
        const status = await checkApplicationStatus(campaign.id);
        setApplicationStatus(status);
      } finally {
        setChecking(false);
      }
    };
    
    checkStatus();
  }, [campaign.id, user]);

  const getStatusBadge = () => {
    if (checking) return null;
    
    if (applicationStatus.hasApplied) {
      switch (applicationStatus.status) {
        case "pending":
          return (
            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
              Pending
            </span>
          );
        case "approved":
          return (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              Approved
            </span>
          );
        case "rejected":
          return (
            <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
              Rejected
            </span>
          );
        default:
          return null;
      }
    }
    
    return campaign.end_date && new Date(campaign.end_date) < new Date() ? (
      <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
        Expired
      </span>
    ) : (
      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
        New
      </span>
    );
  };
  
  return (
    <Card key={campaign.id} className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{campaign.name}</CardTitle>
            <CardDescription className="pt-1">{campaign.profiles.full_name} • ${campaign.budget}</CardDescription>
          </div>
          {getStatusBadge()}
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {campaign.categories?.map(tag => (
            <span key={tag} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-3">{campaign.description}</p>
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span>Match score</span>
            <span className="font-medium">{matchScore}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full ${
                matchScore >= 90 ? "bg-green-500" : 
                matchScore >= 80 ? "bg-blue-500" : 
                matchScore >= 70 ? "bg-yellow-500" : "bg-orange-500"
              }`}
              style={{ width: `${matchScore}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-gray-50 pt-3 flex justify-between">
        <Button variant="outline" size="sm" onClick={onViewDetails}>
          <BookOpen className="mr-2 h-4 w-4" />
          View Details
        </Button>
        {checking ? (
          <Button size="sm" disabled>
            Loading...
          </Button>
        ) : applicationStatus.hasApplied ? (
          <Button size="sm" variant="secondary" disabled>
            <Check className="mr-2 h-4 w-4" />
            Applied
          </Button>
        ) : (
          <Button size="sm" onClick={onApply}>Apply Now</Button>
        )}
      </CardFooter>
    </Card>
  );
}
