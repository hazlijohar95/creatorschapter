
import { supabase } from "@/integrations/supabase/client";
import { handleServiceRequest } from "@/lib/errorHandling";

// Get brand profile
export async function getBrandProfile(userId: string) {
  return handleServiceRequest('getBrandProfile', async () => {
    const { data, error } = await supabase
      .from("brand_profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) throw error;
    return data;
  });
}

// Update brand profile (general purpose)
export async function updateBrandProfile(userId: string, update: Record<string, any>) {
  return handleServiceRequest('updateBrandProfile', async () => {
    const { error } = await supabase
      .from("brand_profiles")
      .update(update)
      .eq("id", userId);
    if (error) throw error;
    return true;
  });
}
