import { useState, useEffect } from 'react';
import { Goal } from './useGoals';
import { geminiService } from '@/services/geminiService';
import { toast } from '@/hooks/use-toast';

export interface GoalFormData {
  title: string;
  description: string;
  category: Goal['category'];
  target_value: string;
  current_value: string;
  unit: string;
  target_date: string;
}

export const useGoalsTracking = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [goalForm, setGoalForm] = useState<GoalFormData>({
    title: "",
    description: "",
    category: "general",
    target_value: "",
    current_value: "",
    unit: "",
    target_date: "",
  });

  const goalCategories = [
    { value: "weight", label: "Peso", icon: "⚖️" },
    { value: "fitness", label: "Fitness", icon: "💪" },
    { value: "nutrition", label: "Nutrição", icon: "🥗" },
    { value: "general", label: "Geral", icon: "🎯" }
  ];

  const unitOptions = {
    weight: ["kg", "g"],
    fitness: ["min", "reps", "sets", "km", "dias"],
    nutrition: ["kcal", "g", "ml", "porções"],
    general: ["unidades", "vezes", "dias", "%"]
  };

  const resetForm = () => {
    setGoalForm({
      title: "",
      description: "",
      category: "general",
      target_value: "",
      current_value: "",
      unit: "",
      target_date: "",
    });
    setEditingGoal(null);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setGoalForm({
      title: goal.title,
      description: goal.description || "",
      category: goal.category,
      target_value: goal.target_value.toString(),
      current_value: goal.current_value.toString(),
      unit: goal.unit,
      target_date: goal.target_date,
    });
    setIsDialogOpen(true);
  };

  const generateSuggestions = async (profile: any) => {
    setIsGeneratingSuggestions(true);
    try {
      const suggestions = await geminiService.generateGoalSuggestions(profile);
      setSuggestions(suggestions);
    } catch (error) {
      toast({
        title: "Erro ao gerar sugestões",
        description: "Não foi possível gerar sugestões de metas",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getDaysUntilTarget = (targetDate: string) => {
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getGoalStatus = (goal: Goal) => {
    if (goal.completed) return 'completed';
    const daysLeft = getDaysUntilTarget(goal.target_date);
    if (daysLeft < 0) return 'overdue';
    if (daysLeft <= 7) return 'urgent';
    return 'active';
  };

  return {
    // State
    isDialogOpen,
    setIsDialogOpen,
    editingGoal,
    setEditingGoal,
    isGeneratingSuggestions,
    suggestions,
    goalForm,
    setGoalForm,
    
    // Constants
    goalCategories,
    unitOptions,
    
    // Actions
    resetForm,
    handleEditGoal,
    generateSuggestions,
    getProgressPercentage,
    getDaysUntilTarget,
    getGoalStatus
  };
};

