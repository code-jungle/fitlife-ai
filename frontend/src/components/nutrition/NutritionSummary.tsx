import { TrendingUp, Target, Utensils, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NutritionPlan } from "@/hooks/useNutrition";

interface NutritionSummaryProps {
  plans: NutritionPlan[];
}

const NutritionSummary = ({ plans }: NutritionSummaryProps) => {
  const totalPlans = plans.length;
  const avgCalories = totalPlans > 0 
    ? Math.round(plans.reduce((sum, plan) => sum + (plan.total_calories || 0), 0) / totalPlans)
    : 0;
  
  const totalMeals = plans.reduce((sum, plan) => sum + (plan.meals?.length || 0), 0);
  const avgMealsPerPlan = totalPlans > 0 ? Math.round(totalMeals / totalPlans) : 0;

  const stats = [
    {
      title: "Planos Criados",
      value: totalPlans.toString(),
      icon: Utensils,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Média Calórica",
      value: `${avgCalories} kcal`,
      icon: Target,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Refeições Total",
      value: totalMeals.toString(),
      icon: Calendar,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Média p/ Plano",
      value: `${avgMealsPerPlan} refeições`,
      icon: TrendingUp,
      color: "from-purple-500 to-pink-500",
    },
  ];

  if (totalPlans === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="glass-card border border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NutritionSummary;