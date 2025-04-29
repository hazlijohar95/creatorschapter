
import { ensurePortfolioStorageBucket } from "@/services/portfolioService";

/**
 * Initialize Supabase services when the app loads
 * Store initialization state in localStorage to prevent repeated API calls
 */
export async function initSupabaseServices() {
  try {
    // Check if we've already initialized storage in this session
    const storageInitialized = sessionStorage.getItem('supabase_storage_initialized');
    
    if (!storageInitialized) {
      await ensurePortfolioStorageBucket();
      // Mark as initialized for this session
      sessionStorage.setItem('supabase_storage_initialized', 'true');
      console.log("Supabase services initialized successfully");
    }
  } catch (error) {
    console.error("Failed to initialize Supabase services:", error);
  }
}
