
// Define all query keys in one place for consistency
export const queryKeys = {
  // User related
  userProfile: (userId: string) => ['profile', userId],
  creatorProfile: (userId: string) => ['creator-profile', userId],
  brandProfile: (userId: string) => ['brand-profile', userId],
  
  // Creator related
  portfolioItems: (creatorId: string) => ['portfolio', creatorId],
  creatorCollaborations: (creatorId: string) => ['collaborations', creatorId],
  
  // Brand related
  campaigns: (brandId: string) => ['campaigns', brandId],
  applications: (brandId: string) => ['applications', brandId],
  brandMetrics: (brandId: string) => ['metrics', brandId],
  
  // Messaging
  conversations: (userId: string) => ['conversations', userId],
  messages: (conversationId: string) => ['messages', conversationId],
} as const;

