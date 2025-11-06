import { Card, CardContent } from "@/components/ui/card";
import { useMealCard, MealData } from "@/hooks/useMealCard";
import MealCardHeader from "./MealCardHeader";
import MealCardNutrition from "./MealCardNutrition";
import MealCardIngredients from "./MealCardIngredients";
import MealCardActions from "./MealCardActions";

interface MealCardProps {
  meal: MealData;
}

const MealCard = ({ meal }: MealCardProps) => {
  const {
    mealSuggestions,
    mealIcon,
    mealTypeName,
    suggestedTime,
    colorScheme,
    mealBenefit
  } = useMealCard(meal);

  return (
    <Card className={`glass-card border ${colorScheme.border} h-full hover-lift group overflow-hidden`}>
      <MealCardHeader
        mealIcon={mealIcon}
        mealTypeName={mealTypeName}
        suggestedTime={suggestedTime}
        colorScheme={colorScheme}
      />

      <CardContent className="p-4 space-y-4">
        <MealCardNutrition
          calories={meal.calories}
          protein={meal.protein}
          carbs={meal.carbs}
          fat={meal.fat}
          colorScheme={colorScheme}
        />

        <MealCardIngredients
          mealFoods={meal.meal_foods}
          mealSuggestions={mealSuggestions}
          description={meal.description}
          colorScheme={colorScheme}
        />

        <MealCardActions
          mealBenefit={mealBenefit}
          colorScheme={colorScheme}
        />
      </CardContent>
    </Card>
  );
};

export default MealCard;