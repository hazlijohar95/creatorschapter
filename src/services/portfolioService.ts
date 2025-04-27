
import { supabase } from "@/integrations/supabase/client";
import { withErrorHandling } from "./serviceUtils";
import { CreatePortfolioItemDTO, UpdatePortfolioItemDTO } from "@/types/portfolio";

// Fetch portfolio items
export async function getPortfolioItems(creatorId: string) {
  return withErrorHandling(async () => {
    const { data, error } = await supabase
      .from("portfolio_items")
      .select("*")
      .eq("creator_id", creatorId)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false });
    if (error) throw error;
    return data;
  }, "Failed to fetch portfolio items");
}

// Create portfolio item
export async function createPortfolioItem(creatorId: string, item: CreatePortfolioItemDTO) {
  return withErrorHandling(async () => {
    const { data, error } = await supabase
      .from("portfolio_items")
      .insert([{ ...item, creator_id: creatorId }])
      .select()
      .single();
    if (error) throw error;
    return data;
  }, "Failed to create portfolio item");
}

// Update portfolio item
export async function updatePortfolioItem(itemId: string, updates: UpdatePortfolioItemDTO) {
  return withErrorHandling(async () => {
    const { data, error } = await supabase
      .from("portfolio_items")
      .update(updates)
      .eq("id", itemId)
      .select()
      .single();
    if (error) throw error;
    return data;
  }, "Failed to update portfolio item");
}

// Delete portfolio item
export async function deletePortfolioItem(itemId: string) {
  return withErrorHandling(async () => {
    const { error } = await supabase
      .from("portfolio_items")
      .delete()
      .eq("id", itemId);
    if (error) throw error;
  }, "Failed to delete portfolio item");
}

// Toggle featured status
export async function toggleFeaturedStatus(itemId: string, isFeatured: boolean) {
  return withErrorHandling(async () => {
    const { data, error } = await supabase
      .from("portfolio_items")
      .update({ is_featured: isFeatured })
      .eq("id", itemId);
    if (error) throw error;
    return data;
  }, "Failed to update featured status");
}

// Initialize the storage bucket if it doesn't exist
export async function ensurePortfolioStorageBucket() {
  try {
    const { data } = await supabase.storage.getBucket('portfolio-media');
    if (!data) {
      await supabase.storage.createBucket('portfolio-media', {
        public: true,
        fileSizeLimit: 10485760, // 10MB
        allowedMimeTypes: [
          'image/png',
          'image/jpeg',
          'image/gif',
          'image/webp',
          'video/mp4',
          'video/webm'
        ]
      });
    }
  } catch (error) {
    console.error('Error ensuring storage bucket exists:', error);
  }
}
