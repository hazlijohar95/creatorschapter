/**
 * Form-related type definitions
 */

export interface CampaignFormData {
  id?: string;
  name: string;
  description: string;
  budget: number;
  categories: string[];
  requirements: string;
  timeline: {
    start_date: string;
    end_date: string;
    application_deadline: string;
  };
  deliverables: string[];
  target_audience: {
    age_range: string;
    demographics: string[];
    interests: string[];
  };
  brand_id?: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
}

export interface ProfileUpdateData {
  full_name?: string;
  username?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar_url?: string;
}

export interface BrandIdentityFormData {
  company_name: string;
  industry: string;
  company_size: string;
  website: string;
  description: string;
  mission: string;
  values: string[];
  target_audience: {
    demographics: string;
    interests: string[];
    pain_points: string[];
  };
}

export interface CampaignPreferencesFormData {
  preferred_content_types: string[];
  collaboration_style: string;
  communication_frequency: string;
  budget_range: {
    min: number;
    max: number;
  };
  campaign_duration_preference: string;
  requirements: string;
}

export interface SecuritySettingsFormData {
  current_password: string;
  new_password: string;
  confirm_password: string;
  two_factor_enabled: boolean;
}

export interface FormFieldError {
  field: string;
  message: string;
}

export interface FormValidationResult {
  isValid: boolean;
  errors: FormFieldError[];
}

// Generic form state interface
export interface FormState<T> {
  data: T;
  errors: FormFieldError[];
  isLoading: boolean;
  isDirty: boolean;
  isValid: boolean;
}