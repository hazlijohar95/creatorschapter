
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export interface Deadline {
  id: string;
  name: string;
  date: string;
  type: string;
}

export function useUpcomingDeadlines() {
  const { user } = useAuthStore();
  const userId = user?.id;

  return useQuery({
    queryKey: ["brandUpcomingDeadlines", userId],
    queryFn: async (): Promise<Deadline[]> => {
      if (!userId) throw new Error("No user ID");
      
      try {
        const { data, error } = await supabase
          .from("campaigns")
          .select("id, name, end_date")
          .eq("brand_id", userId)
          .not('end_date', 'is', null)
          .order("end_date", { ascending: true })
          .limit(3);

        if (error) throw error;

        return (data || [])
          .filter(item => item.end_date) // Double-check we have dates
          .map(item => ({
            id: item.id,
            name: item.name,
            date: item.end_date,
            type: "Campaign End"
          }));
      } catch (error) {
        console.error("Error fetching upcoming deadlines:", error);
        return [];
      }
    },
    enabled: !!userId
  });
}
