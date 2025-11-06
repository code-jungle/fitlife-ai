import { Utensils } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MealCardIngredientsProps {
  mealFoods?: Array<{
    food_name: string;
    quantity: number;
    unit: string;
    calories_per_unit?: number;
  }>;
  mealSuggestions: Array<{
    name: string;
    quantity: string;
    unit: string;
  }>;
  description?: string;
  colorScheme: {
    accent: string;
  };
}

const MealCardIngredients = ({ 
  mealFoods, 
  mealSuggestions, 
  description, 
  colorScheme 
}: MealCardIngredientsProps) => {
  const hasMealFoods = mealFoods && mealFoods.length > 0;
  const ingredients = hasMealFoods ? mealFoods : mealSuggestions;

  return (
    <div>
      <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <Utensils className={`w-4 h-4 ${colorScheme.accent}`} />
        {hasMealFoods ? 'Ingredientes' : 'Sugestões de Alimentos'}
      </h4>
      <div className="space-y-2">
        {ingredients.slice(0, 4).map((item, index) => (
          <div key={index} className="flex justify-between items-center p-2 rounded-lg bg-white/5 border border-white/10">
            <span className="text-sm text-foreground font-medium">
              {hasMealFoods ? item.food_name : item.name}
            </span>
            <Badge variant="secondary" className="text-xs font-semibold px-2 py-1">
              {hasMealFoods ? `${item.quantity} ${item.unit}` : `${item.quantity} ${item.unit}`}
            </Badge>
          </div>
        ))}
      </div>
      {!hasMealFoods && description && (
        <div className="mt-3 p-2 rounded-lg bg-white/5 border border-white/10">
          <p className="text-xs text-muted-foreground">
            💡 {description}
          </p>
        </div>
      )}
    </div>
  );
};

export default MealCardIngredients;

