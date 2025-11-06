import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Calendar, Trophy, Weight } from "lucide-react";

interface FitnessGoalsStepProps {
  data: {
    primaryGoal: string;
    secondaryGoals: string[];
    targetWeight: string;
    timeline: string;
    experience: string;
  };
  updateData: (updates: any) => void;
}

const FitnessGoalsStep = ({ data, updateData }: FitnessGoalsStepProps) => {
  const secondaryGoalsOptions = [
    { value: "muscle_gain", label: "Ganhar massa muscular" },
    { value: "weight_loss", label: "Perder peso" },
    { value: "endurance", label: "Melhorar resistência" },
    { value: "strength", label: "Aumentar força" },
    { value: "flexibility", label: "Melhorar flexibilidade" },
    { value: "balance", label: "Melhorar equilíbrio" },
    { value: "sport_performance", label: "Performance esportiva" },
    { value: "general_health", label: "Saúde geral" },
  ];

  const handleSecondaryGoalChange = (goal: string, checked: boolean) => {
    if (checked) {
      updateData({ secondaryGoals: [...data.secondaryGoals, goal] });
    } else {
      updateData({ secondaryGoals: data.secondaryGoals.filter(g => g !== goal) });
    }
  };

  return (
    <div className="space-y-6">
      {/* Primary Goal */}
      <div className="space-y-2">
        <Label className="text-foreground flex items-center gap-2">
          <Target className="w-4 h-4" />
          Objetivo principal *
        </Label>
        <Select value={data.primaryGoal} onValueChange={(value) => updateData({ primaryGoal: value })}>
          <SelectTrigger className="glass bg-white/5 border-white/10 text-foreground">
            <SelectValue placeholder="Qual é seu principal objetivo?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="lose_weight">Perder peso</SelectItem>
            <SelectItem value="gain_muscle">Ganhar massa muscular</SelectItem>
            <SelectItem value="maintain_weight">Manter peso atual</SelectItem>
            <SelectItem value="improve_endurance">Melhorar resistência</SelectItem>
            <SelectItem value="general_fitness">Fitness geral</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Target Weight */}
      <div className="space-y-2">
        <Label htmlFor="targetWeight" className="text-foreground flex items-center gap-2">
          <Weight className="w-4 h-4" />
          Peso alvo (kg)
        </Label>
        <Input
          id="targetWeight"
          type="number"
          placeholder="65"
          min="30"
          max="300"
          step="0.1"
          className="glass bg-white/5 border-white/10 text-foreground"
          value={data.targetWeight}
          onChange={(e) => updateData({ targetWeight: e.target.value })}
        />
        <p className="text-xs text-muted-foreground">
          Deixe em branco se não tiver um peso específico em mente
        </p>
      </div>

      {/* Timeline */}
      <div className="space-y-2">
        <Label className="text-foreground flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Prazo para atingir o objetivo *
        </Label>
        <Select value={data.timeline} onValueChange={(value) => updateData({ timeline: value })}>
          <SelectTrigger className="glass bg-white/5 border-white/10 text-foreground">
            <SelectValue placeholder="Em quanto tempo?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1_month">1 mês</SelectItem>
            <SelectItem value="3_months">3 meses</SelectItem>
            <SelectItem value="6_months">6 meses</SelectItem>
            <SelectItem value="1_year">1 ano</SelectItem>
            <SelectItem value="long_term">Longo prazo (1+ anos)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Experience Level */}
      <div className="space-y-2">
        <Label className="text-foreground flex items-center gap-2">
          <Trophy className="w-4 h-4" />
          Nível de experiência *
        </Label>
        <Select value={data.experience} onValueChange={(value) => updateData({ experience: value })}>
          <SelectTrigger className="glass bg-white/5 border-white/10 text-foreground">
            <SelectValue placeholder="Qual seu nível atual?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beginner">Iniciante (0-6 meses)</SelectItem>
            <SelectItem value="intermediate">Intermediário (6 meses - 2 anos)</SelectItem>
            <SelectItem value="advanced">Avançado (2+ anos)</SelectItem>
            <SelectItem value="expert">Expert (5+ anos)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Secondary Goals */}
      <div className="space-y-3">
        <Label className="text-foreground">Objetivos secundários (opcional)</Label>
        <p className="text-sm text-muted-foreground">
          Selecione outros objetivos que gostaria de trabalhar
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {secondaryGoalsOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={option.value}
                checked={data.secondaryGoals.includes(option.value)}
                onCheckedChange={(checked) => handleSecondaryGoalChange(option.value, checked as boolean)}
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

      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
        <p className="text-sm text-purple-400">
          <strong>🎯 Personalização:</strong> Com base nos seus objetivos, criaremos treinos e dietas específicos para maximizar seus resultados.
        </p>
      </div>
    </div>
  );
};

export default FitnessGoalsStep;
