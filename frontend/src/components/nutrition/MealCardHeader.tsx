import { Clock } from "lucide-react";
import { CardTitle } from "@/components/ui/card";

interface MealCardHeaderProps {
  mealIcon: string;
  mealTypeName: string;
  suggestedTime: string;
  colorScheme: {
    bg: string;
    border: string;
    icon: string;
  };
}

const MealCardHeader = ({ 
  mealIcon, 
  mealTypeName, 
  suggestedTime, 
  colorScheme 
}: MealCardHeaderProps) => {
  return (
    <div className={`bg-gradient-to-r ${colorScheme.bg} p-4 border-b ${colorScheme.border}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${colorScheme.icon} rounded-xl flex items-center justify-center shadow-lg`}>
            <span className="text-2xl">{mealIcon}</span>
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-foreground">
              {mealTypeName}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{suggestedTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealCardHeader;

