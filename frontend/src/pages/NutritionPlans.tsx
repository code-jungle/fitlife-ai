import { useState } from "react";
import { Sparkles, Target, Utensils, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StandardHeader from "@/components/StandardHeader";
import NutritionGenerator from "@/components/nutrition/NutritionGenerator";
import MealCard from "@/components/nutrition/MealCard";
import NutritionSummary from "@/components/nutrition/NutritionSummary";
import EmptyNutritionState from "@/components/nutrition/EmptyNutritionState";
import { useNutrition } from "@/hooks/useNutrition";
import { useProfile } from "@/hooks/useProfile";
import { useProfileValidation } from "@/hooks/useProfileValidation";
import { geminiService } from "@/services/geminiService";
import { toast } from "@/hooks/use-toast";

const NutritionPlans = () => {
  const { nutritionPlans, loading, createNutritionPlan, deleteNutritionPlan, deleteAllNutritionPlans } = useNutrition();
  const { profile } = useProfile();
  const { isProfileComplete, loading: profileLoading } = useProfileValidation({ redirectOnIncomplete: false });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  // Show loading while checking profile
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Verificando perfil...</p>
        </div>
      </div>
    );
  }


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
        age: profile.age || 25,
        weight: profile.weight || 70,
        height: profile.height || 170,
        gender: profile.gender || 'other',
        activity_level: profile.activity_level || 'moderate',
        fitness_goal: profile.fitness_goal || 'general_fitness',
        allergies: profile.allergies || [],
        dietary_restrictions: profile.dietary_restrictions || [],
        gym_days_per_week: profile.gym_days_per_week || 3
      });

      // Converter para o formato do banco de dados
      const nutritionData = {
        title: geminiNutrition.name,
        description: geminiNutrition.description,
        target_date: new Date().toISOString().split('T')[0],
        total_calories: geminiNutrition.total_calories,
        total_protein: Math.round(geminiNutrition.total_calories * 0.25 / 4), // 25% protein
        total_carbs: Math.round(geminiNutrition.total_calories * 0.50 / 4), // 50% carbs
        total_fat: Math.round(geminiNutrition.total_calories * 0.25 / 9), // 25% fat
        ai_generated: true,
        meals: geminiNutrition.meals.map((meal, index) => {
          console.log('Processing meal:', meal);
          console.log('Meal name:', meal.name);
          console.log('Meal foods:', meal.foods);
          
          // Usar foods do Gemini
          const foodsData = meal.foods || [];
          console.log('Foods data to process:', foodsData);
          
          const mealType = index === 0 ? "breakfast" : 
                          index === 1 ? "lunch" : 
                          index === 2 ? "snack" : "dinner";
          
          console.log(`Mapping meal ${index}: ${meal.name} -> ${mealType}`);
          
          return {
            meal_type: mealType,
            name: meal.name,
            description: getMealDescription(mealType),
            calories: meal.calories,
            protein: Math.round(meal.calories * 0.25 / 4),
            carbs: Math.round(meal.calories * 0.50 / 4),
            fat: Math.round(meal.calories * 0.25 / 9),
            order_index: index,
            meal_foods: foodsData.map(food => {
              console.log('Processing food:', food);
              const quantityStr = String(food.quantity || '100g');
              const quantityValue = parseFloat(quantityStr.replace(/[^\d.]/g, '')) || 100;
              const unit = quantityStr.replace(/[\d.]/g, '') || 'g';
              
              const processedFood = {
                food_name: food.name || 'Alimento',
                quantity: quantityValue,
                unit: unit,
                calories_per_unit: (food.calories || 0) / quantityValue,
                protein_per_unit: (food.protein || 0) / quantityValue,
                carbs_per_unit: (food.carbs || 0) / quantityValue,
                fat_per_unit: (food.fat || 0) / quantityValue
              };
              
              console.log('Processed food:', processedFood);
              return processedFood;
            })
          };
        })
      };

      console.log('Nutrition data to save:', nutritionData);

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

  const handleDeletePlan = async (planId: string) => {
    try {
      await deleteNutritionPlan(planId);
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  const handleDeleteAllPlans = async () => {
    if (nutritionPlans.length === 0) {
      toast({
        title: "Nenhum plano encontrado",
        description: "Não há planos nutricionais para excluir",
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

  const getMealDescription = (mealType: string) => {
    switch (mealType) {
      case "breakfast":
        return "Refeição energética para começar o dia";
      case "lunch":
        return "Refeição principal balanceada";
      case "snack":
        return "Lanche saudável entre refeições";
      case "dinner":
        return "Refeição leve para o final do dia";
      default:
        return "Refeição personalizada";
    }
  };

  const generateNutritionFromProfile = (profile: UserProfile) => {
    const { fitness_goal, target_calories, target_protein, target_carbs, target_fat, dietary_restrictions, allergies } = profile;
    
    // Use target macros from profile or calculate defaults
    const calories = target_calories || 2000;
    const protein = target_protein || 150;
    const carbs = target_carbs || 250;
    const fat = target_fat || 70;

    // Determine meal distribution based on fitness goal
    let mealDistribution = {
      "Café da Manhã": 0.25,
      "Almoço": 0.35,
      "Jantar": 0.30,
      "Lanche": 0.10
    };

    if (fitness_goal === "gain_muscle") {
      mealDistribution = {
        "Café da Manhã": 0.20,
        "Almoço": 0.30,
        "Jantar": 0.30,
        "Lanche": 0.20
      };
    } else if (fitness_goal === "lose_weight") {
      mealDistribution = {
        "Café da Manhã": 0.30,
        "Almoço": 0.40,
        "Jantar": 0.25,
        "Lanche": 0.05
      };
    }

    const meals = [
      {
        meal_type: "breakfast",
        name: "Café da Manhã",
        description: "Refeição energética para começar o dia",
        calories: Math.round(calories * mealDistribution["Café da Manhã"]),
        protein: Math.round(protein * mealDistribution["Café da Manhã"]),
        carbs: Math.round(carbs * mealDistribution["Café da Manhã"]),
        fat: Math.round(fat * mealDistribution["Café da Manhã"]),
        order_index: 0,
        meal_foods: generateBreakfastFoods(calories * mealDistribution["Café da Manhã"], dietary_restrictions, allergies)
      },
      {
        meal_type: "lunch",
        name: "Almoço",
        description: "Refeição principal balanceada",
        calories: Math.round(calories * mealDistribution["Almoço"]),
        protein: Math.round(protein * mealDistribution["Almoço"]),
        carbs: Math.round(carbs * mealDistribution["Almoço"]),
        fat: Math.round(fat * mealDistribution["Almoço"]),
        order_index: 1,
        meal_foods: generateLunchFoods(calories * mealDistribution["Almoço"], dietary_restrictions, allergies)
      },
      {
        meal_type: "snack",
        name: "Lanche",
        description: "Lanche saudável entre refeições",
        calories: Math.round(calories * mealDistribution["Lanche"]),
        protein: Math.round(protein * mealDistribution["Lanche"]),
        carbs: Math.round(carbs * mealDistribution["Lanche"]),
        fat: Math.round(fat * mealDistribution["Lanche"]),
        order_index: 2,
        meal_foods: generateSnackFoods(calories * mealDistribution["Lanche"], dietary_restrictions, allergies)
      },
      {
        meal_type: "dinner",
        name: "Jantar",
        description: "Refeição leve para o final do dia",
        calories: Math.round(calories * mealDistribution["Jantar"]),
        protein: Math.round(protein * mealDistribution["Jantar"]),
        carbs: Math.round(carbs * mealDistribution["Jantar"]),
        fat: Math.round(fat * mealDistribution["Jantar"]),
        order_index: 3,
        meal_foods: generateDinnerFoods(calories * mealDistribution["Jantar"], dietary_restrictions, allergies)
      }
    ];

    return {
      title: `Plano ${fitness_goal === "lose_weight" ? "Emagrecimento" : fitness_goal === "gain_muscle" ? "Ganho de Massa" : "Equilibrado"} - ${calories} kcal`,
      description: `Plano nutricional personalizado baseado no seu objetivo: ${fitness_goal}`,
      target_date: new Date().toISOString().split('T')[0],
      total_calories: calories,
      total_protein: protein,
      total_carbs: carbs,
      total_fat: fat,
      ai_generated: true,
      meals: meals
    };
  };

  const generateBreakfastFoods = (calories: number, restrictions: string[] = [], allergies: string[] = []) => {
    const foods = [];
    const baseCalories = calories * 0.4; // 40% for main food
    const proteinCalories = calories * 0.3; // 30% for protein
    const carbCalories = calories * 0.3; // 30% for carbs

    // Main food
    if (!restrictions.includes("gluten_free")) {
      foods.push({
        food_name: "Aveia",
        quantity: Math.round(baseCalories / 3.5), // ~3.5 cal/g
        unit: "g",
        calories_per_unit: 3.5,
        protein_per_unit: 0.12,
        carbs_per_unit: 0.6,
        fat_per_unit: 0.07
      });
    } else {
      foods.push({
        food_name: "Quinoa",
        quantity: Math.round(baseCalories / 3.7),
        unit: "g",
        calories_per_unit: 3.7,
        protein_per_unit: 0.14,
        carbs_per_unit: 0.64,
        fat_per_unit: 0.06
      });
    }

    // Protein
    foods.push({
      food_name: "Iogurte Grego",
      quantity: Math.round(proteinCalories / 0.6), // ~0.6 cal/g
      unit: "g",
      calories_per_unit: 0.6,
      protein_per_unit: 0.10,
      carbs_per_unit: 0.04,
      fat_per_unit: 0.01
    });

    // Fruits
    foods.push({
      food_name: "Banana",
      quantity: Math.round(carbCalories / 0.9), // ~0.9 cal/g
      unit: "g",
      calories_per_unit: 0.9,
      protein_per_unit: 0.01,
      carbs_per_unit: 0.23,
      fat_per_unit: 0.003
    });

    return foods;
  };

  const generateLunchFoods = (calories: number, restrictions: string[] = [], allergies: string[] = []) => {
    const foods = [];
    const proteinCalories = calories * 0.4; // 40% protein
    const carbCalories = calories * 0.4; // 40% carbs
    const fatCalories = calories * 0.2; // 20% fat

    // Protein
    foods.push({
      food_name: "Peito de Frango",
      quantity: Math.round(proteinCalories / 1.65), // ~1.65 cal/g
      unit: "g",
      calories_per_unit: 1.65,
      protein_per_unit: 0.31,
      carbs_per_unit: 0,
      fat_per_unit: 0.036
    });

    // Carbs
    if (!restrictions.includes("gluten_free")) {
      foods.push({
        food_name: "Arroz Integral",
        quantity: Math.round(carbCalories / 1.1), // ~1.1 cal/g
        unit: "g",
        calories_per_unit: 1.1,
        protein_per_unit: 0.025,
        carbs_per_unit: 0.23,
        fat_per_unit: 0.009
      });
    } else {
      foods.push({
        food_name: "Batata Doce",
        quantity: Math.round(carbCalories / 0.86),
        unit: "g",
        calories_per_unit: 0.86,
        protein_per_unit: 0.016,
        carbs_per_unit: 0.20,
        fat_per_unit: 0.001
      });
    }

    // Vegetables
    foods.push({
      food_name: "Brócolis",
      quantity: 100,
      unit: "g",
      calories_per_unit: 0.34,
      protein_per_unit: 0.028,
      carbs_per_unit: 0.07,
      fat_per_unit: 0.004
    });

    // Fat
    foods.push({
      food_name: "Azeite de Oliva",
      quantity: Math.round(fatCalories / 8.8), // ~8.8 cal/g
      unit: "g",
      calories_per_unit: 8.8,
      protein_per_unit: 0,
      carbs_per_unit: 0,
      fat_per_unit: 1
    });

    return foods;
  };

  const generateDinnerFoods = (calories: number, restrictions: string[] = [], allergies: string[] = []) => {
    const foods = [];
    const proteinCalories = calories * 0.5; // 50% protein
    const carbCalories = calories * 0.3; // 30% carbs
    const fatCalories = calories * 0.2; // 20% fat

    // Protein
    foods.push({
      food_name: "Salmão",
      quantity: Math.round(proteinCalories / 2.08), // ~2.08 cal/g
      unit: "g",
      calories_per_unit: 2.08,
      protein_per_unit: 0.25,
      carbs_per_unit: 0,
      fat_per_unit: 0.12
    });

    // Carbs
    foods.push({
      food_name: "Quinoa",
      quantity: Math.round(carbCalories / 1.2),
      unit: "g",
      calories_per_unit: 1.2,
      protein_per_unit: 0.14,
      carbs_per_unit: 0.22,
      fat_per_unit: 0.02
    });

    // Vegetables
    foods.push({
      food_name: "Espinafre",
      quantity: 50,
      unit: "g",
      calories_per_unit: 0.23,
      protein_per_unit: 0.029,
      carbs_per_unit: 0.036,
      fat_per_unit: 0.004
    });

    return foods;
  };

  const generateSnackFoods = (calories: number, restrictions: string[] = [], allergies: string[] = []) => {
    const foods = [];

    // Nuts
    foods.push({
      food_name: "Amêndoas",
      quantity: Math.round(calories * 0.6 / 5.79), // ~5.79 cal/g
      unit: "g",
      calories_per_unit: 5.79,
      protein_per_unit: 0.21,
      carbs_per_unit: 0.22,
      fat_per_unit: 0.50
    });

    // Fruit
    foods.push({
      food_name: "Maçã",
      quantity: Math.round(calories * 0.4 / 0.52), // ~0.52 cal/g
      unit: "g",
      calories_per_unit: 0.52,
      protein_per_unit: 0.003,
      carbs_per_unit: 0.14,
      fat_per_unit: 0.002
    });

    return foods;
  };

  return (
    <div className="min-h-screen bg-background">
      <StandardHeader title="Gerar Plano Alimentar" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-poppins font-bold gradient-text mb-2">
              Planos Alimentares
            </h1>
            <p className="text-muted-foreground text-lg">
              Nutrição personalizada criada pela IA
            </p>
          </div>
          
          <Button 
            onClick={handleGeneratePlan}
            disabled={isGenerating}
            className="btn-primary w-full md:w-auto"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {isGenerating ? "Gerando..." : "Gerar Sugestão Nutricional"}
          </Button>
        </div>

        {/* Disclaimer Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-amber-500 text-sm">⚠️</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Aviso Importante - Sugestões Nutricionais
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Todos os planos nutricionais gerados são <strong>sugestões personalizadas</strong> baseadas em IA e seus dados de perfil. 
                Não somos profissionais qualificados e estes planos não substituem orientação de nutricionistas ou médicos. 
                Sempre consulte um profissional antes de seguir qualquer plano alimentar.
              </p>
            </div>
          </div>
        </div>

        {/* Nutrition Generator (Loading State) */}
        {isGenerating && <NutritionGenerator />}

        {/* Nutrition Summary */}
        <NutritionSummary plans={nutritionPlans} />

        {/* Nutrition Plans List */}
        <Tabs defaultValue="all" className="mt-8">
          

          {/* Delete All Button */}
          {nutritionPlans.length > 0 && (
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteAllPlans}
                disabled={isDeletingAll || loading}
                className="btn-destructive hover:bg-red-500/20 hover:border-red-500/50"
              >
                {isDeletingAll ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir Todos os Planos
                  </>
                )}
              </Button>
            </div>
          )}

          <TabsContent value="all" className="mt-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : nutritionPlans.length > 0 ? (
              <div className="space-y-6">
                {nutritionPlans.map((plan) => (
                  <Card key={plan.id} className="glass-card border border-white/10">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                      <CardTitle className="text-xl font-poppins text-foreground">
                        {plan.title}
                      </CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
                        <span className="flex items-center gap-1">
                          <Target className="w-4 h-4" />
                              {plan.total_calories} kcal
                        </span>
                        <span className="flex items-center gap-1">
                          <Utensils className="w-4 h-4" />
                              {plan.meals?.length || 0} refeições
                        </span>
                          </div>
                        </div>
                        
                        {/* Delete Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePlan(plan.id)}
                          disabled={loading}
                          className="btn-destructive hover:bg-red-500/20 hover:border-red-500/50 ml-4"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {plan.meals?.sort((a, b) => (a.order_index || 0) - (b.order_index || 0)).map((meal, index) => {
                          console.log(`Meal ${index}: ${meal.meal_type} - order_index: ${meal.order_index} - name: ${meal.name}`);
                          return <MealCard key={`${meal.meal_type}-${index}`} meal={meal} />;
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <EmptyNutritionState onGenerate={handleGeneratePlan} />
            )}
          </TabsContent>

          <TabsContent value="recent" className="mt-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
            <div className="space-y-6">
              {nutritionPlans
                .slice(0, 2)
                .map((plan) => (
                  <Card key={plan.id} className="glass-card border border-white/10">
                    <CardHeader>
                      <CardTitle className="text-xl font-poppins text-foreground">
                        {plan.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                          {plan.meals?.map((meal, index) => (
                          <MealCard key={index} meal={meal} />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <EmptyNutritionState 
              title="Nenhum plano favoritado ainda"
              description="Marque planos como favoritos para acessá-los rapidamente"
              onGenerate={handleGeneratePlan}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default NutritionPlans;