
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { queryKeys } from '@/services/queryKeys';
import { CreatorProfile } from '@/types/profiles';
import { useToast } from '@/hooks/use-toast';

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
    }
  });

  const mutation = useMutation({
    mutationFn: async (updates: Partial<CreatorProfile>) => {
      const { data, error } = await supabase
        .from('creator_profiles')
        .update(updates)
        .eq('id', creatorId)
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.creatorProfile(creatorId) });
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated."
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

  return {
    profile,
    isLoading,
    error,
    updateProfile: mutation.mutate,
    isUpdating: mutation.isPending
  };
}

