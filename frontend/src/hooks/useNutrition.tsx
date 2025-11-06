import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface MealFood {
  id: string;
  food_name: string;
  quantity: number;
  unit: string;
  calories_per_unit?: number;
  protein_per_unit?: number;
  carbs_per_unit?: number;
  fat_per_unit?: number;
}

export interface Meal {
  id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  description?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  order_index: number;
  meal_foods?: MealFood[];
}

export interface NutritionPlan {
  id: string;
  title: string;
  description?: string;
  target_date: string;
  total_calories?: number;
  total_protein?: number;
  total_carbs?: number;
  total_fat?: number;
  ai_generated: boolean;
  completed_at?: string;
  created_at: string;
  meals?: Meal[];
}

export const useNutrition = () => {
  const [nutritionPlans, setNutritionPlans] = useState<NutritionPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchNutritionPlans = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('nutrition_plans')
        .select(`
          *,
          meals (
            *,
            meal_foods (*)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setNutritionPlans(data || []);
    } catch (error) {
      console.error('Error fetching nutrition plans:', error);
      toast({
        title: "Erro ao carregar planos nutricionais",
        description: "Não foi possível carregar seus planos de nutrição",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createNutritionPlan = async (nutritionData: Partial<NutritionPlan> & { meals?: Partial<Meal>[] }) => {
    if (!user) return { error: 'No user authenticated' };

    try {
      setLoading(true);

      // Create nutrition plan
      const { data: nutritionPlan, error: nutritionError } = await supabase
        .from('nutrition_plans')
        .insert({
          user_id: user.id,
          title: nutritionData.title,
          description: nutritionData.description,
          target_date: nutritionData.target_date || new Date().toISOString().split('T')[0],
          total_calories: nutritionData.total_calories,
          total_protein: nutritionData.total_protein,
          total_carbs: nutritionData.total_carbs,
          total_fat: nutritionData.total_fat,
          ai_generated: nutritionData.ai_generated ?? true,
        })
        .select()
        .single();

      if (nutritionError) throw nutritionError;

      // Create meals if provided
      if (nutritionData.meals && nutritionData.meals.length > 0) {
        for (const [index, mealData] of nutritionData.meals.entries()) {
          const { data: meal, error: mealError } = await supabase
            .from('meals')
            .insert({
              nutrition_plan_id: nutritionPlan.id,
              meal_type: mealData.meal_type!,
              name: mealData.name!,
              description: mealData.description,
              calories: mealData.calories,
              protein: mealData.protein,
              carbs: mealData.carbs,
              fat: mealData.fat,
              fiber: mealData.fiber,
              order_index: mealData.order_index ?? index,
            })
            .select()
            .single();

          if (mealError) throw mealError;

          // Create meal foods if provided
          if (mealData.meal_foods && mealData.meal_foods.length > 0) {
            console.log('Creating meal foods for meal:', meal.id);
            console.log('Meal foods data:', mealData.meal_foods);
            
            const foodsToInsert = mealData.meal_foods.map(food => ({
              meal_id: meal.id,
              food_name: food.food_name!,
              quantity: food.quantity!,
              unit: food.unit!,
              calories_per_unit: food.calories_per_unit,
              protein_per_unit: food.protein_per_unit,
              carbs_per_unit: food.carbs_per_unit,
              fat_per_unit: food.fat_per_unit,
            }));

            console.log('Foods to insert:', foodsToInsert);

            const { error: foodsError } = await supabase
              .from('meal_foods')
              .insert(foodsToInsert);

            if (foodsError) {
              console.error('Error inserting meal foods:', foodsError);
              throw foodsError;
            }
            
            console.log('Meal foods inserted successfully');
          } else {
            console.log('No meal foods to insert for meal:', meal.id);
          }
        }
      }

      await fetchNutritionPlans(); // Refresh the list

      toast({
        title: "Plano nutricional criado!",
        description: "Seu novo plano de nutrição foi gerado com sucesso",
      });

      return { data: nutritionPlan, error: null };
    } catch (error) {
      console.error('Error creating nutrition plan:', error);
      toast({
        title: "Erro ao criar plano nutricional",
        description: "Não foi possível gerar o plano de nutrição",
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const completeNutritionPlan = async (planId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('nutrition_plans')
        .update({ completed_at: new Date().toISOString() })
        .eq('id', planId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchNutritionPlans();
      
      toast({
        title: "Plano nutricional concluído!",
        description: "Parabéns por seguir seu plano de nutrição!",
      });
    } catch (error) {
      console.error('Error completing nutrition plan:', error);
      toast({
        title: "Erro ao concluir plano",
        description: "Não foi possível marcar o plano como concluído",
        variant: "destructive",
      });
    }
  };

  const deleteNutritionPlan = async (planId: string) => {
    if (!user) return;

    try {
      // First delete related meals
      const { error: mealsError } = await supabase
        .from('meals')
        .delete()
        .eq('nutrition_plan_id', planId);

      if (mealsError) throw mealsError;

      // Then delete the nutrition plan
      const { error: planError } = await supabase
        .from('nutrition_plans')
        .delete()
        .eq('id', planId)
        .eq('user_id', user.id);

      if (planError) throw planError;

      await fetchNutritionPlans();
      
      toast({
        title: "Plano excluído!",
        description: "O plano nutricional foi removido com sucesso",
      });
    } catch (error) {
      console.error('Error deleting nutrition plan:', error);
      toast({
        title: "Erro ao excluir plano",
        description: "Não foi possível excluir o plano nutricional",
        variant: "destructive",
      });
    }
  };

  const deleteAllNutritionPlans = async () => {
    if (!user) return;

    try {
      // Get all nutrition plans for the user
      const { data: plans, error: fetchError } = await supabase
        .from('nutrition_plans')
        .select('id')
        .eq('user_id', user.id);

      if (fetchError) throw fetchError;

      if (!plans || plans.length === 0) {
        toast({
          title: "Nenhum plano encontrado",
          description: "Não há planos nutricionais para excluir",
        });
        return;
      }

      // Delete all meals first
      const { error: mealsError } = await supabase
        .from('meals')
        .delete()
        .in('nutrition_plan_id', plans.map(p => p.id));

      if (mealsError) throw mealsError;

      // Then delete all nutrition plans
      const { error: plansError } = await supabase
        .from('nutrition_plans')
        .delete()
        .eq('user_id', user.id);

      if (plansError) throw plansError;

      await fetchNutritionPlans();
      
      toast({
        title: "Todos os planos excluídos!",
        description: `${plans.length} plano(s) nutricional(is) foi(ram) removido(s) com sucesso`,
      });
    } catch (error) {
      console.error('Error deleting all nutrition plans:', error);
      toast({
        title: "Erro ao excluir planos",
        description: "Não foi possível excluir todos os planos nutricionais",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchNutritionPlans();
    }
  }, [user]);

  return {
    nutritionPlans,
    loading,
    createNutritionPlan,
    completeNutritionPlan,
    deleteNutritionPlan,
    deleteAllNutritionPlans,
    refetchNutritionPlans: fetchNutritionPlans,
  };
};