
import { Application, ApplicationApiResponse, ApplicationStatus } from "@/types/domain/application";

/**
 * Transforms raw application API response to Application interface
 */
export function transformApplicationData(item: ApplicationApiResponse): Application {
  return {
    id: item.id,
    creatorName: item.profiles?.full_name || "Anonymous",
    creatorHandle: item.profiles?.username || "@unknown",
    avatar: item.profiles?.avatar_url || "",
    campaign: item.campaigns?.name || "Unknown Campaign",
    date: new Date(item.created_at).toLocaleDateString(),
    status: item.status as ApplicationStatus, // Cast string to Status type
    message: item.application_message || "",
    categories: [],  // Default empty array
    match: 85,  // Default match score
    isNew: false,  // Default isNew status
    budget: item.campaigns?.budget ? `$${item.campaigns.budget}` : "Unspecified",
    notes: item.brand_response ? [item.brand_response] : []
  };
}

/**
 * Validates an application object
 */
export function validateApplication(application: Partial<Application>): boolean {
  const requiredFields: Array<keyof Application> = [
    'id', 'creatorName', 'status', 'campaign'
  ];
  
  for (const field of requiredFields) {
    if (application[field] === undefined || application[field] === null) {
      console.error(`Application validation failed: missing ${field}`);
      return false;
    }
  }
  
  return true;
}
