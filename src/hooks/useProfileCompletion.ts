
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

type ProfileCheck = {
  step1Complete: boolean;
  step2Complete: boolean;
  username?: string;
};

export function useProfileCompletion() {
  const { user } = useAuthStore();
  const { toast } = useToast();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['profile-check', user?.id],
    enabled: !!user,
    retry: 1, // Reduce retries to avoid excessive calls
    staleTime: 30000, // Cache data for 30 seconds to prevent frequent refetches
    gcTime: 60000, // Keep data in cache for 1 minute (formerly cacheTime in older versions)
    queryFn: async (): Promise<ProfileCheck> => {
      if (!user) return { step1Complete: false, step2Complete: false };
      
      try {
        // Check if the user profile exists
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("username, full_name, role, bio, email")
          .eq("id", user.id)
          .maybeSingle();
          
        if (profileError) {
          console.error("Error fetching profile:", profileError);
          throw new Error(`Failed to fetch profile: ${profileError.message}`);
        }

        // Check if creator profile exists
        const { data: creatorProfile, error: creatorError } = await supabase
          .from("creator_profiles")
          .select("categories, content_formats")
          .eq("id", user.id)
          .maybeSingle();
          
        if (creatorError) {
          console.error("Error fetching creator profile:", creatorError);
          throw new Error(`Failed to fetch creator profile: ${creatorError.message}`);
        }

        // Check portfolio items
        const { data: portfolio, error: portfolioError } = await supabase
          .from("portfolio_items")
          .select("id")
          .eq("creator_id", user.id);
          
        if (portfolioError) {
          console.error("Error fetching portfolio:", portfolioError);
          throw new Error(`Failed to fetch portfolio: ${portfolioError.message}`);
        }

        console.log("Profile data:", { profile, creatorProfile, portfolio });

        // Requirement logic for onboarding steps
        const step1Complete =
          !!profile?.username &&
          !!profile?.full_name &&
          !!profile?.bio &&
          ((creatorProfile?.categories && creatorProfile.categories.length >= 1 && creatorProfile.categories.length <= 3));

        const step2Complete =
          step1Complete &&
          (creatorProfile?.content_formats?.length ?? 0) > 0 &&
          (portfolio?.length ?? 0) > 0;

        return { 
          step1Complete, 
          step2Complete, 
          username: profile?.username 
        };
      } catch (err: any) {
        console.error("Error in profile completion check:", err);
        throw err;
      }
    },
    meta: {
      onError: (error: Error) => {
        console.error("Profile completion query error:", error);
        toast({
          title: "Error checking profile status",
          description: error.message || "Failed to verify your profile status",
          variant: "destructive"
        });
      }
    }
  });

  return {
    step1Complete: data?.step1Complete ?? false,
    step2Complete: data?.step2Complete ?? false,
    loading: isLoading,
    error,
    refetch,
    hasCreatorProfile: data !== undefined, // Add a flag to indicate if profile data was fetched successfully
  };
}
