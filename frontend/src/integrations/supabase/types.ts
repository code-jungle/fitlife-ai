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
      exercises: {
        Row: {
          category: Database["public"]["Enums"]["exercise_category"] | null
          completed: boolean | null
          created_at: string
          distance_meters: number | null
          duration_seconds: number | null
          id: string
          instructions: string | null
          name: string
          order_index: number
          reps: number | null
          rest_seconds: number | null
          sets: number | null
          weight_kg: number | null
          workout_plan_id: string
        }
        Insert: {
          category?: Database["public"]["Enums"]["exercise_category"] | null
          completed?: boolean | null
          created_at?: string
          distance_meters?: number | null
          duration_seconds?: number | null
          id?: string
          instructions?: string | null
          name: string
          order_index: number
          reps?: number | null
          rest_seconds?: number | null
          sets?: number | null
          weight_kg?: number | null
          workout_plan_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["exercise_category"] | null
          completed?: boolean | null
          created_at?: string
          distance_meters?: number | null
          duration_seconds?: number | null
          id?: string
          instructions?: string | null
          name?: string
          order_index?: number
          reps?: number | null
          rest_seconds?: number | null
          sets?: number | null
          weight_kg?: number | null
          workout_plan_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercises_workout_plan_id_fkey"
            columns: ["workout_plan_id"]
            isOneToOne: false
            referencedRelation: "workout_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      meal_foods: {
        Row: {
          calories_per_unit: number | null
          carbs_per_unit: number | null
          created_at: string
          fat_per_unit: number | null
          food_name: string
          id: string
          meal_id: string
          protein_per_unit: number | null
          quantity: number
          unit: string
        }
        Insert: {
          calories_per_unit?: number | null
          carbs_per_unit?: number | null
          created_at?: string
          fat_per_unit?: number | null
          food_name: string
          id?: string
          meal_id: string
          protein_per_unit?: number | null
          quantity: number
          unit: string
        }
        Update: {
          calories_per_unit?: number | null
          carbs_per_unit?: number | null
          created_at?: string
          fat_per_unit?: number | null
          food_name?: string
          id?: string
          meal_id?: string
          protein_per_unit?: number | null
          quantity?: number
          unit?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_foods_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
      meals: {
        Row: {
          calories: number | null
          carbs: number | null
          created_at: string
          description: string | null
          fat: number | null
          fiber: number | null
          id: string
          meal_type: Database["public"]["Enums"]["meal_type"]
          name: string
          nutrition_plan_id: string
          order_index: number
          protein: number | null
        }
        Insert: {
          calories?: number | null
          carbs?: number | null
          created_at?: string
          description?: string | null
          fat?: number | null
          fiber?: number | null
          id?: string
          meal_type: Database["public"]["Enums"]["meal_type"]
          name: string
          nutrition_plan_id: string
          order_index: number
          protein?: number | null
        }
        Update: {
          calories?: number | null
          carbs?: number | null
          created_at?: string
          description?: string | null
          fat?: number | null
          fiber?: number | null
          id?: string
          meal_type?: Database["public"]["Enums"]["meal_type"]
          name?: string
          nutrition_plan_id?: string
          order_index?: number
          protein?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "meals_nutrition_plan_id_fkey"
            columns: ["nutrition_plan_id"]
            isOneToOne: false
            referencedRelation: "nutrition_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrition_plans: {
        Row: {
          ai_generated: boolean | null
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          target_date: string
          title: string
          total_calories: number | null
          total_carbs: number | null
          total_fat: number | null
          total_protein: number | null
          user_id: string
        }
        Insert: {
          ai_generated?: boolean | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          target_date?: string
          title: string
          total_calories?: number | null
          total_carbs?: number | null
          total_fat?: number | null
          total_protein?: number | null
          user_id: string
        }
        Update: {
          ai_generated?: boolean | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          target_date?: string
          title?: string
          total_calories?: number | null
          total_carbs?: number | null
          total_fat?: number | null
          total_protein?: number | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activity_level: Database["public"]["Enums"]["activity_level"] | null
          age: number | null
          allergies: string[] | null
          created_at: string
          dietary_restrictions: string[] | null
          email: string
          fitness_goal: Database["public"]["Enums"]["fitness_goal"] | null
          full_name: string | null
          gender: Database["public"]["Enums"]["gender_type"] | null
          height: number | null
          id: string
          target_calories: number | null
          target_carbs: number | null
          target_fat: number | null
          target_protein: number | null
          updated_at: string
          weight: number | null
        }
        Insert: {
          activity_level?: Database["public"]["Enums"]["activity_level"] | null
          age?: number | null
          allergies?: string[] | null
          created_at?: string
          dietary_restrictions?: string[] | null
          email: string
          fitness_goal?: Database["public"]["Enums"]["fitness_goal"] | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          height?: number | null
          id: string
          target_calories?: number | null
          target_carbs?: number | null
          target_fat?: number | null
          target_protein?: number | null
          updated_at?: string
          weight?: number | null
        }
        Update: {
          activity_level?: Database["public"]["Enums"]["activity_level"] | null
          age?: number | null
          allergies?: string[] | null
          created_at?: string
          dietary_restrictions?: string[] | null
          email?: string
          fitness_goal?: Database["public"]["Enums"]["fitness_goal"] | null
          full_name?: string | null
          gender?: Database["public"]["Enums"]["gender_type"] | null
          height?: number | null
          id?: string
          target_calories?: number | null
          target_carbs?: number | null
          target_fat?: number | null
          target_protein?: number | null
          updated_at?: string
          weight?: number | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string
          id: string
          next_billing_date: string | null
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          subscription_start_date: string | null
          trial_end_date: string | null
          trial_start_date: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          next_billing_date?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_start_date?: string | null
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          next_billing_date?: string | null
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          subscription_start_date?: string | null
          trial_end_date?: string | null
          trial_start_date?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achieved_at: string
          achievement_name: string
          achievement_type: string
          description: string | null
          id: string
          user_id: string
          value: number | null
        }
        Insert: {
          achieved_at?: string
          achievement_name: string
          achievement_type: string
          description?: string | null
          id?: string
          user_id: string
          value?: number | null
        }
        Update: {
          achieved_at?: string
          achievement_name?: string
          achievement_type?: string
          description?: string | null
          id?: string
          user_id?: string
          value?: number | null
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          body_fat_percentage: number | null
          created_at: string
          id: string
          measurements: Json | null
          muscle_mass: number | null
          notes: string | null
          photos: string[] | null
          recorded_date: string
          user_id: string
          weight: number | null
        }
        Insert: {
          body_fat_percentage?: number | null
          created_at?: string
          id?: string
          measurements?: Json | null
          muscle_mass?: number | null
          notes?: string | null
          photos?: string[] | null
          recorded_date?: string
          user_id: string
          weight?: number | null
        }
        Update: {
          body_fat_percentage?: number | null
          created_at?: string
          id?: string
          measurements?: Json | null
          muscle_mass?: number | null
          notes?: string | null
          photos?: string[] | null
          recorded_date?: string
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      workout_plans: {
        Row: {
          ai_generated: boolean | null
          calories_burned_estimate: number | null
          completed_at: string | null
          created_at: string
          description: string | null
          difficulty_level: number | null
          duration_minutes: number | null
          equipment_needed: string[] | null
          id: string
          muscle_groups: string[] | null
          title: string
          user_id: string
        }
        Insert: {
          ai_generated?: boolean | null
          calories_burned_estimate?: number | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: number | null
          duration_minutes?: number | null
          equipment_needed?: string[] | null
          id?: string
          muscle_groups?: string[] | null
          title: string
          user_id: string
        }
        Update: {
          ai_generated?: boolean | null
          calories_burned_estimate?: number | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: number | null
          duration_minutes?: number | null
          equipment_needed?: string[] | null
          id?: string
          muscle_groups?: string[] | null
          title?: string
          user_id?: string
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
      activity_level:
        | "sedentary"
        | "light"
        | "moderate"
        | "active"
        | "very_active"
      exercise_category:
        | "cardio"
        | "strength"
        | "flexibility"
        | "sports"
        | "functional"
      fitness_goal:
        | "lose_weight"
        | "gain_muscle"
        | "maintain_weight"
        | "improve_endurance"
        | "general_fitness"
      gender_type: "male" | "female" | "other"
      meal_type: "breakfast" | "lunch" | "dinner" | "snack"
      subscription_status: "trial" | "active" | "expired" | "cancelled"
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
      activity_level: [
        "sedentary",
        "light",
        "moderate",
        "active",
        "very_active",
      ],
      exercise_category: [
        "cardio",
        "strength",
        "flexibility",
        "sports",
        "functional",
      ],
      fitness_goal: [
        "lose_weight",
        "gain_muscle",
        "maintain_weight",
        "improve_endurance",
        "general_fitness",
      ],
      gender_type: ["male", "female", "other"],
      meal_type: ["breakfast", "lunch", "dinner", "snack"],
      subscription_status: ["trial", "active", "expired", "cancelled"],
    },
  },
} as const
