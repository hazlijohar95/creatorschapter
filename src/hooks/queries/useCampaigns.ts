
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryKeys } from '@/services/queryKeys';
import { useToast } from '@/hooks/use-toast';

interface Campaign {
  id: string;
  brand_id: string;
  name: string;
  description?: string;
  status: string;
  budget?: number;
  start_date?: string;
  end_date?: string;
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

      const { data, error } = await query;
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

  return {
    campaigns,
    isLoading,
    error,
    createCampaign: createMutation.mutate,
    isCreating: createMutation.isPending
  };
}
