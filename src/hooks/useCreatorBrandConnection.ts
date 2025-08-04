import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/auth";
import { CreatorBrandConnectionService, CampaignOpportunity, CreatorApplication, CreatorProfile } from "@/services/CreatorBrandConnectionService";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";

const connectionService = new CreatorBrandConnectionService();

// Creator hooks
export function useCreatorOpportunities(filters?: {
  categories?: string[];
  budgetMin?: number;
  budgetMax?: number;
}) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['creator-opportunities', user?.id, filters],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const result = await connectionService.getOpportunitiesForCreator(user.id, filters);
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch opportunities');
      }
      return result.data || [];
    },
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  });
}

export function useCreatorApplications() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['creator-applications', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const result = await connectionService.getCreatorApplications(user.id);
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch applications');
      }
      return result.data || [];
    },
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useApplyToCampaign() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async (applicationData: {
      campaign_id: string;
      proposal: string;
      proposed_timeline: string;
      proposed_budget: number;
      portfolio_links: string[];
      custom_message?: string;
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const result = await connectionService.applyToCampaign({
        ...applicationData,
        creator_id: user.id
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit application');
      }

      return result.data;
    },
    onSuccess: (data) => {
      toast({
        title: "Application Submitted!",
        description: "Your application has been sent to the brand. They'll review it soon.",
        duration: 5000
      });

      // Invalidate and refetch related queries
      queryClient.invalidateQueries({ queryKey: ['creator-opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['creator-applications'] });
      
      logger.info('Application submitted successfully', { applicationId: data?.id });
    },
    onError: (error: Error) => {
      toast({
        title: "Application Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
      
      logger.error('Application submission failed', error);
    }
  });
}

// Brand hooks
export function useBrandCreators(filters?: {
  categories?: string[];
  followersMin?: number;
  engagementMin?: number;
  searchQuery?: string;
}) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['brand-creators', user?.id, filters],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const result = await connectionService.getCreatorsForBrand(user.id, filters);
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch creators');
      }
      return result.data || [];
    },
    enabled: !!user?.id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false
  });
}

export function useBrandApplications() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['brand-applications', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const result = await connectionService.getBrandApplications(user.id);
      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch applications');
      }
      return result.data || [];
    },
    enabled: !!user?.id,
    staleTime: 1 * 60 * 1000, // 1 minute for fresh data
  });
}

export function useUpdateApplicationStatus() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async ({ 
      applicationId, 
      status 
    }: { 
      applicationId: string; 
      status: 'approved' | 'rejected' 
    }) => {
      if (!user?.id) throw new Error('User not authenticated');

      const result = await connectionService.updateApplicationStatus(
        applicationId,
        status,
        user.id
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to update application');
      }

      return result.data;
    },
    onSuccess: (data, variables) => {
      const action = variables.status === 'approved' ? 'approved' : 'rejected';
      
      toast({
        title: `Application ${action}!`,
        description: `You have ${action} the creator's application.`,
        duration: 4000
      });

      // Invalidate and refetch applications
      queryClient.invalidateQueries({ queryKey: ['brand-applications'] });
      
      logger.info('Application status updated', { 
        applicationId: variables.applicationId, 
        status: variables.status 
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update application status.",
        variant: "destructive"
      });
      
      logger.error('Application status update failed', error);
    }
  });
}

// Real-time subscriptions for live updates
export function useRealtimeApplications(userId: string, userRole: 'creator' | 'brand') {
  const queryClient = useQueryClient();

  React.useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('applications_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications',
          filter: userRole === 'creator' 
            ? `creator_id=eq.${userId}` 
            : `campaign_id=in.(select id from campaigns where brand_id=${userId})`
        },
        (payload) => {
          logger.info('Real-time application update', { payload });
          
          // Invalidate relevant queries to refetch data
          if (userRole === 'creator') {
            queryClient.invalidateQueries({ queryKey: ['creator-applications'] });
            queryClient.invalidateQueries({ queryKey: ['creator-opportunities'] });
          } else {
            queryClient.invalidateQueries({ queryKey: ['brand-applications'] });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, userRole, queryClient]);
}

// Import React for the effect
import React from 'react';
import { supabase } from '@/integrations/supabase/client';