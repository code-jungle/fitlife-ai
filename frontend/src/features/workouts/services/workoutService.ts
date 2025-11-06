// ✅ OTIMIZADO: Service centralizado por feature
import { supabase } from '@/integrations/supabase/client';
import { WorkoutPlan, CreateWorkoutPlanData, WorkoutExercise } from '../types/workout.types';

class WorkoutService {
  async getWorkoutPlans(userId: string): Promise<{ data: WorkoutPlan[] | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('workout_plans')
        .select(`
          *,
          exercises:workout_exercises(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async createWorkoutPlan(workoutData: CreateWorkoutPlanData, userId: string): Promise<{ data: WorkoutPlan | null; error: any }> {
    try {
      // Create workout plan
      const { data: workoutPlan, error: workoutError } = await supabase
        .from('workout_plans')
        .insert({
          ...workoutData,
          user_id: userId,
        })
        .select()
        .single();

      if (workoutError) throw workoutError;

      // Create exercises if provided
      if (workoutData.exercises && workoutData.exercises.length > 0) {
        const exercisesData = workoutData.exercises.map((exercise, index) => ({
          ...exercise,
          workout_plan_id: workoutPlan.id,
          order_index: exercise.order_index ?? index,
        }));

        const { error: exercisesError } = await supabase
          .from('workout_exercises')
          .insert(exercisesData);

        if (exercisesError) throw exercisesError;
      }

      return { data: workoutPlan, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async updateWorkoutPlan(workoutId: string, updates: Partial<CreateWorkoutPlanData>, userId: string): Promise<{ data: WorkoutPlan | null; error: any }> {
    try {
      const { data, error } = await supabase
        .from('workout_plans')
        .update(updates)
        .eq('id', workoutId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async deleteWorkoutPlan(workoutId: string, userId: string): Promise<{ error: any }> {
    try {
      // Delete exercises first
      const { error: exercisesError } = await supabase
        .from('workout_exercises')
        .delete()
        .eq('workout_plan_id', workoutId);

      if (exercisesError) throw exercisesError;

      // Delete workout plan
      const { error: workoutError } = await supabase
        .from('workout_plans')
        .delete()
        .eq('id', workoutId)
        .eq('user_id', userId);

      if (workoutError) throw workoutError;

      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  async deleteAllWorkoutPlans(userId: string): Promise<{ error: any }> {
    try {
      // Get all workout plans for user
      const { data: workoutPlans, error: fetchError } = await supabase
        .from('workout_plans')
        .select('id')
        .eq('user_id', userId);

      if (fetchError) throw fetchError;

      if (workoutPlans && workoutPlans.length > 0) {
        const workoutIds = workoutPlans.map(plan => plan.id);

        // Delete all exercises
        const { error: exercisesError } = await supabase
          .from('workout_exercises')
          .delete()
          .in('workout_plan_id', workoutIds);

        if (exercisesError) throw exercisesError;

        // Delete all workout plans
        const { error: workoutError } = await supabase
          .from('workout_plans')
          .delete()
          .eq('user_id', userId);

        if (workoutError) throw workoutError;
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  async startWorkout(workoutId: string, userId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('workout_plans')
        .update({ started_at: new Date().toISOString() })
        .eq('id', workoutId)
        .eq('user_id', userId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error };
    }
  }

  async completeWorkout(workoutId: string, userId: string): Promise<{ error: any }> {
    try {
      const { error } = await supabase
        .from('workout_plans')
        .update({ completed_at: new Date().toISOString() })
        .eq('id', workoutId)
        .eq('user_id', userId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error };
    }
  }
}

export const workoutService = new WorkoutService();

