export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      applications: {
        Row: {
          campaign_id: string
          created_at: string | null
          creator_id: string
          custom_message: string | null
          id: string
          match_score: number | null
          portfolio_links: string[] | null
          proposal: string | null
          proposed_budget: Json | null
          proposed_timeline: Json | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          campaign_id: string
          created_at?: string | null
          creator_id: string
          custom_message?: string | null
          id?: string
          match_score?: number | null
          portfolio_links?: string[] | null
          proposal?: string | null
          proposed_budget?: Json | null
          proposed_timeline?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          campaign_id?: string
          created_at?: string | null
          creator_id?: string
          custom_message?: string | null
          id?: string
          match_score?: number | null
          portfolio_links?: string[] | null
          proposal?: string | null
          proposed_budget?: Json | null
          proposed_timeline?: Json | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
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
          categories: string[] | null
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
          categories?: string[] | null
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
          categories?: string[] | null
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
      collaborations: {
        Row: {
          application_id: string
          brand_id: string
          campaign_id: string
          contract_terms: Json | null
          created_at: string | null
          creator_id: string
          deliverables_status: Json | null
          end_date: string | null
          id: string
          payment_status: string | null
          start_date: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          application_id: string
          brand_id: string
          campaign_id: string
          contract_terms?: Json | null
          created_at?: string | null
          creator_id: string
          deliverables_status?: Json | null
          end_date?: string | null
          id?: string
          payment_status?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          application_id?: string
          brand_id?: string
          campaign_id?: string
          contract_terms?: Json | null
          created_at?: string | null
          creator_id?: string
          deliverables_status?: Json | null
          end_date?: string | null
          id?: string
          payment_status?: string | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "collaborations_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaborations_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brand_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaborations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collaborations_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "creator_profiles"
            referencedColumns: ["id"]
          },
        ]
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
      notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          id: string
          message: string | null
          metadata: Json | null
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          metadata?: Json | null
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          id?: string
          message?: string | null
          metadata?: Json | null
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          avatar_url: string | null
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
          avatar_url?: string | null
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
          avatar_url?: string | null
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
      uuid_generate_v4: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
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
