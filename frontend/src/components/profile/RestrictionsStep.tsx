import { AlertCircle, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileStepProps } from "@/types/profile";

interface RestrictionsStepProps extends ProfileStepProps {}

const RestrictionsStep = ({ data, updateData }: RestrictionsStepProps) => {
  const allergies = [
    "Glúten", "Lactose", "Nozes", "Amendoim", "Ovos", 
    "Peixe", "Frutos do mar", "Soja", "Sésamo"
  ];

  const dietaryRestrictions = [
    "Vegetariano", "Vegano", "Sem glúten", "Sem lactose", 
    "Paleo", "Cetogênica", "Low carb", "Halal", "Kosher"
  ];

  const toggleAllergy = (allergy: string) => {
    const currentAllergies = data.allergies || [];
    const updated = currentAllergies.includes(allergy)
      ? currentAllergies.filter((a: string) => a !== allergy)
      : [...currentAllergies, allergy];
    updateData({ ...data, allergies: updated });
  };

  const toggleDietaryRestriction = (restriction: string) => {
    const currentRestrictions = data.dietaryRestrictions || [];
    const updated = currentRestrictions.includes(restriction)
      ? currentRestrictions.filter((r: string) => r !== restriction)
      : [...currentRestrictions, restriction];
    updateData({ ...data, dietaryRestrictions: updated });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Restrições Alimentares
        </h3>
        <p className="text-muted-foreground">
          Opcional: Nos ajude a personalizar sua alimentação (você pode pular esta etapa)
        </p>
      </div>

      {/* Allergies */}
      <Card className="glass-card border border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <AlertCircle className="w-5 h-5 text-red-500" />
            Alergias Alimentares
          </CardTitle>
          <CardDescription>
            Selecione os alimentos que causam reações alérgicas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {allergies.map((allergy) => {
              const isSelected = data.allergies?.includes(allergy);
              return (
                <Button
                  key={allergy}
                  variant="outline"
                  size="sm"
                  className={`${
                    isSelected 
                      ? "bg-red-500/20 border-red-500 text-red-400" 
                      : "btn-secondary"
                  }`}
                  onClick={() => toggleAllergy(allergy)}
                >
                  {isSelected && <Check className="w-4 h-4 mr-1" />}
                  {allergy}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Dietary Restrictions */}
      <Card className="glass-card border border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Check className="w-5 h-5 text-green-500" />
            Preferências Alimentares
          </CardTitle>
          <CardDescription>
            Selecione dietas ou estilos alimentares que você segue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {dietaryRestrictions.map((restriction) => {
              const isSelected = data.dietaryRestrictions?.includes(restriction);
              return (
                <Button
                  key={restriction}
                  variant="outline"
                  size="sm"
                  className={`${
                    isSelected 
                      ? "bg-green-500/20 border-green-500 text-green-400" 
                      : "btn-secondary"
                  }`}
                  onClick={() => toggleDietaryRestriction(restriction)}
                >
                  {isSelected && <Check className="w-4 h-4 mr-1" />}
                  {restriction}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      {(data.allergies?.length > 0 || data.dietaryRestrictions?.length > 0) && (
        <Card className="glass-card border border-white/10">
          <CardHeader>
            <CardTitle className="text-foreground">Resumo das Restrições</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.allergies?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Alergias:</h4>
                <div className="flex flex-wrap gap-1">
                  {data.allergies.map((allergy: string) => (
                    <Badge key={allergy} variant="destructive" className="text-xs">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {data.dietaryRestrictions?.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-foreground mb-2">Preferências:</h4>
                <div className="flex flex-wrap gap-1">
                  {data.dietaryRestrictions.map((restriction: string) => (
                    <Badge key={restriction} variant="secondary" className="text-xs">
                      {restriction}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RestrictionsStep;