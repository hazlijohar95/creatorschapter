
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthStore } from "@/lib/auth";

type ProfileCheck = {
  step1Complete: boolean;
  step2Complete: boolean;
  username?: string;
};

export function useProfileCompletion() {
  const { user } = useAuthStore();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['profile-check', user?.id],
    enabled: !!user,
    staleTime: 1000 * 30, // Consider data fresh for 30 seconds
    retry: 1, // Only retry once to avoid infinite loading
    queryFn: async (): Promise<ProfileCheck> => {
      if (!user) return { step1Complete: false, step2Complete: false };
      const { data: profile } = await supabase
        .from("profiles")
        .select("username, full_name, role, bio, email")
        .eq("id", user.id)
        .maybeSingle();
      const { data: creatorProfile } = await supabase
        .from("creator_profiles")
        .select("categories, content_formats")
        .eq("id", user.id)
        .maybeSingle();
      const { data: portfolio } = await supabase
        .from("portfolio_items")
        .select("id")
        .eq("creator_id", user.id);

      // Requirement logic for onboarding steps
      const step1Complete =
        !!profile?.username &&
        !!profile?.full_name &&
        !!profile?.bio &&
        !!profile?.role &&
        ((profile.role === 'creator' && creatorProfile?.categories && creatorProfile.categories.length >= 1 && creatorProfile.categories.length <= 3) ||
         (profile.role === 'brand'));

      const step2Complete =
        step1Complete &&
        ((profile.role === 'creator' && 
          (creatorProfile?.content_formats?.length ?? 0) > 0 &&
          (portfolio?.length ?? 0) > 0) ||
         (profile.role === 'brand'));

      return { step1Complete, step2Complete, username: profile?.username };
    },
  });

  return {
    step1Complete: data?.step1Complete ?? false,
    step2Complete: data?.step2Complete ?? false,
    loading: isLoading,
    error,
    refetch,
  };
}
