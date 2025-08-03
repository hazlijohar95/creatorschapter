/**
 * Authentication and user-related type definitions
 */

export interface UserProfile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  role: 'creator' | 'brand';
  email: string;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role?: 'creator' | 'brand';
  full_name?: string;
  avatar_url?: string;
  username?: string;
}

export interface OnboardingData {
  identity: {
    fullName: string;
    username: string;
    bio: string;
    location: string;
    website?: string;
  };
  portfolio?: {
    items: PortfolioItem[];
  };
  social?: {
    platforms: SocialPlatform[];
  };
}

export interface PortfolioItem {
  id?: string;
  title: string;
  description: string;
  url?: string;
  media_url?: string;
  media_type?: 'image' | 'video';
  is_featured: boolean;
  created_at?: string;
}

export interface SocialPlatform {
  platform: string;
  handle: string;
  followers?: number;
  engagement_rate?: number;
  url: string;
}

export interface BrandProfile extends UserProfile {
  company_name: string | null;
  company_size: string | null;
  industry: string | null;
  website: string | null;
  target_audience: Record<string, unknown> | null;
  campaign_preferences: Record<string, unknown> | null;
}

export interface CreatorProfile extends UserProfile {
  bio: string | null;
  location: string | null;
  website: string | null;
  pricing_info: Record<string, unknown> | null;
  target_audience: Record<string, unknown> | null;
  social_links: Record<string, string> | null;
}