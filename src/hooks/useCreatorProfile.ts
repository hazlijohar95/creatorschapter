
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryKeys } from '@/services/queryKeys';
import { CreatorProfile } from '@/types/profiles';
import { useToast } from '@/hooks/use-toast';
import { Enums } from '@/integrations/supabase/types';

export function useCreatorProfile(creatorId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const {
    data: profile,
    isLoading,
    error
  } = useQuery({
    queryKey: queryKeys.creatorProfile(creatorId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('id', creatorId)
        .single();
        
      if (error) throw error;
      return data as CreatorProfile;
    },
    staleTime: 1000 * 60 * 10, // Consider data fresh for 10 minutes
    gcTime: 1000 * 60 * 60 * 2, // Keep in cache for 2 hours
  });

  type CreatorProfileUpdate = {
    categories?: string[];
    collaboration_types?: Enums<"collaboration_type">[];
    content_formats?: Enums<"content_format">[];
    engagement_rate?: number | null;
    payment_preferences?: string[];
    pricing_info?: any | null;
    target_audience?: any | null;
  };

  const mutation = useMutation({
    mutationFn: async (updates: CreatorProfileUpdate) => {
      const { data, error } = await supabase
        .from('creator_profiles')
        .update(updates)
        .eq('id', creatorId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onMutate: async (updates) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.creatorProfile(creatorId) });
      const previousProfile = queryClient.getQueryData(queryKeys.creatorProfile(creatorId));

      queryClient.setQueryData(
        queryKeys.creatorProfile(creatorId),
        (old: CreatorProfile | undefined) => ({ ...old, ...updates })
      );

      return { previousProfile };
    },
    onError: (error, updates, context) => {
      queryClient.setQueryData(
        queryKeys.creatorProfile(creatorId),
        context?.previousProfile
      );
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive"
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.creatorProfile(creatorId) });
    }
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile: mutation.mutate,
    isUpdating: mutation.isPending
  };
}
