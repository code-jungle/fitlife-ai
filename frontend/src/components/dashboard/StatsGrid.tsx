import { Activity, Target, TrendingUp, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";

const StatsGrid = () => {
  const { profile } = useProfile();

  const calculateBMI = (weight: number, height: number) => {
    if (!weight || !height) return null;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: "Abaixo do peso", type: "warning" };
    if (bmi < 25) return { category: "Saudável", type: "positive" };
    if (bmi < 30) return { category: "Sobrepeso", type: "warning" };
    return { category: "Obesidade", type: "negative" };
  };

  const getActivityLevelText = (level: string) => {
    const levels = {
      sedentary: "Sedentário",
      light: "Leve",
      moderate: "Moderado",
      active: "Ativo",
      very_active: "Muito Ativo"
    };
    return levels[level as keyof typeof levels] || "Não definido";
  };

  const bmi = profile?.weight && profile?.height ? calculateBMI(profile.weight, profile.height) : null;
  const bmiInfo = bmi ? getBMICategory(parseFloat(bmi)) : null;

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
      value: profile?.height ? `${(profile.height / 100).toFixed(2)} m` : "Não definido",
      change: null,
      changeType: "neutral" as const,
      icon: Activity,
    },
    {
      title: "IMC",
      value: bmi || "Não calculado",
      change: bmiInfo?.category || null,
      changeType: bmiInfo?.type as "positive" | "negative" | "warning" | "neutral" || "neutral",
      icon: Target,
    },
    {
      title: "Nível de Atividade",
      value: profile?.activity_level ? getActivityLevelText(profile.activity_level) : "Não definido",
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

export default StatsGrid;