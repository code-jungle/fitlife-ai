import { Utensils, Sparkles, ArrowRight } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

interface EmptyNutritionStateProps {
  title?: string;
  description?: string;
  onGenerate: () => void;
}

const EmptyNutritionState = ({ 
  title = "Nenhum plano alimentar encontrado",
  description = "Crie seu primeiro plano nutricional personalizado com nossa IA",
  onGenerate 
}: EmptyNutritionStateProps) => {
  const features = [
    {
      icon: Sparkles,
      title: "Balanceado",
      description: "Macro e micronutrientes equilibrados",
      gradient: "bg-gradient-to-r from-blue-500 to-cyan-500"
    },
    {
      icon: Utensils,
      title: "Completo",
      description: "Todas as refeições do dia organizadas",
      gradient: "bg-gradient-to-r from-green-500 to-emerald-500"
    },
    {
      icon: ArrowRight,
      title: "Adaptativo",
      description: "Considera suas restrições alimentares",
      gradient: "bg-gradient-primary"
    }
  ];

  return (
    <EmptyState
      icon={Utensils}
      title={title}
      description={description}
      features={features}
      buttonText="Gerar Primeiro Plano"
      onAction={onGenerate}
      iconGradient="bg-gradient-to-r from-green-500 to-emerald-500"
    />
  );
};

export default EmptyNutritionState;