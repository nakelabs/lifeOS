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
      course_completions: {
        Row: {
          completed_at: string
          course_id: string
          course_title: string
          created_at: string
          duration_taken: string | null
          final_notes: string | null
          id: string
          total_lessons: number | null
          user_id: string
        }
        Insert: {
          completed_at?: string
          course_id: string
          course_title: string
          created_at?: string
          duration_taken?: string | null
          final_notes?: string | null
          id?: string
          total_lessons?: number | null
          user_id: string
        }
        Update: {
          completed_at?: string
          course_id?: string
          course_title?: string
          created_at?: string
          duration_taken?: string | null
          final_notes?: string | null
          id?: string
          total_lessons?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_completions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "user_courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_recommendations: {
        Row: {
          created_at: string
          description: string
          difficulty: string
          estimated_duration: string
          id: string
          skills: string[] | null
          title: string
          topic: string
        }
        Insert: {
          created_at?: string
          description: string
          difficulty: string
          estimated_duration: string
          id?: string
          skills?: string[] | null
          title: string
          topic: string
        }
        Update: {
          created_at?: string
          description?: string
          difficulty?: string
          estimated_duration?: string
          id?: string
          skills?: string[] | null
          title?: string
          topic?: string
        }
        Relationships: []
      }
      financial_records: {
        Row: {
          amount: number
          category: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          recorded_at: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          recorded_at?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          recorded_at?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      health_data: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          recorded_at: string | null
          type: string
          unit: string | null
          user_id: string
          value: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          recorded_at?: string | null
          type: string
          unit?: string | null
          user_id: string
          value?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          recorded_at?: string | null
          type?: string
          unit?: string | null
          user_id?: string
          value?: number | null
        }
        Relationships: []
      }
      health_goals: {
        Row: {
          created_at: string
          exercise_goal: number | null
          heart_rate_target: number | null
          id: string
          sleep_goal: number | null
          updated_at: string
          user_id: string
          water_goal: number | null
        }
        Insert: {
          created_at?: string
          exercise_goal?: number | null
          heart_rate_target?: number | null
          id?: string
          sleep_goal?: number | null
          updated_at?: string
          user_id: string
          water_goal?: number | null
        }
        Update: {
          created_at?: string
          exercise_goal?: number | null
          heart_rate_target?: number | null
          id?: string
          sleep_goal?: number | null
          updated_at?: string
          user_id?: string
          water_goal?: number | null
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string | null
          id: string
          mood: string | null
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          mood?: string | null
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          mood?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          age: string | null
          assistant_tone: string | null
          created_at: string | null
          focus_areas: string[] | null
          goals: string | null
          id: string
          language: string | null
          name: string
          region: string | null
          updated_at: string | null
        }
        Insert: {
          age?: string | null
          assistant_tone?: string | null
          created_at?: string | null
          focus_areas?: string[] | null
          goals?: string | null
          id: string
          language?: string | null
          name: string
          region?: string | null
          updated_at?: string | null
        }
        Update: {
          age?: string | null
          assistant_tone?: string | null
          created_at?: string | null
          focus_areas?: string[] | null
          goals?: string | null
          id?: string
          language?: string | null
          name?: string
          region?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_courses: {
        Row: {
          completed_lessons: number | null
          course_url: string | null
          created_at: string
          description: string
          difficulty: string | null
          duration: string | null
          id: string
          instructor: string | null
          notes: string | null
          progress: number | null
          start_date: string | null
          status: string | null
          target_completion_date: string | null
          title: string
          total_lessons: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_lessons?: number | null
          course_url?: string | null
          created_at?: string
          description: string
          difficulty?: string | null
          duration?: string | null
          id?: string
          instructor?: string | null
          notes?: string | null
          progress?: number | null
          start_date?: string | null
          status?: string | null
          target_completion_date?: string | null
          title: string
          total_lessons?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_lessons?: number | null
          course_url?: string | null
          created_at?: string
          description?: string
          difficulty?: string | null
          duration?: string | null
          id?: string
          instructor?: string | null
          notes?: string | null
          progress?: number | null
          start_date?: string | null
          status?: string | null
          target_completion_date?: string | null
          title?: string
          total_lessons?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_interests: {
        Row: {
          created_at: string
          id: string
          interests: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          interests?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          interests?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          created_at: string
          current_streak: number | null
          id: string
          last_activity_date: string | null
          longest_streak: number | null
          streak_start_date: string | null
          total_active_days: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          streak_start_date?: string | null
          total_active_days?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_streak?: number | null
          id?: string
          last_activity_date?: string | null
          longest_streak?: number | null
          streak_start_date?: string | null
          total_active_days?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_user_streak: {
        Args: { p_user_id: string }
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
    Enums: {},
  },
} as const
