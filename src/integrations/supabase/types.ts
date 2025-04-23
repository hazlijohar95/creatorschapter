export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      brand_profiles: {
        Row: {
          campaign_preferences: Json | null
          company_name: string | null
          company_size: string | null
          created_at: string | null
          id: string
          industry: string | null
          target_audience: Json | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          campaign_preferences?: Json | null
          company_name?: string | null
          company_size?: string | null
          created_at?: string | null
          id: string
          industry?: string | null
          target_audience?: Json | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          campaign_preferences?: Json | null
          company_name?: string | null
          company_size?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          target_audience?: Json | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      campaign_creators: {
        Row: {
          application_message: string | null
          brand_response: string | null
          campaign_id: string
          created_at: string | null
          creator_id: string
          id: string
          status: string | null
        }
        Insert: {
          application_message?: string | null
          brand_response?: string | null
          campaign_id: string
          created_at?: string | null
          creator_id: string
          id?: string
          status?: string | null
        }
        Update: {
          application_message?: string | null
          brand_response?: string | null
          campaign_id?: string
          created_at?: string | null
          creator_id?: string
          id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_creators_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_creators_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_metrics: {
        Row: {
          campaign_id: string
          clicks: number | null
          conversions: number | null
          created_at: string | null
          date: string | null
          engagement_rate: number | null
          id: string
          impressions: number | null
          roi: number | null
          updated_at: string | null
        }
        Insert: {
          campaign_id: string
          clicks?: number | null
          conversions?: number | null
          created_at?: string | null
          date?: string | null
          engagement_rate?: number | null
          id?: string
          impressions?: number | null
          roi?: number | null
          updated_at?: string | null
        }
        Update: {
          campaign_id?: string
          clicks?: number | null
          conversions?: number | null
          created_at?: string | null
          date?: string | null
          engagement_rate?: number | null
          id?: string
          impressions?: number | null
          roi?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_metrics_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          brand_id: string
          budget: number | null
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          name: string
          start_date: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          brand_id: string
          budget?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name: string
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          brand_id?: string
          budget?: number | null
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          name?: string
          start_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          brand_archived_at: string | null
          brand_id: string
          created_at: string | null
          creator_archived_at: string | null
          creator_id: string
          id: string
          last_message_at: string | null
          updated_at: string | null
        }
        Insert: {
          brand_archived_at?: string | null
          brand_id: string
          created_at?: string | null
          creator_archived_at?: string | null
          creator_id: string
          id?: string
          last_message_at?: string | null
          updated_at?: string | null
        }
        Update: {
          brand_archived_at?: string | null
          brand_id?: string
          created_at?: string | null
          creator_archived_at?: string | null
          creator_id?: string
          id?: string
          last_message_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      creator_profiles: {
        Row: {
          categories: string[] | null
          collaboration_types:
            | Database["public"]["Enums"]["collaboration_type"][]
            | null
          content_formats:
            | Database["public"]["Enums"]["content_format"][]
            | null
          engagement_rate: number | null
          id: string
          payment_preferences: string[] | null
          pricing_info: Json | null
          target_audience: Json | null
        }
        Insert: {
          categories?: string[] | null
          collaboration_types?:
            | Database["public"]["Enums"]["collaboration_type"][]
            | null
          content_formats?:
            | Database["public"]["Enums"]["content_format"][]
            | null
          engagement_rate?: number | null
          id: string
          payment_preferences?: string[] | null
          pricing_info?: Json | null
          target_audience?: Json | null
        }
        Update: {
          categories?: string[] | null
          collaboration_types?:
            | Database["public"]["Enums"]["collaboration_type"][]
            | null
          content_formats?:
            | Database["public"]["Enums"]["content_format"][]
            | null
          engagement_rate?: number | null
          id?: string
          payment_preferences?: string[] | null
          pricing_info?: Json | null
          target_audience?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "creator_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          deleted_at: string | null
          id: string
          read_at: string | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          read_at?: string | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          read_at?: string | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      portfolio_items: {
        Row: {
          avg_view_duration: number | null
          created_at: string | null
          creator_id: string | null
          description: string | null
          external_link: string | null
          id: string
          is_featured: boolean | null
          media_url: string | null
          title: string
          unique_views: number | null
          view_count: number | null
        }
        Insert: {
          avg_view_duration?: number | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          external_link?: string | null
          id?: string
          is_featured?: boolean | null
          media_url?: string | null
          title: string
          unique_views?: number | null
          view_count?: number | null
        }
        Update: {
          avg_view_duration?: number | null
          created_at?: string | null
          creator_id?: string | null
          description?: string | null
          external_link?: string | null
          id?: string
          is_featured?: boolean | null
          media_url?: string | null
          title?: string
          unique_views?: number | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_items_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_views: {
        Row: {
          created_at: string | null
          id: string
          portfolio_item_id: string | null
          view_duration: number | null
          viewer_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          portfolio_item_id?: string | null
          view_duration?: number | null
          viewer_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          portfolio_item_id?: string | null
          view_duration?: number | null
          viewer_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_views_portfolio_item_id_fkey"
            columns: ["portfolio_item_id"]
            isOneToOne: false
            referencedRelation: "portfolio_items"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          location: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          username: string | null
          website_url: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          location?: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          username?: string | null
          website_url?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          username?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      social_links: {
        Row: {
          id: string
          platform: string
          profile_id: string | null
          url: string
        }
        Insert: {
          id?: string
          platform: string
          profile_id?: string | null
          url: string
        }
        Update: {
          id?: string
          platform?: string
          profile_id?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_links_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      waitlist_submissions: {
        Row: {
          created_at: string
          email: string
          follower_count: string | null
          id: string
          name: string
          niche: string | null
          social_handle: string | null
        }
        Insert: {
          created_at?: string
          email: string
          follower_count?: string | null
          id?: string
          name: string
          niche?: string | null
          social_handle?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          follower_count?: string | null
          id?: string
          name?: string
          niche?: string | null
          social_handle?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      collaboration_type:
        | "sponsored_post"
        | "product_review"
        | "brand_ambassador"
        | "affiliate_marketing"
        | "event_appearance"
        | "content_creation"
      content_format:
        | "video"
        | "photo"
        | "blog"
        | "podcast"
        | "livestream"
        | "story"
      user_role: "creator" | "brand"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      collaboration_type: [
        "sponsored_post",
        "product_review",
        "brand_ambassador",
        "affiliate_marketing",
        "event_appearance",
        "content_creation",
      ],
      content_format: [
        "video",
        "photo",
        "blog",
        "podcast",
        "livestream",
        "story",
      ],
      user_role: ["creator", "brand"],
    },
  },
} as const
