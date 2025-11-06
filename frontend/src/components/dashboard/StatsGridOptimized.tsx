import React, { memo, useMemo } from 'react';
import { Activity, Target, TrendingUp, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProfile } from "@/hooks/useProfile";

// ✅ OTIMIZADO: React.memo para evitar re-renderizações desnecessárias
const StatsGridOptimized = memo(() => {
  const { profile } = useProfile();

  // ✅ OTIMIZADO: useMemo para cálculos pesados
  const bmi = useMemo(() => {
    if (!profile?.weight || !profile?.height) return null;
    const heightInMeters = profile.height / 100;
    return (profile.weight / (heightInMeters * heightInMeters)).toFixed(1);
  }, [profile?.weight, profile?.height]);

  const bmiInfo = useMemo(() => {
    if (!bmi) return null;
    const bmiValue = parseFloat(bmi);
    
    if (bmiValue < 18.5) return { category: "Abaixo do peso", type: "warning" };
    if (bmiValue < 25) return { category: "Saudável", type: "positive" };
    if (bmiValue < 30) return { category: "Sobrepeso", type: "warning" };
    return { category: "Obesidade", type: "negative" };
  }, [bmi]);

  const activityLevelText = useMemo(() => {
    if (!profile?.activity_level) return "Não definido";
    
    const levels = {
      sedentary: "Sedentário",
      light: "Leve",
      moderate: "Moderado",
      active: "Ativo",
      very_active: "Muito Ativo"
    };
    return levels[profile.activity_level as keyof typeof levels] || "Não definido";
  }, [profile?.activity_level]);

  const heightInMeters = useMemo(() => {
    if (!profile?.height) return "Não definido";
    return (profile.height / 100).toFixed(2);
  }, [profile?.height]);

  // ✅ OTIMIZADO: useMemo para array de stats
  const stats = useMemo(() => [
    {
      title: "Peso Atual",
      value: profile?.weight ? `${profile.weight} kg` : "Não definido",
      change: null,
      changeType: "neutral" as const,
      icon: User,
    },
    {
      title: "Altura",
      value: profile?.height ? `${heightInMeters} m` : "Não definido",
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
      value: activityLevelText,
      change: null,
      changeType: "neutral" as const,
      icon: TrendingUp,
    },
  ], [profile?.weight, profile?.height, heightInMeters, bmi, bmiInfo, activityLevelText]);

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
});

// ✅ OTIMIZADO: displayName para debugging
StatsGridOptimized.displayName = 'StatsGridOptimized';

export default StatsGridOptimized;

