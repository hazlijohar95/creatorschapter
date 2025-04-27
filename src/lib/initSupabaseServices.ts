
import { ensurePortfolioStorageBucket } from "@/services/portfolioService";

/**
 * Initialize Supabase services when the app loads
 */
export async function initSupabaseServices() {
  try {
    await ensurePortfolioStorageBucket();
    console.log("Supabase services initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Supabase services:", error);
  }
}
