
export type Status = "pending" | "approved" | "rejected" | "in_discussion";

export interface Application {
  id: string;
  creatorName: string;
  creatorHandle: string;
  avatar: string;
  campaign: string;
  date: string;
  status: Status;
  message: string;
  categories: string[];
  match: number;
  isNew: boolean;
  budget: string;
  audienceSize?: string;
  engagement?: string;
  notes?: string[];
}

export interface ApplicationNote {
  id: string;
  content: string;
  createdAt: string;
  authorName?: string;
}

// Validation response shape
export interface ValidationResult {
  success: boolean;
  message?: string;
}

// API response shapes
export interface ApplicationApiResponse {
  id: string;
  created_at: string;
  campaign_id: string;
  creator_id: string;
  status: Status;
  application_message?: string;
  brand_response?: string;
  campaigns?: {
    id: string;
    name: string;
    description?: string;
    budget?: number;
  };
  profiles?: {
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
}
