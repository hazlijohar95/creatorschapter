
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserProfile, CreatorProfile, SocialLink } from "@/types/profiles";

export interface DiscoverableCreator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  categories: string[];
  followers: string;
  engagementRate: string;
  location: string;
  socialLinks?: SocialLink[];
}

interface UseCreatorsOptions {
  categories?: string[];
  minFollowers?: number;
  location?: string;
  searchQuery?: string;
  page?: number;
  pageSize?: number;
}

export function useCreators({
  categories = [],
  minFollowers = 0,
  location = "",
  searchQuery = "",
  page = 1,
  pageSize = 10
}: UseCreatorsOptions = {}) {
  const [creators, setCreators] = useState<DiscoverableCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setLoading(true);
        setError(null);

        // Start with profiles that are creators
        let query = supabase
          .from('profiles')
          .select(`
            *,
            creator_profiles!inner(*),
            social_links(*)
          `)
          .eq('role', 'creator')
          .range((page - 1) * pageSize, page * pageSize - 1);

        // Apply filters
        if (location && location.trim() !== '') {
          query = query.ilike('location', `%${location}%`);
        }

        if (searchQuery && searchQuery.trim() !== '') {
          query = query.or(`full_name.ilike.%${searchQuery}%,username.ilike.%${searchQuery}%,bio.ilike.%${searchQuery}%`);
        }

        if (categories && categories.length > 0) {
          query = query.contains('creator_profiles.categories', categories);
        }

        const { data, error: fetchError, count } = await query;

        if (fetchError) throw new Error(fetchError.message);

        // Transform database records to DiscoverableCreator format
        const transformedData: DiscoverableCreator[] = data?.map(record => {
          const profile = record as UserProfile & { 
            creator_profiles: CreatorProfile,
            social_links: SocialLink[]
          };
          
          // Format engagement rate to percentage string with one decimal
          const engagementRate = profile.creator_profiles?.engagement_rate 
            ? `${profile.creator_profiles.engagement_rate.toFixed(1)}%`
            : "N/A";
          
          // Determine follower count (in the future, this could come from integrated social media accounts)
          // For now, we'll use a placeholder based on the engagement rate to simulate realistic data
          const mockFollowerBase = profile.creator_profiles?.engagement_rate 
            ? Math.round((profile.creator_profiles.engagement_rate * 10000) / (Math.random() * 2 + 1))
            : Math.floor(Math.random() * 100000 + 5000);
            
          const followers = mockFollowerBase > 1000 
            ? `${(mockFollowerBase / 1000).toFixed(0)}K` 
            : mockFollowerBase.toString();

          return {
            id: profile.id,
            name: profile.full_name || "Anonymous Creator",
            handle: profile.username ? `@${profile.username}` : "unknown",
            avatar: "", // We'll add avatar handling later
            categories: profile.creator_profiles?.categories || [],
            followers,
            engagementRate,
            location: profile.location || "Location not specified",
            socialLinks: profile.social_links || []
          };
        }) || [];

        setCreators(transformedData);
        if (count !== null) setTotalCount(count);
        
      } catch (err) {
        console.error("Error fetching creators:", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch creators"));
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, [categories, minFollowers, location, searchQuery, page, pageSize]);

  return { creators, loading, error, totalCount, pageCount: Math.ceil(totalCount / pageSize) };
}
