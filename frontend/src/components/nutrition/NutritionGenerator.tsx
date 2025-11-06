import { Sparkles, Brain, Utensils } from "lucide-react";
import Generator from "@/components/ui/Generator";

const NutritionGenerator = () => {
  const phases = [
    "Analisando suas necessidades nutricionais...",
    "Calculando suas calorias ideais...",
    "Selecionando alimentos balanceados...",
    "Organizando refeições otimizadas...",
    "Finalizando seu plano alimentar perfeito!"
  ];

  const nutritionTips = [
    "🥗 Uma alimentação equilibrada é 70% do seu sucesso!",
    "💧 Hidrate-se bem durante todo o dia!",
    "⏰ Horários regulares ajudam no metabolismo!",
    "🍎 Alimentos naturais são sempre a melhor escolha!",
    "⚖️ O equilíbrio é mais importante que a perfeição!"
  ];

  const features = [
    {
      icon: Utensils,
      title: "Balanceado",
      gradient: "bg-gradient-to-r from-blue-500 to-cyan-500"
    },
    {
      icon: Brain,
      title: "IA Nutricional",
      gradient: "bg-gradient-to-r from-green-500 to-emerald-500"
    },
    {
      icon: Sparkles,
      title: "Personalizado",
      gradient: "bg-gradient-primary"
    }
  ];

  const disclaimer = "Este plano nutricional é uma sugestão personalizada gerada por IA com base no seu perfil. Não substitui orientação de profissionais qualificados. Consulte um nutricionista ou médico antes de seguir qualquer plano alimentar.";

  return (
    <Generator
      title="IA Criando Seu Plano Alimentar"
      icon={Brain}
      iconGradient="bg-gradient-to-r from-green-500 to-emerald-500"
      phases={phases}
      tips={nutritionTips}
      features={features}
      disclaimer={disclaimer}
      tipGradient="from-green-500/10 to-emerald-500/10"
      tipBorder="border-emerald-500/20"
    />
  );
};

export default NutritionGenerator;