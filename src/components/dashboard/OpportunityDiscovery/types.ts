
export interface CampaignProfile {
  full_name: string;
  username: string;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  budget: number;
  start_date: string | null;
  end_date: string | null;
  categories?: string[] | null;
  status: string;
  profiles: CampaignProfile;
}

export interface ApplicationStatus {
  hasApplied: boolean;
  status: string | null;
}
