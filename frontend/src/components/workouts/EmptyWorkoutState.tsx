import { Dumbbell, Sparkles, ArrowRight } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

interface EmptyWorkoutStateProps {
  title?: string;
  description?: string;
  onGenerate: () => void;
}

const EmptyWorkoutState = ({ 
  title = "Nenhum treino encontrado",
  description = "Crie seu primeiro treino personalizado com nossa IA",
  onGenerate 
}: EmptyWorkoutStateProps) => {
  const features = [
    {
      icon: Sparkles,
      title: "Personalizado",
      description: "Baseado no seu perfil e objetivos",
      gradient: "bg-gradient-to-r from-blue-500 to-cyan-500"
    },
    {
      icon: Dumbbell,
      title: "Completo",
      description: "Exercícios, séries e tempo de descanso",
      gradient: "bg-gradient-to-r from-green-500 to-emerald-500"
    },
    {
      icon: ArrowRight,
      title: "Progressivo",
      description: "Evolui com seu progresso",
      gradient: "bg-gradient-primary"
    }
  ];

  return (
    <EmptyState
      icon={Dumbbell}
      title={title}
      description={description}
      features={features}
      buttonText="Gerar Primeiro Treino"
      onAction={onGenerate}
      iconGradient="bg-gradient-primary"
    />
  );
};

export default EmptyWorkoutState;