
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth";
import { Collaboration } from "./CollaborationCard";

export function useCollaborations(filter: string = "all") {
  const { user } = useAuthStore();

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
          .select("id, full_name")
          .in("id", brandIds);
          
        if (brands) {
          brandNames = brands.reduce((acc, brand) => ({
            ...acc,
            [brand.id]: brand.full_name || "Unknown Brand"
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
        campaign_id: item.campaigns.id
      })) as Collaboration[];
    },
    enabled: !!user
  });
  
  return {
    collaborations: collaborations || [],
    isLoading,
    error,
    refetch
  };
}
