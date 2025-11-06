import { Sparkles, Target, Utensils, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StandardHeader from "@/components/StandardHeader";
import NutritionGenerator from "@/components/nutrition/NutritionGenerator";
import MealCard from "@/components/nutrition/MealCard";
import NutritionSummary from "@/components/nutrition/NutritionSummary";
import EmptyNutritionState from "@/components/nutrition/EmptyNutritionState";
import { NutritionPlan } from "@/hooks/useNutrition";

interface NutritionPlansViewProps {
  nutritionPlans: NutritionPlan[];
  loading: boolean;
  isGenerating: boolean;
  isDeletingAll: boolean;
  isProfileComplete: boolean;
  onGeneratePlan: () => void;
  onDeletePlan: (planId: string) => void;
  onDeleteAllPlans: () => void;
}

const NutritionPlansView = ({
  nutritionPlans,
  loading,
  isGenerating,
  isDeletingAll,
  isProfileComplete,
  onGeneratePlan,
  onDeletePlan,
  onDeleteAllPlans
}: NutritionPlansViewProps) => {
  return (
    <div className="min-h-screen bg-background">
      <StandardHeader 
        title="Planos Nutricionais" 
      />
      
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="generator" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="generator">Gerador IA</TabsTrigger>
            <TabsTrigger value="plans">Meus Planos</TabsTrigger>
            <TabsTrigger value="summary">Resumo</TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="space-y-6">
            <NutritionGenerator />
          </TabsContent>

          <TabsContent value="plans" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-poppins font-bold gradient-text">
                  Meus Planos Nutricionais
                </h2>
                <p className="text-muted-foreground">
                  {nutritionPlans.length} plano(s) encontrado(s)
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={onGeneratePlan}
                  disabled={isGenerating || !isProfileComplete}
                  className="btn-primary"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isGenerating ? "Gerando..." : "Gerar Novo Plano"}
                </Button>
                
                {nutritionPlans.length > 0 && (
                  <Button
                    onClick={onDeleteAllPlans}
                    disabled={isDeletingAll}
                    variant="destructive"
                    className="btn-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isDeletingAll ? "Excluindo..." : "Excluir Todos"}
                  </Button>
                )}
              </div>
            </div>

            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="glass-card border border-white/10">
                    <CardHeader>
                      <div className="h-4 bg-muted animate-pulse rounded"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="h-3 bg-muted animate-pulse rounded"></div>
                        <div className="h-3 bg-muted animate-pulse rounded w-2/3"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : nutritionPlans.length === 0 ? (
              <EmptyNutritionState onGenerate={onGeneratePlan} />
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {nutritionPlans.map((plan) => (
                  <Card key={plan.id} className="glass-card border border-white/10 hover-lift group">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-poppins gradient-text">
                          {plan.title}
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeletePlan(plan.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                      {plan.description && (
                        <p className="text-sm text-muted-foreground">
                          {plan.description}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Target className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">
                            {plan.total_calories} kcal
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Utensils className="w-4 h-4 text-primary" />
                          <span className="text-muted-foreground">
                            {plan.meals?.length || 0} refeições
                          </span>
                        </div>
                        {plan.ai_generated && (
                          <div className="flex items-center gap-2 text-sm">
                            <Sparkles className="w-4 h-4 text-yellow-500" />
                            <span className="text-yellow-500">Gerado por IA</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="summary" className="space-y-6">
            <NutritionSummary plans={nutritionPlans} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default NutritionPlansView;
