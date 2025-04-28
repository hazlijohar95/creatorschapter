
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/services/queryKeys';
import { useToast } from '@/hooks/use-toast';
import { 
  updateCampaign, 
  updateCampaignStatus, 
  deleteCampaign 
} from '@/services/campaign/campaignUpdate';
import type { UpdateCampaignData } from '@/types/campaign';

export function useCampaignUpdate(brandId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & UpdateCampaignData) => {
      await updateCampaign(id, updates);
      return { id, ...updates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns(brandId) });
      toast({
        title: "Campaign Updated",
        description: "Your campaign has been successfully updated."
      });
    },
    onError: (error: Error) => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns(brandId) });
      toast({
        title: "Status Updated",
        description: "Campaign status has been updated successfully."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Status Update Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns(brandId) });
      toast({
        title: "Campaign Deleted",
        description: "The campaign has been successfully deleted."
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Deletion Failed",
        description: error.message,
        variant: "destructive"
      });
    }
  });

  return {
    updateCampaign: updateMutation.mutate,
    updateStatus: statusMutation.mutate,
    deleteCampaign: deleteMutation.mutate,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
}
