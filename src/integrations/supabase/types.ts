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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      admin_audit: {
        Row: {
          action: string
          actor: string | null
          after_data: Json | null
          before_data: Json | null
          created_at: string
          entity_id: string
          id: string
        }
        Insert: {
          action: string
          actor?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          entity_id: string
          id?: string
        }
        Update: {
          action?: string
          actor?: string | null
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          entity_id?: string
          id?: string
        }
        Relationships: []
      }
      admin_imports: {
        Row: {
          actor: string
          created_at: string
          filename: string
          id: string
          report: Json
        }
        Insert: {
          actor: string
          created_at?: string
          filename: string
          id?: string
          report: Json
        }
        Update: {
          actor?: string
          created_at?: string
          filename?: string
          id?: string
          report?: Json
        }
        Relationships: []
      }
      admin_media: {
        Row: {
          alt: string
          id: string
          kind: string
          language: string
          lesson_id: string | null
          mime: string | null
          rights: string
          size_bytes: number | null
          source: string
          storage_path: string | null
          title: string
          updated_at: string
          url: string
          verified: boolean
        }
        Insert: {
          alt?: string
          id?: string
          kind: string
          language?: string
          lesson_id?: string | null
          mime?: string | null
          rights?: string
          size_bytes?: number | null
          source?: string
          storage_path?: string | null
          title: string
          updated_at?: string
          url: string
          verified?: boolean
        }
        Update: {
          alt?: string
          id?: string
          kind?: string
          language?: string
          lesson_id?: string | null
          mime?: string | null
          rights?: string
          size_bytes?: number | null
          source?: string
          storage_path?: string | null
          title?: string
          updated_at?: string
          url?: string
          verified?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "admin_media_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "learning_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_translations: {
        Row: {
          id: string
          locale: string
          payload: Json
          question_id: string
          source_revision: number
          status: string
          updated_at: string
        }
        Insert: {
          id?: string
          locale: string
          payload: Json
          question_id: string
          source_revision: number
          status?: string
          updated_at?: string
        }
        Update: {
          id?: string
          locale?: string
          payload?: Json
          question_id?: string
          source_revision?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      ai_revision_service_state: {
        Row: {
          id: string
          message: string
          status: number
          updated_at: string
        }
        Insert: {
          id: string
          message: string
          status: number
          updated_at?: string
        }
        Update: {
          id?: string
          message?: string
          status?: number
          updated_at?: string
        }
        Relationships: []
      }
      learning_activity: {
        Row: {
          created_at: string
          id: string
          kind: string
          locale: string
          ref: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          kind: string
          locale: string
          ref: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          kind?: string
          locale?: string
          ref?: string
          user_id?: string
        }
        Relationships: []
      }
      learning_agenda: {
        Row: {
          completed: boolean
          created_at: string
          duration_minutes: number
          id: string
          kind: string
          lesson_id: string | null
          scheduled_date: string
          scheduled_time: string | null
          test_id: string | null
          timezone: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          duration_minutes?: number
          id?: string
          kind?: string
          lesson_id?: string | null
          scheduled_date: string
          scheduled_time?: string | null
          test_id?: string | null
          timezone?: string
          title: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          duration_minutes?: number
          id?: string
          kind?: string
          lesson_id?: string | null
          scheduled_date?: string
          scheduled_time?: string | null
          test_id?: string | null
          timezone?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_agenda_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "learning_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_agenda_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "learning_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_attempts: {
        Row: {
          answers: Json
          correct: number
          created_at: string
          id: string
          parcours: string
          total: number
          user_id: string
        }
        Insert: {
          answers: Json
          correct: number
          created_at?: string
          id?: string
          parcours: string
          total: number
          user_id: string
        }
        Update: {
          answers?: Json
          correct?: number
          created_at?: string
          id?: string
          parcours?: string
          total?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_attempts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_bookmarks: {
        Row: {
          created_at: string
          item_id: string
          kind: string
          user_id: string
        }
        Insert: {
          created_at?: string
          item_id: string
          kind: string
          user_id: string
        }
        Update: {
          created_at?: string
          item_id?: string
          kind?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_bookmarks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_completions: {
        Row: {
          completed_at: string
          lesson_id: string
          parcours: string
          user_id: string
          xp: number
        }
        Insert: {
          completed_at?: string
          lesson_id: string
          parcours: string
          user_id: string
          xp?: number
        }
        Update: {
          completed_at?: string
          lesson_id?: string
          parcours?: string
          user_id?: string
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "learning_completions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "learning_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_lessons: {
        Row: {
          body: string[]
          hero_media_id: string | null
          id: string
          layout: Json | null
          minutes: number
          pathways: string[]
          position: number
          published: boolean
          source_url: string | null
          takeaway: string[]
          title: string
          topic: string
        }
        Insert: {
          body: string[]
          hero_media_id?: string | null
          id: string
          layout?: Json | null
          minutes?: number
          pathways?: string[]
          position: number
          published?: boolean
          source_url?: string | null
          takeaway?: string[]
          title: string
          topic: string
        }
        Update: {
          body?: string[]
          hero_media_id?: string | null
          id?: string
          layout?: Json | null
          minutes?: number
          pathways?: string[]
          position?: number
          published?: boolean
          source_url?: string | null
          takeaway?: string[]
          title?: string
          topic?: string
        }
        Relationships: []
      }
      learning_mistake_reviews: {
        Row: {
          mastered: boolean
          question_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          mastered?: boolean
          question_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          mastered?: boolean
          question_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_mistake_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_questions: {
        Row: {
          answer: number
          classification_reviewed_at: string | null
          classification_source: string
          content_revision: number
          correct_option_id: string | null
          exam_theme: string | null
          explanation: string
          id: string
          lesson_id: string | null
          option_ids: string[]
          options: string[]
          pathways: string[]
          position: number
          published: boolean
          question: string
          question_type: string
          source: string
          source_status: string
          source_url: string | null
          source_verified_at: string | null
          theme: string
        }
        Insert: {
          answer: number
          classification_reviewed_at?: string | null
          classification_source?: string
          content_revision?: number
          correct_option_id?: string | null
          exam_theme?: string | null
          explanation: string
          id: string
          lesson_id?: string | null
          option_ids?: string[]
          options: string[]
          pathways?: string[]
          position: number
          published?: boolean
          question: string
          question_type?: string
          source: string
          source_status?: string
          source_url?: string | null
          source_verified_at?: string | null
          theme: string
        }
        Update: {
          answer?: number
          classification_reviewed_at?: string | null
          classification_source?: string
          content_revision?: number
          correct_option_id?: string | null
          exam_theme?: string | null
          explanation?: string
          id?: string
          lesson_id?: string | null
          option_ids?: string[]
          options?: string[]
          pathways?: string[]
          position?: number
          published?: boolean
          question?: string
          question_type?: string
          source?: string
          source_status?: string
          source_url?: string | null
          source_verified_at?: string | null
          theme?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_questions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "learning_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_reading_positions: {
        Row: {
          lesson_id: string
          parcours: string
          section_index: number
          updated_at: string
          user_id: string
        }
        Insert: {
          lesson_id: string
          parcours: string
          section_index?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          lesson_id?: string
          parcours?: string
          section_index?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_reading_positions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "learning_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_reading_positions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_sessions: {
        Row: {
          answers: Json
          completed_at: string | null
          correct: number | null
          current_index: number
          deadline: string | null
          diagnostic_key: string | null
          id: string
          kind: string
          lesson_id: string | null
          parcours: string
          questions: Json
          started_at: string
          test_id: string | null
          test_rules: Json | null
          total: number
          user_id: string
        }
        Insert: {
          answers?: Json
          completed_at?: string | null
          correct?: number | null
          current_index?: number
          deadline?: string | null
          diagnostic_key?: string | null
          id?: string
          kind: string
          lesson_id?: string | null
          parcours: string
          questions: Json
          started_at?: string
          test_id?: string | null
          test_rules?: Json | null
          total: number
          user_id: string
        }
        Update: {
          answers?: Json
          completed_at?: string | null
          correct?: number | null
          current_index?: number
          deadline?: string | null
          diagnostic_key?: string | null
          id?: string
          kind?: string
          lesson_id?: string | null
          parcours?: string
          questions?: Json
          started_at?: string
          test_id?: string | null
          test_rules?: Json | null
          total?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "learning_sessions_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "learning_lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_sessions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "learning_tests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learning_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learning_tests: {
        Row: {
          allow_aids: boolean
          duration_minutes: number
          id: string
          instant_feedback: boolean
          kind: string
          pathways: string[]
          question_count: number
          question_ids: string[]
          question_type: string
          revision: number
          selection: string
          status: string
          themes: string[]
          title: string
          updated_at: string
        }
        Insert: {
          allow_aids?: boolean
          duration_minutes?: number
          id?: string
          instant_feedback?: boolean
          kind: string
          pathways?: string[]
          question_count?: number
          question_ids?: string[]
          question_type?: string
          revision?: number
          selection?: string
          status?: string
          themes?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          allow_aids?: boolean
          duration_minutes?: number
          id?: string
          instant_feedback?: boolean
          kind?: string
          pathways?: string[]
          question_count?: number
          question_ids?: string[]
          question_type?: string
          revision?: number
          selection?: string
          status?: string
          themes?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      lesson_drafts: {
        Row: {
          id: string
          payload: Json
          revision: number
          status: string
          updated_at: string
        }
        Insert: {
          id: string
          payload: Json
          revision?: number
          status?: string
          updated_at?: string
        }
        Update: {
          id?: string
          payload?: Json
          revision?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string
          created_at: string
          daily_minutes: number
          display_name: string
          goal_date: string | null
          help_locale: string
          id: string
          locale: string
          parcours: string
          revision_reminder: boolean
          timezone: string
          translation_help: boolean
          weekly_summary: boolean
        }
        Insert: {
          avatar_url?: string
          created_at?: string
          daily_minutes?: number
          display_name?: string
          goal_date?: string | null
          help_locale?: string
          id: string
          locale?: string
          parcours?: string
          revision_reminder?: boolean
          timezone?: string
          translation_help?: boolean
          weekly_summary?: boolean
        }
        Update: {
          avatar_url?: string
          created_at?: string
          daily_minutes?: number
          display_name?: string
          goal_date?: string | null
          help_locale?: string
          id?: string
          locale?: string
          parcours?: string
          revision_reminder?: boolean
          timezone?: string
          translation_help?: boolean
          weekly_summary?: boolean
        }
        Relationships: []
      }
      question_drafts: {
        Row: {
          id: string
          payload: Json
          revision: number
          status: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          id: string
          payload: Json
          revision?: number
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          id?: string
          payload?: Json
          revision?: number
          status?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      question_reports: {
        Row: {
          created_at: string
          id: string
          question_id: string
          reason: string
          reply: string
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          reason: string
          reply?: string
          status?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          reason?: string
          reply?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      question_versions: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          payload: Json
          question_id: string
          revision: number
          status: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          payload: Json
          question_id: string
          revision: number
          status: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          payload?: Json
          question_id?: string
          revision?: number
          status?: string
        }
        Relationships: []
      }
      revision_plans: {
        Row: {
          created_at: string
          id: string
          inputs: Json
          plan: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          inputs: Json
          plan: Json
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          inputs?: Json
          plan?: Json
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: string
          user_id: string
        }
        Insert: {
          id?: string
          role: string
          user_id: string
        }
        Update: {
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_can: { Args: { p_permission: string }; Returns: boolean }
      admin_command: { Args: { p_action: string; p_data: Json }; Returns: Json }
      admin_metrics: { Args: { p_days?: number }; Returns: Json }
      admin_users: { Args: never; Returns: Json }
      admin_validate_question: { Args: { p: Json }; Returns: undefined }
      advance_learning_session: {
        Args: { p_session: string }
        Returns: undefined
      }
      civic_topic: { Args: { p_theme: string }; Returns: string }
      complete_learning_lesson: {
        Args: { p_lesson: string }
        Returns: undefined
      }
      finish_learning_session: {
        Args: { p_session: string }
        Returns: undefined
      }
      import_learning_diagnostic: {
        Args: { p_answers: Json; p_ids: string[]; p_key: string }
        Returns: string
      }
      manage_learning_lesson: {
        Args: { p_action: string; p_id: string; p_payload?: Json }
        Returns: Json
      }
      record_learning_attempt: { Args: { p_answers: Json }; Returns: string }
      review_learning_mistake: {
        Args: { p_answer: number; p_question: string }
        Returns: boolean
      }
      save_exam_navigation: {
        Args: {
          p_answer?: number
          p_index: number
          p_session: string
          p_target?: number
        }
        Returns: undefined
      }
      save_learning_reading_position: {
        Args: { p_lesson: string; p_section: number }
        Returns: undefined
      }
      start_classified_practice: {
        Args: {
          p_chrono?: boolean
          p_correction?: string
          p_count?: number
          p_theme?: string
          p_type?: string
        }
        Returns: string
      }
      start_configured_test: { Args: { p_test: string }; Returns: string }
      start_learning_session: {
        Args: { p_count?: number; p_kind: string; p_lesson?: string }
        Returns: string
      }
      submit_learning_answer: {
        Args: { p_answer: number; p_index: number; p_session: string }
        Returns: undefined
      }
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
