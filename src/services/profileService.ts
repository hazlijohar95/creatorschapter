
import { supabase } from "@/integrations/supabase/client";
import { Enums } from "@/integrations/supabase/types";
import { withErrorHandling } from "./serviceUtils";

// Fetch a creator or user profile by user ID
export async function getProfile(userId: string) {
  return withErrorHandling(async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("username, full_name, bio, email")
      .eq("id", userId)
      .single();
    if (error) throw error;
    return data;
  }, "Failed to fetch profile");
}

// Update public profile
export async function updateProfile(userId: string, update: Partial<{ username: string; full_name: string; bio: string; email: string; }>) {
  return withErrorHandling(async () => {
    const { error } = await supabase
      .from("profiles")
      .update(update)
      .eq("id", userId);
    if (error) throw error;
  }, "Failed to update profile");
}

// Fetch creator profile extras
export async function getCreatorProfile(userId: string) {
  return withErrorHandling(async () => {
    const { data, error } = await supabase
      .from("creator_profiles")
      .select("categories, content_formats, payment_preferences")
      .eq("id", userId)
      .single();
    if (error) throw error;
    return data;
  }, "Failed to fetch creator profile");
}

// Update creator profile extras with proper typing for content_formats
export async function updateCreatorProfile(userId: string, update: Partial<{ 
  categories: string[]; 
  content_formats: Enums<"content_format">[]; 
  payment_preferences: string[]; 
}>) {
  return withErrorHandling(async () => {
    const { error } = await supabase
      .from("creator_profiles")
      .update(update)
      .eq("id", userId);
    if (error) throw error;
  }, "Failed to update creator profile");
}

// Social links
export async function getSocialLinks(userId: string) {
  return withErrorHandling(async () => {
    const { data, error } = await supabase
      .from("social_links")
      .select("id, platform, url")
      .eq("profile_id", userId);
    if (error) throw error;
    return data;
  }, "Failed to fetch social links");
}

export async function saveSocialLink(userId: string, link: { id?: string, platform: string, url: string }) {
  return withErrorHandling(async () => {
    if (link.id) {
      const { error } = await supabase
        .from("social_links")
        .update({ platform: link.platform, url: link.url })
        .eq("id", link.id);
      if (error) throw error;
      return;
    } else {
      const { error } = await supabase
        .from("social_links")
        .insert([{ profile_id: userId, platform: link.platform, url: link.url }]);
      if (error) throw error;
      return;
    }
  }, "Failed to save social link");
}

export async function deleteSocialLink(id: string) {
  return withErrorHandling(async () => {
    const { error } = await supabase.from("social_links").delete().eq("id", id);
    if (error) throw error;
  }, "Failed to delete social link");
}

// Brand profile management functions
export async function getBrandProfile(userId: string) {
  return withErrorHandling(async () => {
    const { data, error } = await supabase
      .from("brand_profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) throw error;
    return data;
  }, "Failed to fetch brand profile");
}

// Update brand profile with enhanced typing
export async function updateBrandProfile(userId: string, update: Partial<{
  company_name: string;
  company_size: string;
  industry: string;
  website: string;
  target_audience: any;
  campaign_preferences: any;
}>) {
  return withErrorHandling(async () => {
    const { error } = await supabase
      .from("brand_profiles")
      .update(update)
      .eq("id", userId);
    if (error) throw error;
  }, "Failed to update brand profile");
}
