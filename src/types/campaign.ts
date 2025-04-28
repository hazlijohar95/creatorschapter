
export interface Campaign {
  id: string;
  brand_id: string;
  name: string;
  description?: string;
  status: string;
  budget?: number;
  start_date?: string;
  end_date?: string;
  categories?: string[];
  created_at?: string;
  content_requirements?: {
    formats: string[];
    deliverables: string[];
    guidelines: string;
  };
  audience_requirements?: {
    minFollowers: number;
    preferredNiches: string[];
    preferredLocations: string[];
  };
}

export interface CampaignMetrics {
  id: string;
  campaign_id: string;
  date: string;
  impressions: number;
  clicks: number;
  conversions: number;
  engagement_rate: number;
  roi: number;
  created_at: string;
}

export interface CreateCampaignData {
  brandId: string;
  name: string;
  description?: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
  categories?: string[];
  status?: string;
  contentRequirements?: {
    formats: string[];
    deliverables: string[];
    guidelines: string;
  };
  audienceRequirements?: {
    minFollowers: number;
    preferredNiches: string[];
    preferredLocations: string[];
  };
}

export interface UpdateCampaignData {
  id?: string;
  name?: string;
  description?: string;
  budget?: number;
  startDate?: string;
  endDate?: string;
  categories?: string[];
  status?: string;
  contentRequirements?: {
    formats: string[];
    deliverables: string[];
    guidelines: string;
  };
  audienceRequirements?: {
    minFollowers: number;
    preferredNiches: string[];
    preferredLocations: string[];
  };
}
