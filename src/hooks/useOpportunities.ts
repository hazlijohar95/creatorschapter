
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth";
import { Application, FilterOptions, Opportunity, OpportunityTab } from "@/components/dashboard/types/opportunity";
import { toast } from "@/hooks/use-toast";

export function useOpportunities() {
  const { user } = useAuthStore();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [recommendedOpportunities, setRecommendedOpportunities] = useState<Opportunity[]>([]);
  const [activeTab, setActiveTab] = useState<OpportunityTab>("discover");
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    categories: [],
    minBudget: null,
    maxBudget: null,
    sortBy: "relevance",
  });

  // Query for campaigns
  const { data: campaignData, isLoading: campaignsLoading } = useQuery({
    queryKey: ['campaigns', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("campaigns")
        .select(`
          id,
          name,
          description,
          budget,
          brand_id,
          created_at,
          categories,
          end_date,
          profiles!brand_id (
            full_name,
            company_name
          )
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching campaigns:", error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user
  });

  // Query for applications
  const { data: applicationData, isLoading: applicationsLoading } = useQuery({
    queryKey: ['applications', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from("campaign_creators")
        .select(`
          id,
          status,
          application_message,
          brand_response,
          created_at,
          campaign_id,
          campaigns (
            id,
            name,
            description,
            budget,
            brand_id
          ),
          profiles!brand_id (
            full_name,
            company_name
          )
        `)
        .eq("creator_id", user.id)
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching applications:", error);
        throw error;
      }
      
      return data || [];
    },
    enabled: !!user?.id
  });

  // Setup realtime subscription for application status updates
  useEffect(() => {
    if (!user?.id) return;
    
    const channel = supabase
      .channel('campaign-creators-changes')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'campaign_creators',
          filter: `creator_id=eq.${user.id}`
        }, 
        (payload) => {
          console.log('Real-time update:', payload);
          // Refresh applications on any changes
          queryClient.invalidateQueries({ queryKey: ['applications', user.id] });
          
          // Show notification
          if (payload.eventType === 'UPDATE') {
            const newStatus = (payload.new as any).status;
            const oldStatus = (payload.old as any).status;
            
            if (newStatus !== oldStatus) {
              toast({
                title: "Application Updated",
                description: `Your application status has been updated to ${newStatus}`,
                type: "info",
              });
            }
          }
        })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, queryClient]);

  // Process campaign data
  useEffect(() => {
    if (campaignData && !campaignsLoading) {
      try {
        const transformedOpportunities: Opportunity[] = campaignData.map((campaign: any) => {
          // Calculate match score based on user categories (simplified)
          const match = Math.floor(70 + Math.random() * 30);
          
          // Format budget string
          const budget = campaign.budget ? `$${campaign.budget}` : "TBD";
          
          // Determine if it's new (less than 3 days old)
          const createdAt = new Date(campaign.created_at);
          const isNew = (new Date().getTime() - createdAt.getTime()) < (3 * 24 * 60 * 60 * 1000);
          
          return {
            id: campaign.id,
            title: campaign.name,
            company: campaign.profiles?.company_name || campaign.profiles?.full_name || "Company",
            budget: budget,
            description: campaign.description || "No description provided.",
            match: match,
            tags: campaign.categories || [],
            deadline: campaign.end_date || new Date().toISOString(),
            isNew: isNew,
            createdAt: campaign.created_at,
          };
        });
        
        setOpportunities(transformedOpportunities);
        
        // Set recommended opportunities (highest match scores)
        const recommended = [...transformedOpportunities]
          .sort((a, b) => b.match - a.match)
          .slice(0, 3);
          
        setRecommendedOpportunities(recommended);
      } catch (error) {
        console.error("Error transforming campaign data:", error);
        toast({
          title: "Error loading opportunities",
          description: "There was an error processing campaign data.",
          type: "destructive",
        });
      }
    }
  }, [campaignData, campaignsLoading]);

  // Process application data
  useEffect(() => {
    if (applicationData && !applicationsLoading) {
      try {
        const transformedApplications: Application[] = applicationData.map((app: any) => {
          return {
            id: app.id,
            opportunity: {
              id: app.campaigns?.id || "",
              title: app.campaigns?.name || "Unknown Campaign",
              company: app.profiles?.company_name || app.profiles?.full_name || "Unknown Company",
              budget: app.campaigns?.budget ? `$${app.campaigns.budget}` : "TBD",
            },
            status: app.status,
            appliedDate: new Date(app.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
            lastUpdateDate: new Date(app.updated_at || app.created_at).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            }),
            message: app.application_message || "",
            brandResponse: app.brand_response,
          };
        });
        
        setApplications(transformedApplications);
      } catch (error) {
        console.error("Error transforming application data:", error);
        toast({
          title: "Error loading applications",
          description: "There was an error processing your applications.",
          type: "destructive",
        });
      }
    }
  }, [applicationData, applicationsLoading]);

  // Update loading state
  useEffect(() => {
    setIsLoading(campaignsLoading || applicationsLoading);
  }, [campaignsLoading, applicationsLoading]);

  // Filter opportunities based on active filters
  const filteredOpportunities = opportunities.filter((opp) => {
    const searchMatch =
      filters.search === "" ||
      opp.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      opp.company.toLowerCase().includes(filters.search.toLowerCase()) ||
      opp.description.toLowerCase().includes(filters.search.toLowerCase()) ||
      opp.tags.some((tag) =>
        tag.toLowerCase().includes(filters.search.toLowerCase())
      );

    const categoryMatch =
      filters.categories.length === 0 ||
      filters.categories.some((cat) => opp.tags.includes(cat));
    
    const budgetLower = opp.budget.match(/\$(\d+)/);
    const budgetUpper = opp.budget.match(/\-\$?(\d+)/);
    
    const minBudget = budgetLower ? parseInt(budgetLower[1]) : 0;
    const maxBudget = budgetUpper ? parseInt(budgetUpper[1]) : minBudget;
    
    const budgetMatch =
      (filters.minBudget === null || maxBudget >= filters.minBudget) &&
      (filters.maxBudget === null || minBudget <= filters.maxBudget);

    return searchMatch && categoryMatch && budgetMatch;
  });

  // Sort opportunities based on filters
  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => {
    if (filters.sortBy === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (filters.sortBy === "budget") {
      const aBudgetMatch = a.budget.match(/\$(\d+)/);
      const bBudgetMatch = b.budget.match(/\$(\d+)/);
      const aBudget = aBudgetMatch ? parseInt(aBudgetMatch[1]) : 0;
      const bBudget = bBudgetMatch ? parseInt(bBudgetMatch[1]) : 0;
      return bBudget - aBudget;
    } else {
      return b.match - a.match;
    }
  });

  // Apply to an opportunity
  const handleApply = async (opportunityId: string, message: string) => {
    try {
      if (!user) {
        toast({ 
          title: "Authentication required", 
          description: "Please log in to apply for opportunities",
          type: "destructive"
        });
        return Promise.reject("Not authenticated");
      }

      setIsLoading(true);
      
      // Check if already applied
      const { data: existingApplications } = await supabase
        .from("campaign_creators")
        .select("id")
        .eq("campaign_id", opportunityId)
        .eq("creator_id", user.id)
        .single();
        
      if (existingApplications) {
        toast({
          title: "Already applied",
          description: "You have already applied to this opportunity",
          type: "warning"
        });
        setIsLoading(false);
        return Promise.reject("Already applied");
      }
      
      // Submit new application
      const { data, error } = await supabase
        .from("campaign_creators")
        .insert({
          campaign_id: opportunityId,
          creator_id: user.id,
          status: "pending",
          application_message: message
        })
        .select();
        
      if (error) {
        throw error;
      }
      
      // Refresh applications
      queryClient.invalidateQueries({ queryKey: ['applications', user.id] });
      
      toast({
        title: "Application submitted",
        description: "Your application has been successfully submitted",
        type: "success"
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error applying to opportunity:", error);
      toast({
        title: "Failed to submit application",
        description: "There was an error submitting your application. Please try again.",
        type: "destructive"
      });
      return Promise.reject(error);
    } finally {
      setIsLoading(false);
    }
  };

  // View opportunity details
  const handleViewOpportunity = (opportunityId: string) => {
    const opportunity = opportunities.find((o) => o.id === opportunityId);
    if (opportunity) {
      setSelectedOpportunity(opportunity);
      setIsDetailModalOpen(true);
    }
  };

  // View application details
  const handleViewApplication = (applicationId: string) => {
    const application = applications.find((a) => a.id === applicationId);
    if (application) {
      setSelectedApplication(application);
      setIsApplicationDialogOpen(true);
      
      const opportunityId = application.opportunity.id;
      const fullOpportunity = opportunities.find((o) => o.id === opportunityId);
      if (fullOpportunity) {
        setSelectedOpportunity(fullOpportunity);
      }
    }
  };

  // Setup messaging with brand
  const handleMessageBrand = async (applicationId: string) => {
    const application = applications.find((a) => a.id === applicationId);
    if (!application || !user) return;

    try {
      // Get the brand ID from the application
      const { data: campaignData, error: campaignError } = await supabase
        .from("campaigns")
        .select("brand_id")
        .eq("id", application.opportunity.id)
        .single();
        
      if (campaignError) throw campaignError;
      
      const brandId = campaignData.brand_id;
      
      // Check if conversation already exists
      const { data: existingConversation, error: convError } = await supabase
        .from("conversations")
        .select("id")
        .eq("creator_id", user.id)
        .eq("brand_id", brandId)
        .maybeSingle();
        
      if (convError) throw convError;
      
      let conversationId;
      
      // Create conversation if it doesn't exist
      if (!existingConversation) {
        const { data: newConversation, error: createError } = await supabase
          .from("conversations")
          .insert({
            creator_id: user.id,
            brand_id: brandId
          })
          .select()
          .single();
          
        if (createError) throw createError;
        conversationId = newConversation.id;
      } else {
        conversationId = existingConversation.id;
      }
      
      toast({
        title: "Conversation ready",
        description: "You can now message the brand about this opportunity",
        type: "success"
      });
      
      console.log("Opening conversation:", conversationId);
    } catch (error) {
      console.error("Error setting up conversation:", error);
      toast({
        title: "Couldn't set up messaging",
        description: "There was an error setting up the conversation with this brand",
        type: "destructive"
      });
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      search: "",
      categories: [],
      minBudget: null,
      maxBudget: null,
      sortBy: "relevance",
    });
  };

  return {
    // Data
    opportunities,
    applications,
    recommendedOpportunities,
    filteredOpportunities: sortedOpportunities,
    selectedOpportunity,
    selectedApplication,
    
    // UI state
    activeTab,
    isLoading,
    filters,
    isDetailModalOpen,
    isApplicationDialogOpen,
    
    // Actions
    setActiveTab,
    setFilters,
    handleApply,
    handleViewOpportunity,
    handleViewApplication,
    handleMessageBrand,
    handleClearFilters,
    setIsDetailModalOpen,
    setIsApplicationDialogOpen,
  };
}
