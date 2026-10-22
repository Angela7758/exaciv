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
          id: string
          minutes: number
          position: number
          published: boolean
          source_url: string | null
          takeaway: string[]
          title: string
          topic: string
        }
        Insert: {
          body: string[]
          id: string
          minutes?: number
          position: number
          published?: boolean
          source_url?: string | null
          takeaway?: string[]
          title: string
          topic: string
        }
        Update: {
          body?: string[]
          id?: string
          minutes?: number
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
          exam_theme: string | null
          explanation: string
          id: string
          lesson_id: string | null
          options: string[]
          position: number
          published: boolean
          question: string
          source: string
          source_status: string
          source_url: string | null
          source_verified_at: string | null
          theme: string
        }
        Insert: {
          answer: number
          exam_theme?: string | null
          explanation: string
          id: string
          lesson_id?: string | null
          options: string[]
          position: number
          published?: boolean
          question: string
          source: string
          source_status?: string
          source_url?: string | null
          source_verified_at?: string | null
          theme: string
        }
        Update: {
          answer?: number
          exam_theme?: string | null
          explanation?: string
          id?: string
          lesson_id?: string | null
          options?: string[]
          position?: number
          published?: boolean
          question?: string
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
            foreignKeyName: "learning_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          translation_help?: boolean
          weekly_summary?: boolean
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      advance_learning_session: {
        Args: { p_session: string }
        Returns: undefined
      }
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
      start_learning_session: {
        Args: { p_kind: string; p_lesson?: string }
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
