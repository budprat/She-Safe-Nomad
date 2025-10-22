export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          interests: string[] | null
          languages: string[] | null
          location: string | null
          travel_experience: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          interests?: string[] | null
          languages?: string[] | null
          location?: string | null
          travel_experience?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          interests?: string[] | null
          languages?: string[] | null
          location?: string | null
          travel_experience?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      safety_discussions: {
        Row: {
          category: string | null
          content: string
          created_at: string | null
          id: string
          is_closed: boolean | null
          is_pinned: boolean | null
          location_reference: string | null
          title: string
          updated_at: string | null
          user_id: string
          view_count: number | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_closed?: boolean | null
          is_pinned?: boolean | null
          location_reference?: string | null
          title: string
          updated_at?: string | null
          user_id: string
          view_count?: number | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_closed?: boolean | null
          is_pinned?: boolean | null
          location_reference?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
          view_count?: number | null
        }
        Relationships: []
      }
      safety_locations: {
        Row: {
          address: string
          created_at: string | null
          cultural_sensitivity: string | null
          harassment_frequency: string | null
          id: string
          latitude: number
          lighting_quality: string | null
          location_type: string
          longitude: number
          name: string
          nighttime_safety: string | null
          overall_rating: number | null
          safety_zone: string
          security_presence: string | null
          staff_responsiveness: string | null
          updated_at: string | null
        }
        Insert: {
          address: string
          created_at?: string | null
          cultural_sensitivity?: string | null
          harassment_frequency?: string | null
          id?: string
          latitude: number
          lighting_quality?: string | null
          location_type: string
          longitude: number
          name: string
          nighttime_safety?: string | null
          overall_rating?: number | null
          safety_zone: string
          security_presence?: string | null
          staff_responsiveness?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string
          created_at?: string | null
          cultural_sensitivity?: string | null
          harassment_frequency?: string | null
          id?: string
          latitude?: number
          lighting_quality?: string | null
          location_type?: string
          longitude?: number
          name?: string
          nighttime_safety?: string | null
          overall_rating?: number | null
          safety_zone?: string
          security_presence?: string | null
          staff_responsiveness?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      safety_reports: {
        Row: {
          comments: string | null
          created_at: string | null
          cultural_sensitivity: string | null
          harassment_frequency: string | null
          id: string
          is_verified: boolean | null
          lighting_quality: string | null
          location_id: string
          nighttime_safety: string | null
          overall_rating: number
          security_presence: string | null
          staff_responsiveness: string | null
          travel_context: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comments?: string | null
          created_at?: string | null
          cultural_sensitivity?: string | null
          harassment_frequency?: string | null
          id?: string
          is_verified?: boolean | null
          lighting_quality?: string | null
          location_id: string
          nighttime_safety?: string | null
          overall_rating: number
          security_presence?: string | null
          staff_responsiveness?: string | null
          travel_context?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comments?: string | null
          created_at?: string | null
          cultural_sensitivity?: string | null
          harassment_frequency?: string | null
          id?: string
          is_verified?: boolean | null
          lighting_quality?: string | null
          location_id?: string
          nighttime_safety?: string | null
          overall_rating?: number
          security_presence?: string | null
          staff_responsiveness?: string | null
          travel_context?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "safety_reports_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "safety_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      travel_buddies: {
        Row: {
          age_range: string | null
          contact_preferences: Json | null
          created_at: string | null
          destination: string
          experience_level: string | null
          id: string
          interests: string[] | null
          is_active: boolean | null
          languages: string[] | null
          travel_dates_end: string
          travel_dates_start: string
          travel_type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          age_range?: string | null
          contact_preferences?: Json | null
          created_at?: string | null
          destination: string
          experience_level?: string | null
          id?: string
          interests?: string[] | null
          is_active?: boolean | null
          languages?: string[] | null
          travel_dates_end: string
          travel_dates_start: string
          travel_type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          age_range?: string | null
          contact_preferences?: Json | null
          created_at?: string | null
          destination?: string
          experience_level?: string | null
          id?: string
          interests?: string[] | null
          is_active?: boolean | null
          languages?: string[] | null
          travel_dates_end?: string
          travel_dates_start?: string
          travel_type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_verification: {
        Row: {
          created_at: string | null
          credibility_score: number | null
          documents_submitted: boolean | null
          id: string
          updated_at: string | null
          user_id: string
          verification_level: string | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          credibility_score?: number | null
          documents_submitted?: boolean | null
          id?: string
          updated_at?: string | null
          user_id: string
          verification_level?: string | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          credibility_score?: number | null
          documents_submitted?: boolean | null
          id?: string
          updated_at?: string | null
          user_id?: string
          verification_level?: string | null
          verified_at?: string | null
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
      [_ in never]: never
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
  public: {
    Enums: {},
  },
} as const
