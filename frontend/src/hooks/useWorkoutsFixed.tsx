import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface Exercise {
  id: string;
  name: string;
  category: 'cardio' | 'strength' | 'flexibility' | 'sports' | 'functional';
  instructions: string;
  sets?: number;
  reps?: number;
  duration_seconds?: number;
  rest_seconds?: number;
  weight_kg?: number;
  distance_meters?: number;
  order_index: number;
  completed: boolean;
}

export interface WorkoutPlan {
  id: string;
  title: string;
  description?: string;
  duration_minutes?: number;
  difficulty_level?: number;
  calories_burned_estimate?: number;
  muscle_groups?: string[];
  equipment_needed?: string[];
  ai_generated: boolean;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  exercises?: Exercise[];
}

export const useWorkoutsFixed = () => {
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // ✅ CORRIGIDO: useCallback para estabilizar a referência da função
  const fetchWorkoutPlans = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('workout_plans')
        .select(`
          *,
          exercises (
            id,
            name,
            category,
            instructions,
            sets,
            reps,
            duration_seconds,
            rest_seconds,
            weight_kg,
            distance_meters,
            order_index,
            completed
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setWorkoutPlans(data || []);
    } catch (error) {
      console.error('Error fetching workout plans:', error);
      toast({
        title: "Erro ao carregar treinos",
        description: "Não foi possível carregar seus treinos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user]); // ✅ CORRIGIDO: user como dependência

  // ✅ CORRIGIDO: useEffect com dependências corretas
  useEffect(() => {
    if (user) {
      fetchWorkoutPlans();
    }
  }, [user, fetchWorkoutPlans]); // ✅ CORRIGIDO: fetchWorkoutPlans incluída

  // ✅ CORRIGIDO: useCallback para estabilizar funções
  const createWorkoutPlan = useCallback(async (workoutData: Omit<WorkoutPlan, 'id' | 'created_at' | 'ai_generated'>) => {
    if (!user) return { data: null, error: 'User not authenticated' };

    try {
      setLoading(true);
      const { data: workoutPlan, error: workoutError } = await supabase
        .from('workout_plans')
        .insert({
          user_id: user.id,
          title: workoutData.title,
          description: workoutData.description,
          duration_minutes: workoutData.duration_minutes,
          difficulty_level: workoutData.difficulty_level,
          calories_burned_estimate: workoutData.calories_burned_estimate,
          muscle_groups: workoutData.muscle_groups,
          equipment_needed: workoutData.equipment_needed,
          ai_generated: workoutData.ai_generated ?? true,
        })
        .select()
        .single();

      if (workoutError) throw workoutError;

      // Create exercises if provided
      if (workoutData.exercises && workoutData.exercises.length > 0) {
        const exercisesToInsert = workoutData.exercises.map((exercise, index) => ({
          workout_plan_id: workoutPlan.id,
          name: exercise.name!,
          category: exercise.category,
          instructions: exercise.instructions,
          sets: exercise.sets,
          reps: exercise.reps,
          duration_seconds: exercise.duration_seconds,
          rest_seconds: exercise.rest_seconds,
          weight_kg: exercise.weight_kg,
          distance_meters: exercise.distance_meters,
          order_index: exercise.order_index ?? index,
          completed: false,
        }));

        const { error: exercisesError } = await supabase
          .from('exercises')
          .insert(exercisesToInsert);

        if (exercisesError) throw exercisesError;
      }

      await fetchWorkoutPlans(); // Refresh the list

      toast({
        title: "Treino criado!",
        description: "Seu novo plano de treino foi gerado com sucesso",
      });

      return { data: workoutPlan, error: null };
    } catch (error) {
      console.error('Error creating workout plan:', error);
      toast({
        title: "Erro ao criar treino",
        description: "Não foi possível criar o plano de treino",
        variant: "destructive",
      });
      return { data: null, error: error instanceof Error ? error.message : 'Unknown error' };
    } finally {
      setLoading(false);
    }
  }, [user, fetchWorkoutPlans]);

  // ✅ CORRIGIDO: useCallback para outras funções
  const startWorkout = useCallback(async (workoutId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('workout_plans')
        .update({ started_at: new Date().toISOString() })
        .eq('id', workoutId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchWorkoutPlans();
      
      toast({
        title: "Treino iniciado!",
        description: "Boa sorte com seu treino!",
      });
    } catch (error) {
      console.error('Error starting workout:', error);
      toast({
        title: "Erro ao iniciar treino",
        description: "Não foi possível iniciar o treino",
        variant: "destructive",
      });
    }
  }, [user, fetchWorkoutPlans]);

  const completeWorkout = useCallback(async (workoutId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('workout_plans')
        .update({ completed_at: new Date().toISOString() })
        .eq('id', workoutId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchWorkoutPlans();
      
      toast({
        title: "Treino concluído!",
        description: "Parabéns por completar seu treino!",
      });
    } catch (error) {
      console.error('Error completing workout:', error);
      toast({
        title: "Erro ao concluir treino",
        description: "Não foi possível marcar o treino como concluído",
        variant: "destructive",
      });
    }
  }, [user, fetchWorkoutPlans]);

  const updateExerciseCompletion = useCallback(async (exerciseId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('exercises')
        .update({ completed })
        .eq('id', exerciseId);

      if (error) throw error;

      // Update local state
      setWorkoutPlans(prev => prev.map(workout => ({
        ...workout,
        exercises: workout.exercises?.map(exercise => 
          exercise.id === exerciseId ? { ...exercise, completed } : exercise
        )
      })));
    } catch (error) {
      console.error('Error updating exercise completion:', error);
      toast({
        title: "Erro ao atualizar exercício",
        description: "Não foi possível atualizar o status do exercício",
        variant: "destructive",
      });
    }
  }, []);

  const deleteWorkout = useCallback(async (workoutId: string) => {
    if (!user) return;

    try {
      // First delete all exercises
      const { error: exercisesError } = await supabase
        .from('exercises')
        .delete()
        .eq('workout_plan_id', workoutId);

      if (exercisesError) throw exercisesError;

      // Then delete the workout plan
      const { error: workoutError } = await supabase
        .from('workout_plans')
        .delete()
        .eq('id', workoutId)
        .eq('user_id', user.id);

      if (workoutError) throw workoutError;

      await fetchWorkoutPlans();
      
      toast({
        title: "Treino excluído!",
        description: "O treino foi removido com sucesso",
      });
    } catch (error) {
      console.error('Error deleting workout:', error);
      toast({
        title: "Erro ao excluir treino",
        description: "Não foi possível excluir o treino",
        variant: "destructive",
      });
    }
  }, [user, fetchWorkoutPlans]);

  const deleteAllWorkouts = useCallback(async () => {
    if (!user) return;

    try {
      // Get all workout plans for the user
      const { data: workouts } = await supabase
        .from('workout_plans')
        .select('id')
        .eq('user_id', user.id);

      if (workouts && workouts.length > 0) {
        const workoutIds = workouts.map(w => w.id);

        // Delete all exercises first
        const { error: exercisesError } = await supabase
          .from('exercises')
          .delete()
          .in('workout_plan_id', workoutIds);

        if (exercisesError) throw exercisesError;

        // Then delete all workout plans
        const { error: workoutsError } = await supabase
          .from('workout_plans')
          .delete()
          .eq('user_id', user.id);

        if (workoutsError) throw workoutsError;
      }

      await fetchWorkoutPlans();
      
      toast({
        title: "Todos os treinos excluídos!",
        description: "Todos os treinos foram removidos com sucesso",
      });
    } catch (error) {
      console.error('Error deleting all workouts:', error);
      toast({
        title: "Erro ao excluir treinos",
        description: "Não foi possível excluir os treinos",
        variant: "destructive",
      });
    }
  }, [user, fetchWorkoutPlans]);

  return {
    workoutPlans,
    loading,
    createWorkoutPlan,
    startWorkout,
    completeWorkout,
    deleteWorkout,
    deleteAllWorkouts,
    updateExerciseCompletion,
    refetchWorkoutPlans: fetchWorkoutPlans,
  };
};

