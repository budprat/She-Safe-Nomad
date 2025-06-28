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
      agent_knowledge_chunks: {
        Row: {
          agent_id: string
          content: string
          created_at: string | null
          embedding: string | null
          id: string
          metadata: Json | null
          updated_at: string | null
        }
        Insert: {
          agent_id: string
          content: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          updated_at?: string | null
        }
        Update: {
          agent_id?: string
          content?: string
          created_at?: string | null
          embedding?: string | null
          id?: string
          metadata?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "agent_knowledge_chunks_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      agent_templates: {
        Row: {
          category: string | null
          created_at: string | null
          default_config: Json | null
          description: string | null
          icon_url: string | null
          id: string
          is_public: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          default_config?: Json | null
          description?: string | null
          icon_url?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          default_config?: Json | null
          description?: string | null
          icon_url?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      agents: {
        Row: {
          branding_config: Json | null
          created_at: string | null
          deployment_config: Json | null
          description: string | null
          id: string
          is_active: boolean | null
          knowledge_base: Json | null
          name: string
          persona_config: Json | null
          template_id: string | null
          updated_at: string | null
          user_id: string
          workflow_config: Json | null
        }
        Insert: {
          branding_config?: Json | null
          created_at?: string | null
          deployment_config?: Json | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          knowledge_base?: Json | null
          name: string
          persona_config?: Json | null
          template_id?: string | null
          updated_at?: string | null
          user_id: string
          workflow_config?: Json | null
        }
        Update: {
          branding_config?: Json | null
          created_at?: string | null
          deployment_config?: Json | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          knowledge_base?: Json | null
          name?: string
          persona_config?: Json | null
          template_id?: string | null
          updated_at?: string | null
          user_id?: string
          workflow_config?: Json | null
        }
        Relationships: []
      }
      audio_briefings: {
        Row: {
          audio_url: string | null
          briefing_type: string
          created_at: string | null
          duration_seconds: number | null
          id: string
          portfolio_id: string | null
          transcript: string | null
        }
        Insert: {
          audio_url?: string | null
          briefing_type: string
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          portfolio_id?: string | null
          transcript?: string | null
        }
        Update: {
          audio_url?: string | null
          briefing_type?: string
          created_at?: string | null
          duration_seconds?: number | null
          id?: string
          portfolio_id?: string | null
          transcript?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audio_briefings_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolio_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audio_briefings_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown | null
          new_values: Json | null
          old_values: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          new_values?: Json | null
          old_values?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      badges: {
        Row: {
          badge_type: string
          created_at: string | null
          criteria: Json | null
          description: string
          icon_url: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          badge_type: string
          created_at?: string | null
          criteria?: Json | null
          description: string
          icon_url?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          badge_type?: string
          created_at?: string | null
          criteria?: Json | null
          description?: string
          icon_url?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      business_certifications: {
        Row: {
          application_status: string
          business_email: string
          business_name: string
          certification_expires_at: string | null
          certification_features: Json | null
          certification_level: string
          certified_by: string | null
          contact_person: string | null
          contact_phone: string | null
          created_at: string
          id: string
          location_id: string
          updated_at: string
        }
        Insert: {
          application_status?: string
          business_email: string
          business_name: string
          certification_expires_at?: string | null
          certification_features?: Json | null
          certification_level: string
          certified_by?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          location_id: string
          updated_at?: string
        }
        Update: {
          application_status?: string
          business_email?: string
          business_name?: string
          certification_expires_at?: string | null
          certification_features?: Json | null
          certification_level?: string
          certified_by?: string | null
          contact_person?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          location_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_certifications_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "safety_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      challenges: {
        Row: {
          challenge_type: string | null
          company_id: string | null
          company_logo_url: string | null
          company_name: string | null
          created_at: string | null
          data_pack_description: string | null
          data_pack_url: string | null
          deliverables: Json
          description: string
          difficulty_level: string | null
          domains: string[]
          evaluation_rubric: Json
          id: string
          image_url: string | null
          image_urls: Json | null
          prize_amount: number | null
          prize_description: string | null
          problem_statement: string
          status: string | null
          submission_deadline: string
          title: string
          updated_at: string | null
        }
        Insert: {
          challenge_type?: string | null
          company_id?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          created_at?: string | null
          data_pack_description?: string | null
          data_pack_url?: string | null
          deliverables?: Json
          description: string
          difficulty_level?: string | null
          domains: string[]
          evaluation_rubric?: Json
          id?: string
          image_url?: string | null
          image_urls?: Json | null
          prize_amount?: number | null
          prize_description?: string | null
          problem_statement: string
          status?: string | null
          submission_deadline: string
          title: string
          updated_at?: string | null
        }
        Update: {
          challenge_type?: string | null
          company_id?: string | null
          company_logo_url?: string | null
          company_name?: string | null
          created_at?: string | null
          data_pack_description?: string | null
          data_pack_url?: string | null
          deliverables?: Json
          description?: string
          difficulty_level?: string | null
          domains?: string[]
          evaluation_rubric?: Json
          id?: string
          image_url?: string | null
          image_urls?: Json | null
          prize_amount?: number | null
          prize_description?: string | null
          problem_statement?: string
          status?: string | null
          submission_deadline?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "challenges_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          title: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      discussion_replies: {
        Row: {
          content: string
          created_at: string
          discussion_id: string
          id: string
          is_solution: boolean | null
          parent_reply_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          discussion_id: string
          id?: string
          is_solution?: boolean | null
          parent_reply_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          discussion_id?: string
          id?: string
          is_solution?: boolean | null
          parent_reply_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "discussion_replies_discussion_id_fkey"
            columns: ["discussion_id"]
            isOneToOne: false
            referencedRelation: "safety_discussions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "discussion_replies_parent_reply_id_fkey"
            columns: ["parent_reply_id"]
            isOneToOne: false
            referencedRelation: "discussion_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          content: string | null
          embedding: string | null
          id: number
          metadata: Json | null
        }
        Insert: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Update: {
          content?: string | null
          embedding?: string | null
          id?: number
          metadata?: Json | null
        }
        Relationships: []
      }
      file_metadata: {
        Row: {
          created_at: string | null
          file_path: string
          file_size: number
          id: string
          mime_type: string
          original_name: string
          scan_results: Json | null
          scan_status: string | null
          updated_at: string | null
          uploaded_by: string
        }
        Insert: {
          created_at?: string | null
          file_path: string
          file_size: number
          id?: string
          mime_type: string
          original_name: string
          scan_results?: Json | null
          scan_status?: string | null
          updated_at?: string | null
          uploaded_by: string
        }
        Update: {
          created_at?: string | null
          file_path?: string
          file_size?: number
          id?: string
          mime_type?: string
          original_name?: string
          scan_results?: Json | null
          scan_status?: string | null
          updated_at?: string | null
          uploaded_by?: string
        }
        Relationships: []
      }
      file_uploads: {
        Row: {
          agent_id: string | null
          bucket_name: string
          created_at: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id: string
          mime_type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          agent_id?: string | null
          bucket_name: string
          created_at?: string | null
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          id?: string
          mime_type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          agent_id?: string | null
          bucket_name?: string
          created_at?: string | null
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          id?: string
          mime_type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "file_uploads_agent_id_fkey"
            columns: ["agent_id"]
            isOneToOne: false
            referencedRelation: "agents"
            referencedColumns: ["id"]
          },
        ]
      }
      investment_research: {
        Row: {
          confidence_level: string | null
          created_at: string | null
          fundamental_score: number | null
          id: string
          sentiment_score: number | null
          symbol: string
          target_price: number | null
          technical_score: number | null
          thesis_summary: string | null
          updated_at: string | null
        }
        Insert: {
          confidence_level?: string | null
          created_at?: string | null
          fundamental_score?: number | null
          id?: string
          sentiment_score?: number | null
          symbol: string
          target_price?: number | null
          technical_score?: number | null
          thesis_summary?: string | null
          updated_at?: string | null
        }
        Update: {
          confidence_level?: string | null
          created_at?: string | null
          fundamental_score?: number | null
          id?: string
          sentiment_score?: number | null
          symbol?: string
          target_price?: number | null
          technical_score?: number | null
          thesis_summary?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      market_trends: {
        Row: {
          correlation_coefficient: number | null
          id: string
          lead_lag_days: number | null
          search_term: string
          symbol: string
          timestamp: string | null
          trend_score: number | null
        }
        Insert: {
          correlation_coefficient?: number | null
          id?: string
          lead_lag_days?: number | null
          search_term: string
          symbol: string
          timestamp?: string | null
          trend_score?: number | null
        }
        Update: {
          correlation_coefficient?: number | null
          id?: string
          lead_lag_days?: number | null
          search_term?: string
          symbol?: string
          timestamp?: string | null
          trend_score?: number | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          is_saved: boolean | null
          is_user: boolean
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          is_saved?: boolean | null
          is_user: boolean
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_saved?: boolean | null
          is_user?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      portfolios: {
        Row: {
          cash_balance: number | null
          id: string
          last_updated: string | null
          total_value: number | null
          user_id: string
        }
        Insert: {
          cash_balance?: number | null
          id?: string
          last_updated?: string | null
          total_value?: number | null
          user_id: string
        }
        Update: {
          cash_balance?: number | null
          id?: string
          last_updated?: string | null
          total_value?: number | null
          user_id?: string
        }
        Relationships: []
      }
      positions: {
        Row: {
          created_at: string | null
          current_price: number | null
          entry_date: string | null
          entry_price: number | null
          exit_date: string | null
          exit_price: number | null
          id: string
          portfolio_id: string | null
          position_type: string | null
          profit_loss: number | null
          quantity: number
          symbol: string
        }
        Insert: {
          created_at?: string | null
          current_price?: number | null
          entry_date?: string | null
          entry_price?: number | null
          exit_date?: string | null
          exit_price?: number | null
          id?: string
          portfolio_id?: string | null
          position_type?: string | null
          profit_loss?: number | null
          quantity: number
          symbol: string
        }
        Update: {
          created_at?: string | null
          current_price?: number | null
          entry_date?: string | null
          entry_price?: number | null
          exit_date?: string | null
          exit_price?: number | null
          id?: string
          portfolio_id?: string | null
          position_type?: string | null
          profit_loss?: number | null
          quantity?: number
          symbol?: string
        }
        Relationships: [
          {
            foreignKeyName: "positions_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolio_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "positions_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          cv_url: string | null
          experience_level: string | null
          full_name: string | null
          github_url: string | null
          id: string
          linkedin_url: string | null
          location: string | null
          portfolio_url: string | null
          skills: string[] | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          cv_url?: string | null
          experience_level?: string | null
          full_name?: string | null
          github_url?: string | null
          id: string
          linkedin_url?: string | null
          location?: string | null
          portfolio_url?: string | null
          skills?: string[] | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          cv_url?: string | null
          experience_level?: string | null
          full_name?: string | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          location?: string | null
          portfolio_url?: string | null
          skills?: string[] | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      risk_metrics: {
        Row: {
          calculated_at: string | null
          correlation_score: number | null
          id: string
          max_drawdown: number | null
          portfolio_id: string | null
          sharpe_ratio: number | null
          var_95: number | null
        }
        Insert: {
          calculated_at?: string | null
          correlation_score?: number | null
          id?: string
          max_drawdown?: number | null
          portfolio_id?: string | null
          sharpe_ratio?: number | null
          var_95?: number | null
        }
        Update: {
          calculated_at?: string | null
          correlation_score?: number | null
          id?: string
          max_drawdown?: number | null
          portfolio_id?: string | null
          sharpe_ratio?: number | null
          var_95?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "risk_metrics_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolio_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "risk_metrics_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      rules_guidelines: {
        Row: {
          challenge_id: string | null
          created_at: string | null
          description: string
          id: string
          is_mandatory: boolean | null
          order_index: number | null
          rule_type: string
          title: string
          updated_at: string | null
        }
        Insert: {
          challenge_id?: string | null
          created_at?: string | null
          description: string
          id?: string
          is_mandatory?: boolean | null
          order_index?: number | null
          rule_type: string
          title: string
          updated_at?: string | null
        }
        Update: {
          challenge_id?: string | null
          created_at?: string | null
          description?: string
          id?: string
          is_mandatory?: boolean | null
          order_index?: number | null
          rule_type?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rules_guidelines_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      safety_alerts: {
        Row: {
          alert_type: string
          created_at: string
          created_by: string
          description: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          location_id: string
          severity: string
          title: string
          updated_at: string
          verified_by: string | null
        }
        Insert: {
          alert_type: string
          created_at?: string
          created_by: string
          description: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          location_id: string
          severity: string
          title: string
          updated_at?: string
          verified_by?: string | null
        }
        Update: {
          alert_type?: string
          created_at?: string
          created_by?: string
          description?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          location_id?: string
          severity?: string
          title?: string
          updated_at?: string
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "safety_alerts_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "safety_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      safety_discussions: {
        Row: {
          category: string | null
          content: string
          created_at: string
          id: string
          is_closed: boolean | null
          is_pinned: boolean | null
          location_reference: string | null
          title: string
          updated_at: string
          user_id: string
          view_count: number | null
        }
        Insert: {
          category?: string | null
          content: string
          created_at?: string
          id?: string
          is_closed?: boolean | null
          is_pinned?: boolean | null
          location_reference?: string | null
          title: string
          updated_at?: string
          user_id: string
          view_count?: number | null
        }
        Update: {
          category?: string | null
          content?: string
          created_at?: string
          id?: string
          is_closed?: boolean | null
          is_pinned?: boolean | null
          location_reference?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          view_count?: number | null
        }
        Relationships: []
      }
      safety_locations: {
        Row: {
          address: string
          created_at: string
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
          updated_at: string
        }
        Insert: {
          address: string
          created_at?: string
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
          safety_zone?: string
          security_presence?: string | null
          staff_responsiveness?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          created_at?: string
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
          updated_at?: string
        }
        Relationships: []
      }
      safety_reports: {
        Row: {
          comments: string | null
          created_at: string
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
          updated_at: string
          user_id: string
        }
        Insert: {
          comments?: string | null
          created_at?: string
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
          updated_at?: string
          user_id: string
        }
        Update: {
          comments?: string | null
          created_at?: string
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
          updated_at?: string
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
      scores: {
        Row: {
          company_id: string | null
          created_at: string | null
          evaluator_id: string | null
          feedback: string | null
          id: string
          innovation: number
          llm_scores: Json | null
          practicality: number
          pre_screening_score: number | null
          presentation: number
          sponsor_id: string | null
          status: string | null
          submission_id: string | null
          technical_implementation: number
          total_score: number | null
          updated_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          evaluator_id?: string | null
          feedback?: string | null
          id: string
          innovation?: number
          llm_scores?: Json | null
          practicality?: number
          pre_screening_score?: number | null
          presentation?: number
          sponsor_id?: string | null
          status?: string | null
          submission_id?: string | null
          technical_implementation?: number
          total_score?: number | null
          updated_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          evaluator_id?: string | null
          feedback?: string | null
          id?: string
          innovation?: number
          llm_scores?: Json | null
          practicality?: number
          pre_screening_score?: number | null
          presentation?: number
          sponsor_id?: string | null
          status?: string | null
          submission_id?: string | null
          technical_implementation?: number
          total_score?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scores_submission_id_fkey"
            columns: ["submission_id"]
            isOneToOne: false
            referencedRelation: "submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      sentiment_data: {
        Row: {
          id: string
          sentiment_score: number | null
          source: string
          symbol: string
          timestamp: string | null
          volume_score: number | null
        }
        Insert: {
          id?: string
          sentiment_score?: number | null
          source: string
          symbol: string
          timestamp?: string | null
          volume_score?: number | null
        }
        Update: {
          id?: string
          sentiment_score?: number | null
          source?: string
          symbol?: string
          timestamp?: string | null
          volume_score?: number | null
        }
        Relationships: []
      }
      submissions: {
        Row: {
          challenge_id: string
          created_at: string | null
          demo_video_url: string
          final_score: number | null
          human_feedback: Json | null
          id: string
          llm_feedback: Json | null
          participant_id: string
          pitch_deck_url: string
          provisional_score: number | null
          rank: number | null
          readme_notes: string | null
          repository_url: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          challenge_id: string
          created_at?: string | null
          demo_video_url: string
          final_score?: number | null
          human_feedback?: Json | null
          id?: string
          llm_feedback?: Json | null
          participant_id: string
          pitch_deck_url: string
          provisional_score?: number | null
          rank?: number | null
          readme_notes?: string | null
          repository_url: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          challenge_id?: string
          created_at?: string | null
          demo_video_url?: string
          final_score?: number | null
          human_feedback?: Json | null
          id?: string
          llm_feedback?: Json | null
          participant_id?: string
          pitch_deck_url?: string
          provisional_score?: number | null
          rank?: number | null
          readme_notes?: string | null
          repository_url?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "submissions_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "submissions_participant_id_fkey"
            columns: ["participant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trading_signals: {
        Row: {
          agent_name: string
          confidence_score: number | null
          created_at: string | null
          id: string
          reasoning: string | null
          signal_type: string
          symbol: string
        }
        Insert: {
          agent_name: string
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          reasoning?: string | null
          signal_type: string
          symbol: string
        }
        Update: {
          agent_name?: string
          confidence_score?: number | null
          created_at?: string | null
          id?: string
          reasoning?: string | null
          signal_type?: string
          symbol?: string
        }
        Relationships: []
      }
      travel_buddies: {
        Row: {
          age_range: string | null
          contact_preferences: Json | null
          created_at: string
          destination: string
          experience_level: string | null
          id: string
          interests: string[] | null
          is_active: boolean | null
          languages: string[] | null
          travel_dates_end: string
          travel_dates_start: string
          travel_type: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age_range?: string | null
          contact_preferences?: Json | null
          created_at?: string
          destination: string
          experience_level?: string | null
          id?: string
          interests?: string[] | null
          is_active?: boolean | null
          languages?: string[] | null
          travel_dates_end: string
          travel_dates_start: string
          travel_type?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age_range?: string | null
          contact_preferences?: Json | null
          created_at?: string
          destination?: string
          experience_level?: string | null
          id?: string
          interests?: string[] | null
          is_active?: boolean | null
          languages?: string[] | null
          travel_dates_end?: string
          travel_dates_start?: string
          travel_type?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      upload_rate_limit: {
        Row: {
          id: string
          upload_count: number | null
          user_id: string
          window_start: string | null
        }
        Insert: {
          id?: string
          upload_count?: number | null
          user_id: string
          window_start?: string | null
        }
        Update: {
          id?: string
          upload_count?: number | null
          user_id?: string
          window_start?: string | null
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_id: string
          challenge_id: string | null
          created_at: string | null
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_id: string
          challenge_id?: string | null
          created_at?: string | null
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          badge_id?: string
          challenge_id?: string | null
          created_at?: string | null
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_files: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string
          id: string
          mime_type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type: string
          id?: string
          mime_type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string
          id?: string
          mime_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: number
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string | null
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          last_activity: string | null
          session_token: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          session_token: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string | null
          session_token?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_verification: {
        Row: {
          countries_visited: number | null
          created_at: string
          credibility_score: number | null
          id: string
          safety_reports_count: number | null
          travel_experience_years: number | null
          updated_at: string
          user_id: string
          verification_documents: Json | null
          verification_level: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          countries_visited?: number | null
          created_at?: string
          credibility_score?: number | null
          id?: string
          safety_reports_count?: number | null
          travel_experience_years?: number | null
          updated_at?: string
          user_id: string
          verification_documents?: Json | null
          verification_level?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          countries_visited?: number | null
          created_at?: string
          credibility_score?: number | null
          id?: string
          safety_reports_count?: number | null
          travel_experience_years?: number | null
          updated_at?: string
          user_id?: string
          verification_documents?: Json | null
          verification_level?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      webhook_configs: {
        Row: {
          created_at: string | null
          events: string[]
          id: string
          is_active: boolean
          name: string
          retry_count: number
          secret_key: string | null
          timeout_seconds: number
          updated_at: string | null
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          events?: string[]
          id?: string
          is_active?: boolean
          name: string
          retry_count?: number
          secret_key?: string | null
          timeout_seconds?: number
          updated_at?: string | null
          url: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          events?: string[]
          id?: string
          is_active?: boolean
          name?: string
          retry_count?: number
          secret_key?: string | null
          timeout_seconds?: number
          updated_at?: string | null
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      webhook_deliveries: {
        Row: {
          attempt_count: number
          created_at: string | null
          delivered_at: string | null
          event_type: string
          id: string
          next_retry_at: string | null
          payload: Json
          response_body: string | null
          response_status: number | null
          status: string
          webhook_config_id: string
        }
        Insert: {
          attempt_count?: number
          created_at?: string | null
          delivered_at?: string | null
          event_type: string
          id?: string
          next_retry_at?: string | null
          payload: Json
          response_body?: string | null
          response_status?: number | null
          status?: string
          webhook_config_id: string
        }
        Update: {
          attempt_count?: number
          created_at?: string | null
          delivered_at?: string | null
          event_type?: string
          id?: string
          next_retry_at?: string | null
          payload?: Json
          response_body?: string | null
          response_status?: number | null
          status?: string
          webhook_config_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_deliveries_webhook_config_id_fkey"
            columns: ["webhook_config_id"]
            isOneToOne: false
            referencedRelation: "webhook_configs"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      portfolio_summary: {
        Row: {
          cash_balance: number | null
          id: string | null
          last_updated: string | null
          position_count: number | null
          total_pnl: number | null
          total_value: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      assign_missing_evaluator_roles: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      assign_user_role: {
        Args: { target_user_id: string; target_role: string }
        Returns: boolean
      }
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      calculate_portfolio_value: {
        Args: { p_portfolio_id: string }
        Returns: {
          total_value: number
          positions_value: number
          cash_balance: number
          total_pnl: number
        }[]
      }
      get_latest_signals_for_symbol: {
        Args: { p_symbol: string; p_limit?: number }
        Returns: {
          signal_type: string
          confidence_score: number
          agent_name: string
          reasoning: string
          created_at: string
        }[]
      }
      get_leaderboard: {
        Args: { challenge_id_param?: string }
        Returns: {
          user_id: string
          username: string
          full_name: string
          avatar_url: string
          total_score: number
          total_submissions: number
          challenge_wins: number
          badge_count: number
        }[]
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      is_valid_url: {
        Args: { url_text: string }
        Returns: boolean
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: string
      }
      log_sensitive_operation: {
        Args: {
          p_action: string
          p_table_name: string
          p_record_id?: string
          p_old_values?: Json
          p_new_values?: Json
        }
        Returns: undefined
      }
      match_documents: {
        Args: { query_embedding: string; match_count?: number; filter?: Json }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      search_agent_knowledge: {
        Args: {
          p_agent_id: string
          p_query_embedding: string
          p_match_threshold?: number
          p_match_count?: number
        }
        Returns: {
          id: string
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
    }
    Enums: {
      app_role: "admin" | "company" | "participant" | "sponsor" | "evaluator"
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
      app_role: ["admin", "company", "participant", "sponsor", "evaluator"],
    },
  },
} as const
