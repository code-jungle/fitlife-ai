import React, { memo, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { MealData } from "@/hooks/useMealCard";
import MealCardHeader from "./MealCardHeader";
import MealCardNutrition from "./MealCardNutrition";
import MealCardIngredients from "./MealCardIngredients";
import MealCardActions from "./MealCardActions";

interface MealCardOptimizedProps {
  meal: MealData;
}

// ✅ OTIMIZADO: React.memo para evitar re-renderizações desnecessárias
const MealCardOptimized = memo<MealCardOptimizedProps>(({ meal }) => {
  // ✅ OTIMIZADO: useMemo para cálculos pesados
  const mealSuggestions = useMemo(() => {
    const suggestions = {
      breakfast: [
        { name: "Panqueca de Aveia", quantity: "1", unit: "unidade" },
        { name: "Omelete de Vegetais", quantity: "2", unit: "ovos" },
        { name: "Açaí com Granola", quantity: "200", unit: "ml" }
      ],
      lunch: [
        { name: "Frango Grelhado", quantity: "150", unit: "g" },
        { name: "Salmão Assado", quantity: "120", unit: "g" },
        { name: "Salada Completa", quantity: "1", unit: "prato" }
      ],
      snack: [
        { name: "Mix de Castanhas", quantity: "30", unit: "g" },
        { name: "Maçã com Canela", quantity: "1", unit: "unidade" },
        { name: "Iogurte Grego", quantity: "150", unit: "ml" }
      ],
      dinner: [
        { name: "Sopa de Legumes", quantity: "300", unit: "ml" },
        { name: "Wrap de Frango", quantity: "1", unit: "unidade" },
        { name: "Massa Integral", quantity: "80", unit: "g" }
      ]
    };
    return suggestions[meal.meal_type as keyof typeof suggestions] || [];
  }, [meal.meal_type]);

  const mealIcon = useMemo(() => {
    const icons = {
      breakfast: "🌅",
      lunch: "☀️",
      snack: "🍎",
      dinner: "🌙"
    };
    return icons[meal.meal_type as keyof typeof icons] || "🍽️";
  }, [meal.meal_type]);

  const mealTypeName = useMemo(() => {
    const names = {
      breakfast: "Café da Manhã",
      lunch: "Almoço",
      snack: "Lanche",
      dinner: "Jantar"
    };
    return names[meal.meal_type as keyof typeof names] || "Refeição";
  }, [meal.meal_type]);

  const suggestedTime = useMemo(() => {
    const times = {
      breakfast: "07:00 - 09:00",
      lunch: "12:00 - 14:00",
      snack: "15:00 - 17:00",
      dinner: "19:00 - 21:00"
    };
    return times[meal.meal_type as keyof typeof times] || "Horário sugerido";
  }, [meal.meal_type]);

  const colorScheme = useMemo(() => {
    const schemes = {
      breakfast: {
        bg: "bg-gradient-to-br from-yellow-500/10 to-orange-500/10",
        border: "border-yellow-500/20",
        text: "text-yellow-600",
        icon: "text-yellow-500",
        accent: "bg-yellow-500",
        button: "bg-yellow-500 hover:bg-yellow-600"
      },
      lunch: {
        bg: "bg-gradient-to-br from-blue-500/10 to-cyan-500/10",
        border: "border-blue-500/20",
        text: "text-blue-600",
        icon: "text-blue-500",
        accent: "bg-blue-500",
        button: "bg-blue-500 hover:bg-blue-600"
      },
      snack: {
        bg: "bg-gradient-to-br from-green-500/10 to-emerald-500/10",
        border: "border-green-500/20",
        text: "text-green-600",
        icon: "text-green-500",
        accent: "bg-green-500",
        button: "bg-green-500 hover:bg-green-600"
      },
      dinner: {
        bg: "bg-gradient-to-br from-purple-500/10 to-pink-500/10",
        border: "border-purple-500/20",
        text: "text-purple-600",
        icon: "text-purple-500",
        accent: "bg-purple-500",
        button: "bg-purple-500 hover:bg-purple-600"
      }
    };
    return schemes[meal.meal_type as keyof typeof schemes] || schemes.breakfast;
  }, [meal.meal_type]);

  const mealBenefit = useMemo(() => {
    const benefits = {
      breakfast: "Energia para começar o dia",
      lunch: "Combustível para o meio do dia",
      snack: "Energia entre refeições",
      dinner: "Recuperação noturna"
    };
    return benefits[meal.meal_type as keyof typeof benefits] || "Benefício nutricional";
  }, [meal.meal_type]);

  return (
    <Card className={`glass-card border ${colorScheme.border} h-full hover-lift group overflow-hidden`}>
      <MealCardHeader
        mealIcon={mealIcon}
        mealTypeName={mealTypeName}
        suggestedTime={suggestedTime}
        colorScheme={colorScheme}
      />

      <CardContent className="p-4 space-y-4">
        <MealCardNutrition
          calories={meal.calories}
          protein={meal.protein}
          carbs={meal.carbs}
          fat={meal.fat}
          colorScheme={colorScheme}
        />

        <MealCardIngredients
          mealFoods={meal.meal_foods}
          mealSuggestions={mealSuggestions}
          description={meal.description}
          colorScheme={colorScheme}
        />

        <MealCardActions
          mealBenefit={mealBenefit}
          colorScheme={colorScheme}
        />
      </CardContent>
    </Card>
  );
});

// ✅ OTIMIZADO: displayName para debugging
MealCardOptimized.displayName = 'MealCardOptimized';

export default MealCardOptimized;
