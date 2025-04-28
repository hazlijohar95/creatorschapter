
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/queryKeys';
import { useToast } from '@/hooks/use-toast';
import { getBrandCampaigns, createCampaign } from '@/services/campaign/campaignCore';
import type { Campaign, CreateCampaignData } from '@/types/campaign';

interface UseCampaignsOptions {
  brandId: string;
  status?: string;
}

export function useCampaignCore({ brandId, status }: UseCampaignsOptions) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: campaigns = [],
    isLoading,
    error
  } = useQuery({
    queryKey: [...queryKeys.campaigns(brandId), { status }],
    queryFn: () => getBrandCampaigns(brandId),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 60, // Keep in cache for 1 hour
  });

  const createMutation = useMutation({
    mutationFn: (newCampaign: CreateCampaignData) => createCampaign(newCampaign),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns(brandId) });
      toast({
        title: "Campaign Created",
        description: "Your campaign has been successfully created."
      });
    },
    onError: (error: Error) => {
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
