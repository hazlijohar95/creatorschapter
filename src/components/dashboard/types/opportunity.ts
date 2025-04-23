
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
}

export interface Application {
  id: string;
  opportunity: {
    id: string;
    title: string;
    company: string;
    budget: string;
  };
  status: "pending" | "approved" | "rejected" | "in_discussion";
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
  sortBy: "relevance" | "newest" | "budget";
}

export type OpportunityTab = "discover" | "applications";
