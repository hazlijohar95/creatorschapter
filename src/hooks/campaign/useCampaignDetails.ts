
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { getCampaign } from '@/services/campaign/campaignCore';
import { getCampaignMetrics } from '@/services/campaign/campaignMetrics';
import { Campaign, CampaignMetrics } from '@/types/campaign';

export function useCampaignDetails(campaignId: string | undefined) {
  const { toast } = useToast();

  const campaignQuery = useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: () => {
      if (!campaignId) throw new Error("Campaign ID is required");
      return getCampaign(campaignId);
    },
    enabled: !!campaignId,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Failed to Load Campaign",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  });

  const metricsQuery = useQuery({
    queryKey: ['campaign-metrics', campaignId],
    queryFn: () => {
      if (!campaignId) return [];
      return getCampaignMetrics(campaignId);
    },
    enabled: !!campaignId,
  });

  return {
    campaign: campaignQuery.data as Campaign | undefined,
    metrics: metricsQuery.data as CampaignMetrics[] | undefined,
    isLoading: campaignQuery.isLoading || metricsQuery.isLoading,
    error: campaignQuery.error || metricsQuery.error
  };
}
