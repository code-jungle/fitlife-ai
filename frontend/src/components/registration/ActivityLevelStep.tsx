import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Clock, Calendar, Timer } from "lucide-react";

interface ActivityLevelStepProps {
  data: {
    activityLevel: string;
    gymDaysPerWeek: string;
    preferredWorkoutTime: string;
    workoutDuration: string;
  };
  updateData: (updates: any) => void;
}

const ActivityLevelStep = ({ data, updateData }: ActivityLevelStepProps) => {
  const activityLevels = [
    {
      value: "sedentary",
      label: "Sedentário",
      description: "Pouco ou nenhum exercício, trabalho de escritório",
      icon: "🪑"
    },
    {
      value: "light",
      label: "Levemente ativo",
      description: "Exercício leve 1-3 dias/semana",
      icon: "🚶"
    },
    {
      value: "moderate",
      label: "Moderadamente ativo",
      description: "Exercício moderado 3-5 dias/semana",
      icon: "🏃"
    },
    {
      value: "active",
      label: "Muito ativo",
      description: "Exercício intenso 6-7 dias/semana",
      icon: "💪"
    },
    {
      value: "very_active",
      label: "Extremamente ativo",
      description: "Exercício muito intenso, trabalho físico",
      icon: "🔥"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Activity Level */}
      <div className="space-y-3">
        <Label className="text-foreground flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Nível de atividade atual *
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {activityLevels.map((level) => (
            <Card
              key={level.value}
              className={`cursor-pointer transition-all duration-200 ${
                data.activityLevel === level.value
                  ? "bg-primary/20 border-primary/50 ring-2 ring-primary/30"
                  : "bg-white/5 border-white/10 hover:bg-white/10"
              }`}
              onClick={() => updateData({ activityLevel: level.value })}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{level.icon}</span>
                  <div>
                    <h4 className="font-medium text-foreground">{level.label}</h4>
                    <p className="text-sm text-muted-foreground">{level.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Gym Days Per Week */}
      <div className="space-y-2">
        <Label className="text-foreground flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Dias na academia por semana *
        </Label>
        <Select value={data.gymDaysPerWeek} onValueChange={(value) => updateData({ gymDaysPerWeek: value })}>
          <SelectTrigger className="glass bg-white/5 border-white/10 text-foreground">
            <SelectValue placeholder="Quantos dias por semana?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 dia</SelectItem>
            <SelectItem value="2">2 dias</SelectItem>
            <SelectItem value="3">3 dias</SelectItem>
            <SelectItem value="4">4 dias</SelectItem>
            <SelectItem value="5">5 dias</SelectItem>
            <SelectItem value="6">6 dias</SelectItem>
            <SelectItem value="7">7 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Preferred Workout Time */}
      <div className="space-y-2">
        <Label className="text-foreground flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Horário preferido para treinar *
        </Label>
        <Select value={data.preferredWorkoutTime} onValueChange={(value) => updateData({ preferredWorkoutTime: value })}>
          <SelectTrigger className="glass bg-white/5 border-white/10 text-foreground">
            <SelectValue placeholder="Qual horário prefere?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="early_morning">Manhã cedo (5h-7h)</SelectItem>
            <SelectItem value="morning">Manhã (7h-10h)</SelectItem>
            <SelectItem value="late_morning">Manhã tarde (10h-12h)</SelectItem>
            <SelectItem value="afternoon">Tarde (12h-15h)</SelectItem>
            <SelectItem value="late_afternoon">Tarde tarde (15h-18h)</SelectItem>
            <SelectItem value="evening">Noite (18h-21h)</SelectItem>
            <SelectItem value="late_evening">Noite tarde (21h-23h)</SelectItem>
            <SelectItem value="flexible">Flexível</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Workout Duration */}
      <div className="space-y-2">
        <Label className="text-foreground flex items-center gap-2">
          <Timer className="w-4 h-4" />
          Duração preferida do treino *
        </Label>
        <Select value={data.workoutDuration} onValueChange={(value) => updateData({ workoutDuration: value })}>
          <SelectTrigger className="glass bg-white/5 border-white/10 text-foreground">
            <SelectValue placeholder="Quanto tempo por treino?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15_min">15 minutos</SelectItem>
            <SelectItem value="30_min">30 minutos</SelectItem>
            <SelectItem value="45_min">45 minutos</SelectItem>
            <SelectItem value="60_min">1 hora</SelectItem>
            <SelectItem value="75_min">1h 15min</SelectItem>
            <SelectItem value="90_min">1h 30min</SelectItem>
            <SelectItem value="120_min">2 horas</SelectItem>
            <SelectItem value="flexible">Flexível</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Activity Level Info */}
      {data.activityLevel && (
        <Card className="bg-orange-500/10 border border-orange-500/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="font-medium text-orange-400">Seu perfil de atividade</h4>
                <p className="text-sm text-orange-300 mt-1">
                  {(() => {
                    const level = activityLevels.find(l => l.value === data.activityLevel);
                    return level ? `${level.label}: ${level.description}` : '';
                  })()}
                </p>
                <p className="text-xs text-orange-300 mt-2">
                  Isso nos ajuda a calcular suas necessidades calóricas e criar treinos adequados ao seu estilo de vida.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
        <p className="text-sm text-green-400">
          <strong>🏃‍♂️ Personalização:</strong> Com base na sua rotina, criaremos treinos que se encaixam perfeitamente no seu dia a dia.
        </p>
      </div>
    </div>
  );
};

export default ActivityLevelStep;
