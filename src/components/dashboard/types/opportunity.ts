
export type OpportunityStatus = "open" | "pending" | "closed" | "expired";
export type ApplicationStatus = "pending" | "approved" | "rejected" | "in_discussion";
export type SortByOption = "relevance" | "newest" | "budget" | "deadline";

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  budget: string;
  description: string;
  match: number;
  tags: string[];
  deadline: string;
  isNew: boolean;
  createdAt: string; // ISO string format
  status?: OpportunityStatus;
  requirements?: string[];
  location?: string;
  skills?: string[];
  platforms?: string[];
}

export interface Application {
  id: string;
  opportunity: {
    id: string;
    title: string;
    company: string;
    budget: string;
  };
  status: ApplicationStatus;
  appliedDate: string; // Date string
  lastUpdateDate: string; // Date string
  message: string;
  brandResponse?: string;
}

export interface FilterOptions {
  search: string;
  categories: string[];
  minBudget: number | null;
  maxBudget: number | null;
  sortBy: SortByOption;
  status?: OpportunityStatus[];
  deadlineBefore?: string;
  deadlineAfter?: string;
}

export type OpportunityTab = "discover" | "applications";

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
}
