
import { supabase } from "@/integrations/supabase/client";

// Fetch a creator or user profile by user ID
export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("username, full_name, bio, email")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}

// Update public profile
export async function updateProfile(userId: string, update: Partial<{ username: string; full_name: string; bio: string; email: string; }>) {
  const { error } = await supabase
    .from("profiles")
    .update(update)
    .eq("id", userId);
  if (error) throw error;
}

// Fetch creator profile extras
export async function getCreatorProfile(userId: string) {
  const { data, error } = await supabase
    .from("creator_profiles")
    .select("categories, content_formats, payment_preferences")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}

// Update creator profile extras
export async function updateCreatorProfile(userId: string, update: Partial<{ categories: string[], content_formats: string[], payment_preferences: string[] }>) {
  const { error } = await supabase
    .from("creator_profiles")
    .update(update)
    .eq("id", userId);
  if (error) throw error;
}

// Social links
export async function getSocialLinks(userId: string) {
  const { data, error } = await supabase
    .from("social_links")
    .select("id, platform, url")
    .eq("profile_id", userId);
  if (error) throw error;
  return data;
}

export async function saveSocialLink(userId: string, link: { id?: string, platform: string, url: string }) {
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
}

export async function deleteSocialLink(id: string) {
  const { error } = await supabase.from("social_links").delete().eq("id", id);
  if (error) throw error;
}

