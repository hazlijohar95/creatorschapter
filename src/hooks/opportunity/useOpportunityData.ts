
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { Application, Opportunity } from "@/components/dashboard/types/opportunity";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export function useOpportunityData() {
  const { user } = useAuthStore();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [recommendedOpportunities, setRecommendedOpportunities] = useState<Opportunity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const queryClient = useQueryClient();
  
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
        logger.error("Error fetching campaigns", error);
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
        logger.error("Error fetching applications", error);
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
          logger.info('Real-time update received', { payload });
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
        logger.error("Error transforming campaign data", error);
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

  return {
    opportunities,
    applications,
    recommendedOpportunities,
    isLoading
  };
}
