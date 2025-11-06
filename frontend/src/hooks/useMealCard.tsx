import { useMemo } from 'react';

export interface MealData {
  name: string;
  meal_type?: string;
  suggested_time?: string;
  description?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  benefits?: string[];
  instructions?: string[];
  tips?: string[];
  meal_foods?: Array<{
    food_name: string;
    quantity: number;
    unit: string;
    calories_per_unit?: number;
  }>;
}

export const useMealCard = (meal: MealData) => {
  const getMealSuggestions = (mealType: string | undefined) => {
    switch (mealType?.toLowerCase()) {
      case "breakfast":
        return [
          { name: "Aveia com frutas", quantity: "50g", unit: "aveia + 1 banana" },
          { name: "Pão integral", quantity: "2", unit: "fatias" },
          { name: "Ovos", quantity: "2", unit: "unidades" },
          { name: "Leite desnatado", quantity: "200ml", unit: "ml" }
        ];
      case "lunch":
        return [
          { name: "Arroz integral", quantity: "100g", unit: "cozido" },
          { name: "Frango grelhado", quantity: "150g", unit: "g" },
          { name: "Salada verde", quantity: "1", unit: "prato" },
          { name: "Legumes refogados", quantity: "100g", unit: "g" }
        ];
      case "snack":
        return [
          { name: "Iogurte natural", quantity: "1", unit: "pote" },
          { name: "Frutas", quantity: "1", unit: "unidade" },
          { name: "Castanhas", quantity: "30g", unit: "g" },
          { name: "Chá verde", quantity: "200ml", unit: "ml" }
        ];
      case "dinner":
        return [
          { name: "Salmão grelhado", quantity: "120g", unit: "g" },
          { name: "Batata doce", quantity: "1", unit: "unidade média" },
          { name: "Brócolis", quantity: "100g", unit: "g" },
          { name: "Azeite extra virgem", quantity: "1", unit: "colher de sopa" }
        ];
      default:
        return [
          { name: "Alimento 1", quantity: "100g", unit: "g" },
          { name: "Alimento 2", quantity: "1", unit: "unidade" }
        ];
    }
  };

  const getMealIcon = (mealType: string | undefined) => {
    if (!mealType) return "🍴";
    
    switch (mealType.toLowerCase()) {
      case "breakfast":
        return "☀️";
      case "lunch":
        return "🍽️";
      case "dinner":
        return "🌙";
      case "snack":
        return "🍎";
      default:
        return "🍴";
    }
  };

  const getMealTypeName = (mealType: string | undefined) => {
    switch (mealType?.toLowerCase()) {
      case "breakfast":
        return "Café da Manhã";
      case "lunch":
        return "Almoço";
      case "dinner":
        return "Jantar";
      case "snack":
        return "Lanche";
      default:
        return meal?.name || "Refeição";
    }
  };

  const getSuggestedTime = (mealType: string | undefined) => {
    switch (mealType?.toLowerCase()) {
      case "breakfast":
        return "07:00 - 08:00";
      case "lunch":
        return "12:00 - 13:00";
      case "dinner":
        return "19:00 - 20:00";
      case "snack":
        return "15:00 - 16:00";
      default:
        return meal.suggested_time || "Horário sugerido";
    }
  };

  const getMealColorScheme = (mealType: string | undefined) => {
    switch (mealType?.toLowerCase()) {
      case "breakfast":
        return {
          bg: "from-orange-500/20 to-yellow-500/20",
          border: "border-orange-500/30",
          icon: "bg-orange-500",
          accent: "text-orange-500",
          button: "bg-orange-500 hover:bg-orange-600"
        };
      case "lunch":
        return {
          bg: "from-green-500/20 to-emerald-500/20",
          border: "border-green-500/30",
          icon: "bg-green-500",
          accent: "text-green-500",
          button: "bg-green-500 hover:bg-green-600"
        };
      case "dinner":
        return {
          bg: "from-purple-500/20 to-indigo-500/20",
          border: "border-purple-500/30",
          icon: "bg-purple-500",
          accent: "text-purple-500",
          button: "bg-purple-500 hover:bg-purple-600"
        };
      case "snack":
        return {
          bg: "from-blue-500/20 to-cyan-500/20",
          border: "border-blue-500/30",
          icon: "bg-blue-500",
          accent: "text-blue-500",
          button: "bg-blue-500 hover:bg-blue-600"
        };
      default:
        return {
          bg: "from-gray-500/20 to-slate-500/20",
          border: "border-gray-500/30",
          icon: "bg-gray-500",
          accent: "text-gray-500",
          button: "bg-gray-500 hover:bg-gray-600"
        };
    }
  };

  const getMealBenefit = (mealType: string | undefined) => {
    switch (mealType?.toLowerCase()) {
      case "breakfast":
        return "Energia para começar o dia com força total!";
      case "lunch":
        return "Refeição completa para manter a energia até o final do dia!";
      case "dinner":
        return "Refeição leve e nutritiva para uma boa noite de sono!";
      case "snack":
        return "Lanche saudável para manter o metabolismo ativo!";
      default:
        return "Refeição nutritiva e balanceada para sua saúde!";
    }
  };

  const mealSuggestions = useMemo(() => getMealSuggestions(meal.meal_type), [meal.meal_type]);
  const mealIcon = useMemo(() => getMealIcon(meal.meal_type), [meal.meal_type]);
  const mealTypeName = useMemo(() => getMealTypeName(meal.meal_type), [meal.meal_type]);
  const suggestedTime = useMemo(() => getSuggestedTime(meal.meal_type), [meal.meal_type]);
  const colorScheme = useMemo(() => getMealColorScheme(meal.meal_type), [meal.meal_type]);
  const mealBenefit = useMemo(() => getMealBenefit(meal.meal_type), [meal.meal_type]);

  return {
    mealSuggestions,
    mealIcon,
    mealTypeName,
    suggestedTime,
    colorScheme,
    mealBenefit
  };
};

