
import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth";
import { Collaboration } from "./CollaborationCard";
import { toast } from "@/hooks/use-toast";

export function useCollaborations(filter: string = "all") {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    data: collaborations,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ["creator-collaborations", user?.id, filter],
    queryFn: async () => {
      if (!user) return [];

      // Join the campaign_creators table with the campaigns table
      // to get both the campaign and creator-specific information
      let query = supabase
        .from("campaign_creators")
        .select(`
          id,
          status,
          created_at,
          updated_at,
          campaigns!inner(
            id,
            name,
            description,
            budget,
            end_date,
            brand_id
          ),
          profiles!inner(id, full_name)
        `)
        .eq("creator_id", user.id);
      
      // Apply status filter if not showing all
      if (filter !== "all") {
        query = query.eq("status", filter);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Get brand names for each campaign
      const brandIds = [...new Set(data.map(item => item.campaigns.brand_id))];
      
      let brandNames: Record<string, string> = {};
      if (brandIds.length > 0) {
        const { data: brands } = await supabase
          .from("profiles")
          .select("id, full_name, company_name")
          .in("id", brandIds);
          
        if (brands) {
          brandNames = brands.reduce((acc, brand) => ({
            ...acc,
            [brand.id]: brand.company_name || brand.full_name || "Unknown Brand"
          }), {});
        }
      }
      
      // Transform data to match our Collaboration interface
      return data.map(item => ({
        id: item.id,
        title: item.campaigns.name,
        brand_name: brandNames[item.campaigns.brand_id] || "Unknown Brand",
        budget: item.campaigns.budget || 0,
        deadline: item.campaigns.end_date || new Date().toISOString(),
        description: item.campaigns.description,
        status: item.status as "active" | "pending" | "completed" | "declined",
        created_at: item.created_at,
        updated_at: item.updated_at || item.created_at,
        campaign_id: item.campaigns.id
      })) as Collaboration[];
    },
    enabled: !!user
  });

  // Set up real-time subscription for collaboration updates
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('collaboration-updates')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'campaign_creators',
          filter: `creator_id=eq.${user.id}`
        }, 
        (payload) => {
          console.log('Collaboration real-time update:', payload);
          
          // Invalidate queries to refresh data
          queryClient.invalidateQueries({ queryKey: ["creator-collaborations"] });
          
          // Show notification for status changes
          if (payload.eventType === 'UPDATE') {
            const newStatus = (payload.new as any).status;
            const oldStatus = (payload.old as any).status;
            
            if (newStatus !== oldStatus) {
              // Get campaign details for better notification
              supabase
                .from("campaigns")
                .select("name")
                .eq("id", (payload.new as any).campaign_id)
                .single()
                .then(({ data }) => {
                  const campaignName = data?.name || "A campaign";
                  
                  toast({
                    title: "Collaboration Updated",
                    description: `${campaignName} status changed to ${newStatus}`,
                    type: "info",
                  });
                });
            }
          }
        })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);
  
  return {
    collaborations: collaborations || [],
    isLoading,
    error,
    refetch
  };
}
