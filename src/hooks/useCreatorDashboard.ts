
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export interface CreatorDashboardStats {
  activeOpportunities: number;
  portfolioViews: number;
  unreadMessages: number;
  activeCollaborations: number;
  changeData: {
    opportunitiesChange: string;
    viewsChange: string;
    messagesUnread: number;
    pendingReviews: number;
  };
}

export interface RecentOpportunity {
  id: string;
  title: string;
  brand: string;
  price: string;
  tag: string;
  tagStyle: string;
}

export interface FeaturedPortfolioItem {
  id: string;
  title: string;
  type: string;
  views: number;
}

export function useCreatorDashboard() {
  const { user } = useAuthStore();
  const userId = user?.id;

  // Fetch dashboard statistics
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["creatorDashboardStats", userId],
    queryFn: async (): Promise<CreatorDashboardStats> => {
      if (!userId) throw new Error("No user ID");
      
      // Get portfolio views count
      const { data: portfolioItems, error: portfolioError } = await supabase
        .from("portfolio_items")
        .select("view_count")
        .eq("creator_id", userId);
        
      if (portfolioError) throw portfolioError;
      
      // Calculate total views
      const totalViews = portfolioItems?.reduce((sum, item) => sum + (item.view_count || 0), 0) || 0;
      
      // Get active opportunities count (from campaigns table)
      const { data: opportunities, error: opportunitiesError } = await supabase
        .from("campaigns")
        .select("id", { count: "exact" })
        .eq("status", "active");
        
      if (opportunitiesError) throw opportunitiesError;
      
      // Get unread messages count
      const { data: unreadMessages, error: messagesError } = await supabase
        .from("messages")
        .select("id", { count: "exact" })
        .eq("receiver_id", userId)
        .is("read_at", null);
        
      if (messagesError) throw messagesError;
      
      // Get active collaborations (approved applications)
      const { data: collaborations, error: collabError } = await supabase
        .from("campaign_creators")
        .select("id", { count: "exact" })
        .eq("creator_id", userId)
        .eq("status", "approved");
        
      if (collabError) throw collabError;

      return {
        activeOpportunities: opportunities?.length || 0,
        portfolioViews: totalViews,
        unreadMessages: unreadMessages?.length || 0,
        activeCollaborations: collaborations?.length || 0,
        changeData: {
          opportunitiesChange: "+2 from last month", // In future, this could be calculated based on historical data
          viewsChange: "+23% from last month",
          messagesUnread: unreadMessages?.length || 0,
          pendingReviews: 1
        }
      };
    },
    enabled: !!userId
  });

  // Fetch recent opportunities
  const { data: recentOpportunities, isLoading: opportunitiesLoading } = useQuery({
    queryKey: ["recentOpportunities", userId],
    queryFn: async (): Promise<RecentOpportunity[]> => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("campaigns")
        .select(`
          id,
          name,
          description,
          budget,
          brand_profiles!brand_id(company_name),
          created_at
        `)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(3);
      
      if (error) throw error;
      
      return (data || []).map(item => {
        // Determine tag based on recency
        const createdDate = new Date(item.created_at);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
        
        let tag = daysDiff <= 1 ? "New" : `${daysDiff}d ago`;
        let tagStyle = daysDiff <= 1 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";
        
        // If budget is within certain ranges, mark as perfect match (simplified logic)
        if (item.budget && parseFloat(item.budget) >= 1000) {
          tag = "Perfect Match";
          tagStyle = "bg-blue-100 text-blue-800";
        }
        
        return {
          id: item.id,
          title: item.name,
          brand: item.brand_profiles?.company_name || "Brand",
          price: item.budget ? `$${item.budget}` : "TBD",
          tag,
          tagStyle
        };
      });
    },
    enabled: !!userId
  });

  // Fetch featured portfolio
  const { data: featuredPortfolio, isLoading: portfolioLoading } = useQuery({
    queryKey: ["featuredPortfolio", userId],
    queryFn: async (): Promise<FeaturedPortfolioItem[]> => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("portfolio_items")
        .select("id, title, media_url, view_count")
        .eq("creator_id", userId)
        .order("view_count", { ascending: false })
        .limit(2);
      
      if (error) throw error;
      
      return (data || []).map(item => ({
        id: item.id,
        title: item.title,
        type: item.media_url?.includes("video") ? "Video" : "Content",
        views: item.view_count || 0
      }));
    },
    enabled: !!userId
  });
  
  const isLoading = statsLoading || opportunitiesLoading || portfolioLoading;
  
  return {
    stats,
    recentOpportunities,
    featuredPortfolio,
    isLoading
  };
}
