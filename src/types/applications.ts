
export type Status = "pending" | "approved" | "rejected" | "in_discussion";

export interface Application {
  id: string;  // Changed from number to string to match UUID
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
