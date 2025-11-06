import { Sparkles, Brain, Target } from "lucide-react";
import Generator from "@/components/ui/Generator";

const WorkoutGenerator = () => {
  const phases = [
    "Analisando seu perfil e objetivos...",
    "Selecionando exercícios personalizados...",
    "Calculando séries, repetições e descanso...",
    "Organizando sequência otimizada...",
    "Finalizando seu treino perfeito!"
  ];

  const motivationalQuotes = [
    "💪 Cada exercício te aproxima do seu objetivo!",
    "🔥 A consistência é a chave do sucesso!",
    "⚡ Seus músculos estão crescendo enquanto você treina!",
    "🎯 Foco no processo, não apenas no resultado!",
    "🚀 Você é mais forte do que imagina!"
  ];

  const features = [
    {
      icon: Target,
      title: "Personalizado",
      gradient: "bg-gradient-to-r from-blue-500 to-cyan-500"
    },
    {
      icon: Brain,
      title: "IA Avançada",
      gradient: "bg-gradient-to-r from-green-500 to-emerald-500"
    },
    {
      icon: Sparkles,
      title: "Otimizado",
      gradient: "bg-gradient-primary"
    }
  ];

  const disclaimer = "Este treino é uma sugestão personalizada gerada por IA com base no seu perfil. Não substitui orientação de profissionais qualificados. Consulte um educador físico ou médico antes de iniciar qualquer programa de exercícios.";

  return (
    <Generator
      title="IA Criando Seu Treino"
      icon={Brain}
      iconGradient="bg-gradient-primary"
      phases={phases}
      tips={motivationalQuotes}
      features={features}
      disclaimer={disclaimer}
      tipGradient="from-orange-500/10 to-pink-500/10"
      tipBorder="border-pink-500/20"
    />
  );
};

export default WorkoutGenerator;