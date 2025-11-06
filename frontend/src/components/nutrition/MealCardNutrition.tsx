import { Activity } from "lucide-react";

interface MealCardNutritionProps {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  colorScheme: {
    accent: string;
  };
}

const MealCardNutrition = ({ 
  calories, 
  protein, 
  carbs, 
  fat, 
  colorScheme 
}: MealCardNutritionProps) => {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <Activity className={`w-4 h-4 ${colorScheme.accent}`} />
        Resumo Nutricional
      </h4>
      <div className="grid grid-cols-2 gap-3">
        {calories && (
          <div className="text-center p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <div className="text-lg font-bold text-orange-500">{calories}</div>
            <div className="text-xs text-muted-foreground">kcal</div>
          </div>
        )}
        {protein && (
          <div className="text-center p-2 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="text-lg font-bold text-red-500">{protein}g</div>
            <div className="text-xs text-muted-foreground">proteína</div>
          </div>
        )}
        {carbs && (
          <div className="text-center p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="text-lg font-bold text-blue-500">{carbs}g</div>
            <div className="text-xs text-muted-foreground">carboidratos</div>
          </div>
        )}
        {fat && (
          <div className="text-center p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <div className="text-lg font-bold text-yellow-500">{fat}g</div>
            <div className="text-xs text-muted-foreground">gorduras</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealCardNutrition;

