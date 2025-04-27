
import { Json } from '@/integrations/supabase/types';
import { Enums } from '@/integrations/supabase/types';

// Define types for creator profile data structures
export interface TargetAudience {
  age_ranges?: string[];
  interests?: string[];
}

export interface PricingInfo {
  base_rate?: number;
  per_post?: number;
  packages?: {
    name: string;
    description: string;
    price: number;
  }[];
}

export interface CreatorProfile {
  id: string;
  categories?: string[] | null;
  collaboration_types?: Enums<"collaboration_type">[] | null;
  content_formats?: Enums<"content_format">[] | null;
  engagement_rate?: number | null;
  payment_preferences?: string[] | null;
  pricing_info?: PricingInfo | null;
  target_audience?: TargetAudience | null;
}

export interface UserProfile {
  id: string;
  role: 'creator' | 'brand';
  created_at?: string | null;
  updated_at?: string | null;
  website_url?: string | null;
  email?: string | null;
  username?: string | null;
  full_name?: string | null;
  bio?: string | null;
  location?: string | null;
}

export interface SocialLink {
  id: string;
  profile_id?: string | null;
  platform: string;
  url: string;
}
