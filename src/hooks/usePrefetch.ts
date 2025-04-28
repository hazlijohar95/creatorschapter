
import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/services/queryKeys";
import { User } from "@supabase/supabase-js";

/**
 * Hook for prefetching data when users hover over navigation items
 */
export function usePrefetch() {
  const queryClient = useQueryClient();

  // Prefetch opportunities when hovering over navigation
  const prefetchOpportunities = useCallback(() => {
    // Only prefetch if data isn't already in cache or is stale
    const cachedData = queryClient.getQueryData(["opportunities"]);
    if (!cachedData) {
      console.log("Prefetching opportunities data");
      // This would normally fetch from API in a real app
      // We're simulating prefetch for demo purposes
      queryClient.prefetchQuery({
        queryKey: ["opportunities"],
        queryFn: async () => {
          // In real app, this would be an API call
          // For demo, we're just simulating network delay
          console.log("Prefetching opportunities started");
          return [];
        },
        staleTime: 1000 * 60 * 5 // 5 minutes
      });
    }
  }, [queryClient]);

  // Prefetch creator profile when hovering on profile menu
  const prefetchProfile = useCallback(() => {
    const user = queryClient.getQueryData<User>(["user"]);
    if (user?.id) {
      queryClient.prefetchQuery({
        queryKey: queryKeys.creatorProfile(user.id),
        queryFn: async () => {
          console.log("Prefetching user profile");
          return {};
        },
        staleTime: 1000 * 60 * 10 // 10 minutes
      });
    }
  }, [queryClient]);

  return {
    prefetchOpportunities,
    prefetchProfile
  };
}
