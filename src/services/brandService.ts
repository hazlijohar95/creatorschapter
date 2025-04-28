
import { supabase } from "@/integrations/supabase/client";
import { withErrorHandling } from "./serviceUtils";
import { getBrandProfile as getProfile, updateBrandProfile as updateProfile } from "./profileService";

// Re-export from profileService for backwards compatibility
export const getBrandProfile = getProfile;
export const updateBrandProfile = updateProfile;
