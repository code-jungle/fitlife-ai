import { Plus, Eye, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MealCardActionsProps {
  mealBenefit: string;
  colorScheme: {
    bg: string;
    border: string;
    accent: string;
    button: string;
  };
}

const MealCardActions = ({ mealBenefit, colorScheme }: MealCardActionsProps) => {
  return (
    <>
      {/* Benefício do Plano */}
      <div className={`p-3 rounded-lg bg-gradient-to-r ${colorScheme.bg} border ${colorScheme.border}`}>
        <div className="flex items-start gap-2">
          <Zap className={`w-4 h-4 ${colorScheme.accent} mt-0.5`} />
          <p className="text-sm font-medium text-foreground">
            {mealBenefit}
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Button 
          className={`flex-1 ${colorScheme.button} text-white font-semibold text-xs sm:text-sm py-2 px-3 sm:px-4`}
          size="sm"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden xs:inline">Adicionar ao Meu Plano</span>
          <span className="xs:hidden">Adicionar</span>
        </Button>
        <Button 
          variant="outline" 
          className="flex-1 border-white/20 text-foreground hover:bg-white/10 text-xs sm:text-sm py-2 px-3 sm:px-4"
          size="sm"
        >
          <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden xs:inline">Ver Receita</span>
          <span className="xs:hidden">Ver</span>
        </Button>
      </div>
    </>
  );
};

export default MealCardActions;

