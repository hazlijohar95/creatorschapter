
import { ApplicationStatus } from "../shared/status";

/**
 * Application related type definitions
 */

export interface Application {
  id: string;
  creatorName: string;
  creatorHandle: string;
  avatar: string;
  campaign: string;
  date: string;
  status: ApplicationStatus;
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

// API response shapes - Updated to match actual database response structure
export interface ApplicationApiResponse {
  id: string;
  created_at: string;
  status: string; // Changed from Status to string to match DB response
  application_message?: string;
  brand_response?: string;
  // These fields are only in some responses
  campaign_id?: string;
  creator_id?: string;
  // Nested objects
  campaigns?: {
    id: string;
    name: string;
    description?: string;
    budget?: number;
  };
  profiles?: {
    id?: string;
    full_name?: string;
    username?: string;
    avatar_url?: string;
  };
}

// Re-export ApplicationStatus as a type for other files that need it
export type { ApplicationStatus };
