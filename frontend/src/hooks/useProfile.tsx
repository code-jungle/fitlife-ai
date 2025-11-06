import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  age?: number;
  weight?: number;
  height?: number;
  gender?: 'male' | 'female' | 'other';
  activity_level?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  fitness_goal?: 'lose_weight' | 'gain_muscle' | 'maintain_weight' | 'improve_endurance' | 'general_fitness';
  gym_days_per_week?: number;
  dietary_restrictions?: string[];
  allergies?: string[];
  target_calories?: number;
  target_protein?: number;
  target_carbs?: number;
  target_fat?: number;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchProfile = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Erro ao carregar perfil",
        description: "Não foi possível carregar as informações do perfil",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) return { error: 'No user authenticated' };

    try {
      setLoading(true);

      // Calculate target macros if basic info is provided
      if (updates.weight && updates.height && updates.age && updates.activity_level && updates.fitness_goal) {
        const macros = calculateMacros(
          updates.weight,
          updates.height,
          updates.age,
          updates.gender || 'other',
          updates.activity_level,
          updates.fitness_goal
        );
        updates = { ...updates, ...macros };
      }

      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email!,
          ...updates,
        }, {
          onConflict: 'id'
        })
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso",
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: "Não foi possível salvar as informações",
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  // Calculate macros based on user info
  const calculateMacros = (
    weight: number,
    height: number,
    age: number,
    gender: string,
    activityLevel: string,
    fitnessGoal: string
  ) => {
    // Basic Mifflin-St Jeor Equation for BMR
    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Activity multipliers
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    let tdee = bmr * (activityMultipliers[activityLevel] || 1.2);

    // Adjust for fitness goal
    switch (fitnessGoal) {
      case 'lose_weight':
        tdee *= 0.8; // 20% deficit
        break;
      case 'gain_muscle':
        tdee *= 1.1; // 10% surplus
        break;
      case 'maintain_weight':
      default:
        // Keep TDEE as is
        break;
    }

    const calories = Math.round(tdee);
    const protein = Math.round(weight * 2.2); // 2.2g per kg
    const fat = Math.round(calories * 0.25 / 9); // 25% of calories from fat
    const carbs = Math.round((calories - (protein * 4) - (fat * 9)) / 4); // Remaining calories from carbs

    return {
      target_calories: calories,
      target_protein: protein,
      target_carbs: carbs,
      target_fat: fat,
    };
  };

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  return {
    profile,
    loading,
    updateProfile,
    refetchProfile: fetchProfile,
  };
};
