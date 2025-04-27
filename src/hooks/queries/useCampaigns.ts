
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryKeys } from '@/services/queryKeys';
import { useToast } from '@/hooks/use-toast';
import { 
  createCampaign, 
  updateCampaign, 
  updateCampaignStatus, 
  deleteCampaign 
} from '@/services/campaignService';

interface Campaign {
  id: string;
  brand_id: string;
  name: string;
  description?: string;
  status: string;
  budget?: number;
  start_date?: string;
  end_date?: string;
  categories?: string[];
  created_at?: string;
}

interface UseCampaignsOptions {
  brandId: string;
  status?: string;
}

export function useCampaigns({ brandId, status }: UseCampaignsOptions) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: campaigns = [],
    isLoading,
    error
  } = useQuery({
    queryKey: [...queryKeys.campaigns(brandId), { status }],
    queryFn: async () => {
      let query = supabase
        .from('campaigns')
        .select('*')
        .eq('brand_id', brandId);

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data as Campaign[];
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
  });

  const createMutation = useMutation({
    mutationFn: async (newCampaign: Omit<Campaign, 'id'>) => {
      const { data, error } = await supabase
        .from('campaigns')
        .insert([newCampaign])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (newCampaign) => {
      // Update the cache with the new campaign
      queryClient.setQueryData<Campaign[]>(
        queryKeys.campaigns(brandId),
        old => old ? [...old, newCampaign] : [newCampaign]
      );
      
      toast({
        title: "Campaign Created",
        description: "Your campaign has been successfully created."
      });
    },
    onError: (error) => {
      toast({
        title: "Creation Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Campaign>) => {
      await updateCampaign(id, {
        name: updates.name,
        description: updates.description,
        budget: updates.budget,
        startDate: updates.start_date,
        endDate: updates.end_date,
        categories: updates.categories
      });
      return { id, ...updates };
    },
    onSuccess: (updatedCampaign) => {
      // Update the cache with the updated campaign
      queryClient.setQueryData<Campaign[]>(
        queryKeys.campaigns(brandId),
        old => old ? old.map(campaign => 
          campaign.id === updatedCampaign.id ? { ...campaign, ...updatedCampaign } : campaign
        ) : []
      );
      
      toast({
        title: "Campaign Updated",
        description: "Your campaign has been successfully updated."
      });
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
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await updateCampaignStatus(id, status);
      return { id, status };
    },
    onSuccess: ({ id, status }) => {
      // Update the cache with the updated campaign status
      queryClient.setQueryData<Campaign[]>(
        queryKeys.campaigns(brandId),
        old => old ? old.map(campaign => 
          campaign.id === id ? { ...campaign, status } : campaign
        ) : []
      );
      
      toast({
        title: "Status Updated",
        description: `Campaign status has been updated to ${status}.`
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
    mutationFn: async (id: string) => {
      await deleteCampaign(id);
      return id;
    },
    onSuccess: (id) => {
      // Remove the deleted campaign from cache
      queryClient.setQueryData<Campaign[]>(
        queryKeys.campaigns(brandId),
        old => old ? old.filter(campaign => campaign.id !== id) : []
      );
      
      toast({
        title: "Campaign Deleted",
        description: "The campaign has been successfully deleted."
      });
    },
    onError: (error) => {
      toast({
        title: "Deletion Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return {
    campaigns,
    isLoading,
    error,
    createCampaign: createMutation.mutate,
    updateCampaign: updateMutation.mutate,
    updateStatus: statusMutation.mutate,
    deleteCampaign: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
}

// Hook for individual campaign details
export function useCampaignDetails(campaignId: string | undefined) {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: async () => {
      if (!campaignId) throw new Error("Campaign ID is required");
      
      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          id,
          name,
          description,
          budget,
          start_date,
          end_date,
          status,
          categories,
          created_at,
          brand_id
        `)
        .eq('id', campaignId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!campaignId,
    onError: (error) => {
      toast({
        title: "Failed to Load Campaign",
        description: error.message,
        variant: "destructive"
      });
    }
  });
}

// Hook for campaign metrics
export function useCampaignMetrics(campaignId: string | undefined) {
  return useQuery({
    queryKey: ['campaign-metrics', campaignId],
    queryFn: async () => {
      if (!campaignId) return [];
      
      const { data, error } = await supabase
        .from('campaign_metrics')
        .select('*')
        .eq('campaign_id', campaignId)
        .order('date', { ascending: false });
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!campaignId
  });
}

// Hook for campaign collaborators
export function useCampaignCreators(campaignId: string | undefined) {
  return useQuery({
    queryKey: ['campaign-creators', campaignId],
    queryFn: async () => {
      if (!campaignId) return [];
      
      const { data, error } = await supabase
        .from('campaign_creators')
        .select(`
          id,
          status,
          application_message,
          brand_response,
          profiles:creator_id(
            id,
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('campaign_id', campaignId);
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!campaignId
  });
}
