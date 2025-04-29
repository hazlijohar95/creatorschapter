
/**
 * Portfolio related type definitions
 */

export interface PortfolioItem {
  id: string;
  creator_id: string | null;
  title: string;
  description?: string | null;
  media_url?: string | null;
  external_link?: string | null;
  is_featured: boolean;
  created_at?: string | null;
  view_count?: number | null;
  unique_views?: number | null;
  avg_view_duration?: number | null;
}

export interface CreatePortfolioItemDTO {
  title: string;
  description?: string | null;
  media_url?: string | null;
  external_link?: string | null;
  is_featured?: boolean;
}

export interface UpdatePortfolioItemDTO extends Partial<CreatePortfolioItemDTO> {
  id: string;
}
