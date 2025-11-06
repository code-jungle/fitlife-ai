import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  category: 'weight' | 'fitness' | 'nutrition' | 'general';
  target_value: number;
  current_value: number;
  unit: string;
  target_date: string;
  created_at: string;
  completed: boolean;
}

export const useGoals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchGoals = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setGoals(data || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast({
        title: "Erro ao carregar metas",
        description: "Não foi possível carregar suas metas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createGoal = async (goalData: Omit<Goal, 'id' | 'created_at' | 'completed'>) => {
    if (!user) return { error: 'No user authenticated' };

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_goals')
        .insert({
          user_id: user.id,
          title: goalData.title,
          description: goalData.description,
          category: goalData.category,
          target_value: goalData.target_value,
          current_value: goalData.current_value,
          unit: goalData.unit,
          target_date: goalData.target_date,
          completed: false,
        })
        .select()
        .single();

      if (error) throw error;

      await fetchGoals();

      toast({
        title: "Meta criada!",
        description: "Sua nova meta foi adicionada com sucesso",
      });

      return { data, error: null };
    } catch (error) {
      console.error('Error creating goal:', error);
      toast({
        title: "Erro ao criar meta",
        description: "Não foi possível criar sua meta",
        variant: "destructive",
      });
      return { data: null, error };
    } finally {
      setLoading(false);
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<Goal>) => {
    if (!user) return { error: 'No user authenticated' };

    try {
      setLoading(true);
      const { error } = await supabase
        .from('user_goals')
        .update(updates)
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchGoals();

      toast({
        title: "Meta atualizada!",
        description: "Sua meta foi atualizada com sucesso",
      });

      return { error: null };
    } catch (error) {
      console.error('Error updating goal:', error);
      toast({
        title: "Erro ao atualizar meta",
        description: "Não foi possível atualizar sua meta",
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const deleteGoal = async (goalId: string) => {
    if (!user) return { error: 'No user authenticated' };

    try {
      setLoading(true);
      const { error } = await supabase
        .from('user_goals')
        .delete()
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchGoals();

      toast({
        title: "Meta removida!",
        description: "Sua meta foi removida com sucesso",
      });

      return { error: null };
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast({
        title: "Erro ao remover meta",
        description: "Não foi possível remover sua meta",
        variant: "destructive",
      });
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const updateGoalProgress = async (goalId: string, currentValue: number) => {
    if (!user) return { error: 'No user authenticated' };

    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) return { error: 'Goal not found' };

      const completed = currentValue >= goal.target_value;

      const { error } = await supabase
        .from('user_goals')
        .update({ 
          current_value: currentValue,
          completed: completed
        })
        .eq('id', goalId)
        .eq('user_id', user.id);

      if (error) throw error;

      await fetchGoals();

      if (completed) {
        toast({
          title: "Meta concluída!",
          description: "Parabéns! Você alcançou sua meta!",
        });
      } else {
        toast({
          title: "Progresso atualizado!",
          description: "Seu progresso foi atualizado com sucesso",
        });
      }

      return { error: null };
    } catch (error) {
      console.error('Error updating goal progress:', error);
      toast({
        title: "Erro ao atualizar progresso",
        description: "Não foi possível atualizar seu progresso",
        variant: "destructive",
      });
      return { error };
    }
  };

  useEffect(() => {
    if (user) {
      fetchGoals();
    }
  }, [user]);

  return {
    goals,
    loading,
    createGoal,
    updateGoal,
    deleteGoal,
    updateGoalProgress,
    refetchGoals: fetchGoals,
  };
};
