import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Utensils, ChefHat, DollarSign, Clock } from "lucide-react";

interface NutritionPreferencesStepProps {
  data: {
    dietaryRestrictions: string[];
    allergies: string[];
    mealFrequency: string;
    cookingSkill: string;
    budget: string;
  };
  updateData: (updates: any) => void;
}

const NutritionPreferencesStep = ({ data, updateData }: NutritionPreferencesStepProps) => {
  const dietaryRestrictionsOptions = [
    { value: "vegetarian", label: "Vegetariano" },
    { value: "vegan", label: "Vegano" },
    { value: "keto", label: "Cetogênica (Keto)" },
    { value: "paleo", label: "Paleo" },
    { value: "mediterranean", label: "Mediterrânea" },
    { value: "low_carb", label: "Baixo carboidrato" },
    { value: "low_fat", label: "Baixo teor de gordura" },
    { value: "intermittent_fasting", label: "Jejum intermitente" },
    { value: "gluten_free", label: "Sem glúten" },
    { value: "dairy_free", label: "Sem lactose" },
    { value: "halal", label: "Halal" },
    { value: "kosher", label: "Kosher" },
  ];

  const allergiesOptions = [
    { value: "nuts", label: "Nozes e castanhas" },
    { value: "peanuts", label: "Amendoim" },
    { value: "dairy", label: "Lactose" },
    { value: "eggs", label: "Ovos" },
    { value: "soy", label: "Soja" },
    { value: "wheat", label: "Trigo" },
    { value: "fish", label: "Peixe" },
    { value: "shellfish", label: "Frutos do mar" },
    { value: "sesame", label: "Gergelim" },
    { value: "sulfites", label: "Sulfitos" },
  ];

  const handleRestrictionChange = (restriction: string, checked: boolean) => {
    if (checked) {
      updateData({ dietaryRestrictions: [...data.dietaryRestrictions, restriction] });
    } else {
      updateData({ dietaryRestrictions: data.dietaryRestrictions.filter(r => r !== restriction) });
    }
  };

  const handleAllergyChange = (allergy: string, checked: boolean) => {
    if (checked) {
      updateData({ allergies: [...data.allergies, allergy] });
    } else {
      updateData({ allergies: data.allergies.filter(a => a !== allergy) });
    }
  };

  return (
    <div className="space-y-6">
      {/* Meal Frequency */}
      <div className="space-y-2">
        <Label className="text-foreground flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Frequência de refeições *
        </Label>
        <Select value={data.mealFrequency} onValueChange={(value) => updateData({ mealFrequency: value })}>
          <SelectTrigger className="glass bg-white/5 border-white/10 text-foreground">
            <SelectValue placeholder="Quantas refeições por dia?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2_meals">2 refeições</SelectItem>
            <SelectItem value="3_meals">3 refeições</SelectItem>
            <SelectItem value="4_meals">4 refeições</SelectItem>
            <SelectItem value="5_meals">5 refeições</SelectItem>
            <SelectItem value="6_meals">6 refeições</SelectItem>
            <SelectItem value="flexible">Flexível</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Cooking Skill */}
      <div className="space-y-2">
        <Label className="text-foreground flex items-center gap-2">
          <ChefHat className="w-4 h-4" />
          Nível de culinária *
        </Label>
        <Select value={data.cookingSkill} onValueChange={(value) => updateData({ cookingSkill: value })}>
          <SelectTrigger className="glass bg-white/5 border-white/10 text-foreground">
            <SelectValue placeholder="Qual seu nível na cozinha?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Iniciante (básico)</SelectItem>
            <SelectItem value="intermediate">Intermediário</SelectItem>
            <SelectItem value="advanced">Avançado</SelectItem>
            <SelectItem value="expert">Expert</SelectItem>
            <SelectItem value="no_cooking">Não cozinho</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Budget */}
      <div className="space-y-2">
        <Label className="text-foreground flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Orçamento mensal para alimentação *
        </Label>
        <Select value={data.budget} onValueChange={(value) => updateData({ budget: value })}>
          <SelectTrigger className="glass bg-white/5 border-white/10 text-foreground">
            <SelectValue placeholder="Qual seu orçamento?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Baixo (até R$ 200)</SelectItem>
            <SelectItem value="medium_low">Médio-baixo (R$ 200-400)</SelectItem>
            <SelectItem value="medium">Médio (R$ 400-600)</SelectItem>
            <SelectItem value="medium_high">Médio-alto (R$ 600-800)</SelectItem>
            <SelectItem value="high">Alto (R$ 800+)</SelectItem>
            <SelectItem value="flexible">Flexível</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dietary Restrictions */}
      <div className="space-y-3">
        <Label className="text-foreground flex items-center gap-2">
          <Utensils className="w-4 h-4" />
          Restrições alimentares
        </Label>
        <p className="text-sm text-muted-foreground">
          Selecione todas as restrições que se aplicam a você
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {dietaryRestrictionsOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={option.value}
                checked={data.dietaryRestrictions.includes(option.value)}
                onCheckedChange={(checked) => handleRestrictionChange(option.value, checked as boolean)}
              />
              <Label
                htmlFor={option.value}
                className="text-sm text-foreground cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Allergies */}
      <div className="space-y-3">
        <Label className="text-foreground">Alergias alimentares</Label>
        <p className="text-sm text-muted-foreground">
          Selecione todas as alergias que você possui
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {allergiesOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`allergy-${option.value}`}
                checked={data.allergies.includes(option.value)}
                onCheckedChange={(checked) => handleAllergyChange(option.value, checked as boolean)}
              />
              <Label
                htmlFor={`allergy-${option.value}`}
                className="text-sm text-foreground cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      {(data.dietaryRestrictions.length > 0 || data.allergies.length > 0) && (
        <Card className="bg-yellow-500/10 border border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="font-medium text-yellow-400">Restrições identificadas</h4>
                <div className="text-sm text-yellow-300 mt-1">
                  {data.dietaryRestrictions.length > 0 && (
                    <p><strong>Dieta:</strong> {data.dietaryRestrictions.join(", ")}</p>
                  )}
                  {data.allergies.length > 0 && (
                    <p><strong>Alergias:</strong> {data.allergies.join(", ")}</p>
                  )}
                </div>
                <p className="text-xs text-yellow-300 mt-2">
                  Nossas sugestões de refeições respeitarão todas essas restrições.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
        <p className="text-sm text-green-400">
          <strong>🍽️ Personalização:</strong> Com base nas suas preferências, criaremos planos alimentares que se adequam ao seu estilo de vida e orçamento.
        </p>
      </div>
    </div>
  );
};

export default NutritionPreferencesStep;
