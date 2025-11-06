import { TrendingUp, Clock, Target, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkoutPlan } from "@/hooks/useWorkouts";

interface WorkoutStatsProps {
  workouts: WorkoutPlan[];
}

const WorkoutStats = ({ workouts }: WorkoutStatsProps) => {
  const getDifficultyText = (level: number) => {
    if (level <= 1) return "Iniciante";
    if (level <= 2) return "Fácil";
    if (level <= 3) return "Intermediário";
    if (level <= 4) return "Avançado";
    return "Expert";
  };

  const totalWorkouts = workouts.length;
  const totalMinutes = workouts.reduce((sum, workout) => sum + (workout.duration_minutes || 0), 0);
  const avgDuration = totalWorkouts > 0 ? Math.round(totalMinutes / totalWorkouts) : 0;
  
  const difficultyStats = workouts.reduce((acc, workout) => {
    const level = workout.difficulty_level || 1;
    const difficultyText = getDifficultyText(level);
    acc[difficultyText] = (acc[difficultyText] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostCommonDifficulty = Object.entries(difficultyStats)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || "N/A";

  const stats = [
    {
      title: "Total de Treinos",
      value: totalWorkouts.toString(),
      icon: Target,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Tempo Total",
      value: `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m`,
      icon: Clock,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Média por Treino",
      value: `${avgDuration} min`,
      icon: TrendingUp,
      color: "from-orange-500 to-red-500",
    },
    {
      title: "Nível Comum",
      value: mostCommonDifficulty,
      icon: Calendar,
      color: "from-purple-500 to-pink-500",
    },
  ];

  if (totalWorkouts === 0) {
    return null;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {stats.map((stat, index) => (
        <Card key={index} className="glass-card border border-white/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
              <stat.icon className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default WorkoutStats;