import { TrendingDown, TrendingUp, Target, Weight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileStepProps, FitnessGoal } from "@/types/profile";

interface GoalsStepProps extends ProfileStepProps {}

const GoalsStep = ({ data, updateData }: GoalsStepProps) => {
  const goals = [
    {
      id: "lose_weight",
      title: "Perder Peso",
      description: "Reduzir gordura corporal e emagrecer",
      icon: TrendingDown,
      color: "from-red-500 to-pink-500",
    },
    {
      id: "gain_weight",
      title: "Ganhar Peso",
      description: "Aumentar massa muscular e peso",
      icon: TrendingUp,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: "maintain",
      title: "Manter Peso",
      description: "Manter peso atual e melhorar composição corporal",
      icon: Target,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: "build_muscle",
      title: "Ganhar Músculo",
      description: "Foco em hipertrofia e definição muscular",
      icon: Weight,
      color: "from-orange-500 to-red-500",
    },
  ];

  const handleGoalSelect = (goalId: string) => {
    updateData({ ...data, goal: goalId });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Qual é seu objetivo principal? <span className="text-red-500">*</span>
        </h3>
        <p className="text-muted-foreground">
          Isso define o tipo de treino e dieta que vamos recomendar
        </p>
      </div>

      {/* Goal Selection */}
      <div className="grid gap-4 md:grid-cols-2">
        {goals.map((goal) => (
          <Card
            key={goal.id}
            className={`cursor-pointer transition-all duration-300 border-2 ${
              data.goal === goal.id
                ? "border-pink-500 glass-card bg-gradient-to-br from-white/10 to-white/5"
                : "border-white/10 glass-card hover:border-white/20"
            }`}
            onClick={() => handleGoalSelect(goal.id)}
          >
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${goal.color} flex items-center justify-center`}>
                  <goal.icon className="w-5 h-5 text-white" />
                </div>
                <CardTitle className="text-lg text-foreground">
                  {goal.title}
                </CardTitle>
              </div>
              <CardDescription className="text-foreground/80">
                {goal.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Target Weight (if applicable) */}
      {(data.goal === "lose_weight" || data.goal === "gain_weight") && (
        <div className="space-y-2">
          <Label htmlFor="targetWeight" className="text-foreground">
            Peso Meta (kg)
          </Label>
          <div className="relative">
            <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              id="targetWeight"
              type="number"
              placeholder="65"
              className="pl-10 glass bg-white/5 border-white/10 text-foreground"
              value={data.targetWeight}
              onChange={(e) => updateData({ ...data, targetWeight: e.target.value })}
              min="30"
              max="200"
              step="0.1"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsStep;