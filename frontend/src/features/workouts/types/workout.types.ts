// ✅ OTIMIZADO: Tipos centralizados por feature
export interface WorkoutPlan {
  id: string;
  title: string;
  description?: string;
  duration_minutes?: number;
  difficulty_level?: number;
  muscle_groups?: string[];
  equipment_needed?: string[];
  calories_burned_estimate?: number;
  ai_generated?: boolean;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  exercises?: WorkoutExercise[];
}

export interface WorkoutExercise {
  id: string;
  name: string;
  description?: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'balance';
  instructions?: string;
  sets?: number;
  reps?: number;
  duration_seconds?: number;
  rest_seconds?: number;
  order_index: number;
  muscle_groups?: string[];
  equipment?: string;
  created_at: string;
  updated_at: string;
  workout_plan_id: string;
}

export interface CreateWorkoutPlanData {
  title: string;
  description?: string;
  duration_minutes?: number;
  difficulty_level?: number;
  muscle_groups?: string[];
  equipment_needed?: string[];
  calories_burned_estimate?: number;
  ai_generated?: boolean;
  exercises?: Partial<WorkoutExercise>[];
}

export interface WorkoutStats {
  totalWorkouts: number;
  completedWorkouts: number;
  inProgressWorkouts: number;
  completionRate: number;
  totalCaloriesBurned: number;
  averageWorkoutDuration: number;
}

export interface WorkoutFilters {
  difficulty?: number[];
  muscleGroups?: string[];
  equipment?: string[];
  aiGenerated?: boolean;
  status?: 'all' | 'completed' | 'in_progress' | 'not_started';
}

export interface WorkoutCardProps {
  workout: WorkoutPlan;
  onDelete: (workoutId: string) => void;
  onStart?: (workoutId: string) => void;
  onComplete?: (workoutId: string) => void;
}

export interface WorkoutGeneratorProps {
  onGenerate: (workout: CreateWorkoutPlanData) => void;
  isGenerating: boolean;
}

export interface WorkoutStatsProps {
  stats: WorkoutStats;
  loading?: boolean;
}

