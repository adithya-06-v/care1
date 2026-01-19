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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          achievement_name: string
          achievement_type: string
          description: string | null
          earned_at: string
          icon: string | null
          id: string
          user_id: string
        }
        Insert: {
          achievement_name: string
          achievement_type: string
          description?: string | null
          earned_at?: string
          icon?: string | null
          id?: string
          user_id: string
        }
        Update: {
          achievement_name?: string
          achievement_type?: string
          description?: string | null
          earned_at?: string
          icon?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      custom_exercises: {
        Row: {
          completed_at: string | null
          content: string
          created_at: string
          difficulty: string
          exercise_type: string
          id: string
          instruction: string
          is_completed: boolean | null
          patient_id: string
          priority: number | null
          therapist_id: string
          title: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          content: string
          created_at?: string
          difficulty?: string
          exercise_type?: string
          id?: string
          instruction: string
          is_completed?: boolean | null
          patient_id: string
          priority?: number | null
          therapist_id: string
          title: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          content?: string
          created_at?: string
          difficulty?: string
          exercise_type?: string
          id?: string
          instruction?: string
          is_completed?: boolean | null
          patient_id?: string
          priority?: number | null
          therapist_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      exercise_results: {
        Row: {
          created_at: string
          emotion_tag: string | null
          exercise_text: string
          feedback: string | null
          id: string
          improvement_tip: string | null
          recognized_text: string | null
          score: number | null
          session_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          emotion_tag?: string | null
          exercise_text: string
          feedback?: string | null
          id?: string
          improvement_tip?: string | null
          recognized_text?: string | null
          score?: number | null
          session_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          emotion_tag?: string | null
          exercise_text?: string
          feedback?: string | null
          id?: string
          improvement_tip?: string | null
          recognized_text?: string | null
          score?: number | null
          session_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_results_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age_group: string | null
          avatar_url: string | null
          created_at: string
          current_streak: number | null
          difficulty: string | null
          full_name: string | null
          goals: string[] | null
          id: string
          last_session_date: string | null
          longest_streak: number | null
          onboarding_completed: boolean | null
          preferred_language: string | null
          therapy_mode: string | null
          therapy_sessions_completed: number | null
          total_practice_minutes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          age_group?: string | null
          avatar_url?: string | null
          created_at?: string
          current_streak?: number | null
          difficulty?: string | null
          full_name?: string | null
          goals?: string[] | null
          id?: string
          last_session_date?: string | null
          longest_streak?: number | null
          onboarding_completed?: boolean | null
          preferred_language?: string | null
          therapy_mode?: string | null
          therapy_sessions_completed?: number | null
          total_practice_minutes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          age_group?: string | null
          avatar_url?: string | null
          created_at?: string
          current_streak?: number | null
          difficulty?: string | null
          full_name?: string | null
          goals?: string[] | null
          id?: string
          last_session_date?: string | null
          longest_streak?: number | null
          onboarding_completed?: boolean | null
          preferred_language?: string | null
          therapy_mode?: string | null
          therapy_sessions_completed?: number | null
          total_practice_minutes?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sentence_performance: {
        Row: {
          accuracy_score: number | null
          correct_words: number
          created_at: string
          id: string
          incorrect_words: string[] | null
          needs_word_drill: boolean | null
          recognized_text: string | null
          sentence_text: string
          session_id: string | null
          skipped_words: string[] | null
          user_id: string
          word_count: number
        }
        Insert: {
          accuracy_score?: number | null
          correct_words?: number
          created_at?: string
          id?: string
          incorrect_words?: string[] | null
          needs_word_drill?: boolean | null
          recognized_text?: string | null
          sentence_text: string
          session_id?: string | null
          skipped_words?: string[] | null
          user_id: string
          word_count?: number
        }
        Update: {
          accuracy_score?: number | null
          correct_words?: number
          created_at?: string
          id?: string
          incorrect_words?: string[] | null
          needs_word_drill?: boolean | null
          recognized_text?: string | null
          sentence_text?: string
          session_id?: string | null
          skipped_words?: string[] | null
          user_id?: string
          word_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "sentence_performance_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          accuracy_score: number | null
          created_at: string
          duration_minutes: number
          exercises_completed: number
          id: string
          total_exercises: number
          user_id: string
        }
        Insert: {
          accuracy_score?: number | null
          created_at?: string
          duration_minutes: number
          exercises_completed?: number
          id?: string
          total_exercises?: number
          user_id: string
        }
        Update: {
          accuracy_score?: number | null
          created_at?: string
          duration_minutes?: number
          exercises_completed?: number
          id?: string
          total_exercises?: number
          user_id?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          plan: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      therapist_patient_assignments: {
        Row: {
          assigned_at: string
          id: string
          notes: string | null
          patient_id: string
          therapist_id: string
        }
        Insert: {
          assigned_at?: string
          id?: string
          notes?: string | null
          patient_id: string
          therapist_id: string
        }
        Update: {
          assigned_at?: string
          id?: string
          notes?: string | null
          patient_id?: string
          therapist_id?: string
        }
        Relationships: []
      }
      user_difficulty_progress: {
        Row: {
          avg_session_score: number | null
          created_at: string
          current_difficulty: string
          difficulty_adjusted_at: string | null
          id: string
          sessions_at_current_level: number | null
          total_mastered: number | null
          total_weak: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avg_session_score?: number | null
          created_at?: string
          current_difficulty?: string
          difficulty_adjusted_at?: string | null
          id?: string
          sessions_at_current_level?: number | null
          total_mastered?: number | null
          total_weak?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avg_session_score?: number | null
          created_at?: string
          current_difficulty?: string
          difficulty_adjusted_at?: string | null
          id?: string
          sessions_at_current_level?: number | null
          total_mastered?: number | null
          total_weak?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_exercise_progress: {
        Row: {
          average_score: number | null
          created_at: string
          exercise_text: string
          id: string
          last_practiced_at: string | null
          mastery_status: string
          phoneme_pattern: string | null
          successful_attempts: number
          total_attempts: number
          updated_at: string
          user_id: string
        }
        Insert: {
          average_score?: number | null
          created_at?: string
          exercise_text: string
          id?: string
          last_practiced_at?: string | null
          mastery_status?: string
          phoneme_pattern?: string | null
          successful_attempts?: number
          total_attempts?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          average_score?: number | null
          created_at?: string
          exercise_text?: string
          id?: string
          last_practiced_at?: string | null
          mastery_status?: string
          phoneme_pattern?: string | null
          successful_attempts?: number
          total_attempts?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "therapist" | "user"
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
    Enums: {
      app_role: ["therapist", "user"],
    },
  },
} as const
