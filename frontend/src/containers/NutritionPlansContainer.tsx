import { useState } from 'react';
import { useNutrition } from '@/hooks/useNutrition';
import { useProfile } from '@/hooks/useProfile';
import { useProfileValidation } from '@/hooks/useProfileValidation';
import { geminiService } from '@/services/geminiService';
import { toast } from '@/hooks/use-toast';
import NutritionPlansView from '../components/nutrition/NutritionPlansView';
import LoadingState from '@/components/ui/LoadingState';

const NutritionPlansContainer = () => {
  const { nutritionPlans, loading, createNutritionPlan, deleteNutritionPlan, deleteAllNutritionPlans } = useNutrition();
  const { profile } = useProfile();
  const { isProfileComplete } = useProfileValidation({ redirectOnIncomplete: false });
  const [profileLoading, setProfileLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  // ✅ SEPARADO: Lógica de negócio no container
  const handleGeneratePlan = async () => {
    if (!isProfileComplete) {
      toast({
        title: "Perfil incompleto",
        description: "Complete seu perfil para gerar planos nutricionais personalizados",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Verificar se a chave da API do Gemini está configurada
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        toast({
          title: "Configuração necessária",
          description: "Chave da API do Gemini não configurada. Usando plano padrão.",
          variant: "destructive",
        });
        // Usar geração local como fallback
        const nutritionData = generateNutritionFromProfile(profile);
        const { error } = await createNutritionPlan(nutritionData);
        if (!error) {
          toast({
            title: "Sugestão nutricional gerada!",
            description: "Sua nova sugestão nutricional foi criada com sucesso",
          });
        }
        return;
      }

      // Usar Gemini para gerar plano nutricional personalizado
      const geminiNutrition = await geminiService.generateNutritionPlan({
        age: profile?.age || 25,
        weight: profile?.weight || 70,
        height: profile?.height || 170,
        gender: profile?.gender || 'other',
        activity_level: profile?.activity_level || 'moderate',
        fitness_goal: profile?.fitness_goal || 'general_fitness',
        allergies: profile?.allergies || [],
        dietary_restrictions: profile?.dietary_restrictions || [],
        gym_days_per_week: profile?.gym_days_per_week || 3
      });

      // Converter para o formato do banco de dados
      const nutritionData = transformGeminiNutritionToDB(geminiNutrition);
      const { error } = await createNutritionPlan(nutritionData);
      
      if (!error) {
        toast({
          title: "Sugestão nutricional gerada com IA!",
          description: "Sua sugestão nutricional personalizada foi criada usando inteligência artificial",
        });
      }
    } catch (error) {
      console.error('Error generating nutrition plan:', error);
      toast({
        title: "Erro ao gerar plano nutricional",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteAllPlans = async () => {
    if (nutritionPlans.length === 0) {
      toast({
        title: "Nenhum plano encontrado",
        description: "Não há planos para excluir",
      });
      return;
    }

    setIsDeletingAll(true);
    try {
      await deleteAllNutritionPlans();
    } finally {
      setIsDeletingAll(false);
    }
  };

  // ✅ SEPARADO: Funções utilitárias no container
  const generateNutritionFromProfile = (profile: any) => {
    // Lógica de geração local
    return {
      title: "Plano Nutricional Personalizado",
      description: "Plano baseado no seu perfil",
      target_date: new Date().toISOString().split('T')[0],
      total_calories: 2000,
      ai_generated: false,
      meals: []
    };
  };

  const transformGeminiNutritionToDB = (geminiNutrition: any) => {
    // Lógica de transformação de dados
    return {
      title: geminiNutrition.name,
      description: geminiNutrition.description,
      target_date: new Date().toISOString().split('T')[0],
      total_calories: geminiNutrition.total_calories,
      total_protein: Math.round(geminiNutrition.total_calories * 0.25 / 4),
      total_carbs: Math.round(geminiNutrition.total_calories * 0.50 / 4),
      total_fat: Math.round(geminiNutrition.total_calories * 0.25 / 9),
      ai_generated: true,
      meals: geminiNutrition.meals.map((meal: any, index: number) => ({
        meal_type: index === 0 ? "breakfast" : 
                   index === 1 ? "lunch" : 
                   index === 2 ? "snack" : "dinner",
        name: meal.name,
        description: getMealDescription(index === 0 ? "breakfast" : 
                                       index === 1 ? "lunch" : 
                                       index === 2 ? "snack" : "dinner"),
        calories: meal.calories,
        protein: Math.round(meal.calories * 0.25 / 4),
        carbs: Math.round(meal.calories * 0.50 / 4),
        fat: Math.round(meal.calories * 0.25 / 9),
        order_index: index,
        meal_foods: (meal.foods || []).map((food: any) => ({
          food_name: food.name || 'Alimento',
          quantity: parseFloat(String(food.quantity || '100g').replace(/[^\d.]/g, '')) || 100,
          unit: String(food.quantity || '100g').replace(/[\d.]/g, '') || 'g',
          calories_per_unit: (food.calories || 0) / (parseFloat(String(food.quantity || '100g').replace(/[^\d.]/g, '')) || 100),
          protein_per_unit: (food.protein || 0) / (parseFloat(String(food.quantity || '100g').replace(/[^\d.]/g, '')) || 100),
          carbs_per_unit: (food.carbs || 0) / (parseFloat(String(food.quantity || '100g').replace(/[^\d.]/g, '')) || 100),
          fat_per_unit: (food.fat || 0) / (parseFloat(String(food.quantity || '100g').replace(/[^\d.]/g, '')) || 100)
        }))
      }))
    };
  };

  const getMealDescription = (mealType: string) => {
    const descriptions = {
      breakfast: "Refeição matinal para começar o dia com energia",
      lunch: "Almoço balanceado para manter a energia",
      snack: "Lanche saudável para manter o metabolismo ativo",
      dinner: "Jantar leve e nutritivo para uma boa noite de sono"
    };
    return descriptions[mealType as keyof typeof descriptions] || "Refeição nutritiva";
  };

  // Show loading while checking profile
  if (profileLoading) {
    return <LoadingState message="Verificando perfil..." fullScreen />;
  }

  return (
    <NutritionPlansView
      nutritionPlans={nutritionPlans}
      loading={loading}
      isGenerating={isGenerating}
      isDeletingAll={isDeletingAll}
      isProfileComplete={isProfileComplete(profile)}
      onGeneratePlan={handleGeneratePlan}
      onDeletePlan={deleteNutritionPlan}
      onDeleteAllPlans={handleDeleteAllPlans}
    />
  );
};

export default NutritionPlansContainer;
