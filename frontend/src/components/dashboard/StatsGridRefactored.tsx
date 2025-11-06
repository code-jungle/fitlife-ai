import { Activity, Target, TrendingUp, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";
import { useHealthCalculations } from "@/hooks/useHealthCalculations";

const StatsGridRefactored = () => {
  const { profile } = useProfile();
  const { bmi, bmiCategory, activityLevelText, heightInMeters } = useHealthCalculations(profile);

  // ✅ SEPARADO: Apenas dados para apresentação
  const stats = [
    {
      title: "Peso Atual",
      value: profile?.weight ? `${profile.weight} kg` : "Não definido",
      change: null,
      changeType: "neutral" as const,
      icon: User,
    },
    {
      title: "Altura",
      value: heightInMeters ? `${heightInMeters} m` : "Não definido",
      change: null,
      changeType: "neutral" as const,
      icon: Activity,
    },
    {
      title: "IMC",
      value: bmi ? bmi.toString() : "Não calculado",
      change: bmiCategory?.category || null,
      changeType: bmiCategory?.type || "neutral",
      icon: Target,
    },
    {
      title: "Nível de Atividade",
      value: activityLevelText,
      change: null,
      changeType: "neutral" as const,
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="glass-card border border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            {stat.change && (
              <p className={`text-xs ${
                stat.changeType === "positive" 
                  ? "text-green-500" 
                  : stat.changeType === "negative" 
                  ? "text-red-500" 
                  : "text-muted-foreground"
              }`}>
                {stat.change}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsGridRefactored;

