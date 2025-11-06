import { Activity, Users, Zap, Target, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProfileStepProps, ActivityLevel } from "@/types/profile";

interface ActivityLevelStepProps extends ProfileStepProps {}

const ActivityLevelStep = ({ data, updateData }: ActivityLevelStepProps) => {
  const activityLevels: Array<{
    id: ActivityLevel;
    title: string;
    description: string;
    details: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
  }> = [
    {
      id: "sedentary",
      title: "Sedentário",
      description: "Pouco ou nenhum exercício",
      details: "Trabalho de escritório, sem atividade física regular",
      icon: Activity,
      color: "from-gray-500 to-gray-600",
    },
    {
      id: "light",
      title: "Levemente Ativo",
      description: "Exercício leve 1-3 dias/semana",
      details: "Caminhadas ocasionais, exercícios leves",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "moderate",
      title: "Moderadamente Ativo", 
      description: "Exercício moderado 3-5 dias/semana",
      details: "Academia regular, corrida, natação",
      icon: Zap,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "very",
      title: "Muito Ativo",
      description: "Exercício intenso 6-7 dias/semana",
      details: "Treinos diários, atleta amador",
      icon: Target,
      color: "from-orange-500 to-red-500",
    },
  ];

  const handleLevelSelect = (levelId: string) => {
    updateData({ ...data, activityLevel: levelId });
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Qual seu nível de atividade física? <span className="text-red-500">*</span>
        </h3>
        <p className="text-muted-foreground">
          Isso nos ajuda a calcular suas necessidades calóricas
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {activityLevels.map((level) => (
          <Card
            key={level.id}
            className={`cursor-pointer transition-all duration-300 border-2 ${
              data.activityLevel === level.id
                ? "border-pink-500 glass-card bg-gradient-to-br from-white/10 to-white/5"
                : "border-white/10 glass-card hover:border-white/20"
            }`}
            onClick={() => handleLevelSelect(level.id)}
          >
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${level.color} flex items-center justify-center`}>
                  <level.icon className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-lg text-foreground">
                  {level.title}
                </CardTitle>
              </div>
              <CardDescription className="text-foreground/80">
                {level.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {level.details}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gym Days per Week */}
      <div className="mt-8 space-y-4">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Quantos dias por semana você vai à academia? <span className="text-red-500">*</span>
          </h3>
          <p className="text-muted-foreground">
            Isso nos ajuda a gerar a quantidade ideal de treinos para você
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gymDays" className="text-foreground">
            Dias na academia por semana
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="gymDays"
              type="number"
              placeholder="3"
              className="pl-10 glass bg-white/5 border-white/10 text-foreground"
              value={data.gymDaysPerWeek || ""}
              onChange={(e) => updateData({ ...data, gymDaysPerWeek: e.target.value })}
              min="1"
              max="7"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Recomendamos entre 3-5 dias por semana para melhores resultados
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActivityLevelStep;