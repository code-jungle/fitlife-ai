import { Clock, Dumbbell, Trash2, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WorkoutPlan, useWorkouts } from "@/hooks/useWorkouts";
import { useState } from "react";

interface WorkoutCardProps {
  workout: WorkoutPlan;
}

const WorkoutCard = ({ workout }: WorkoutCardProps) => {
  const { deleteWorkout } = useWorkouts();
  const [isDeleting, setIsDeleting] = useState(false);


  const handleDeleteWorkout = async () => {
    setIsDeleting(true);
    try {
      await deleteWorkout(workout.id);
    } finally {
      setIsDeleting(false);
    }
  };


  // Extrair letra do treino (A, B, C) do título
  const getWorkoutLetter = (title: string) => {
    const match = title.match(/treino\s+([a-c])/i);
    return match ? match[1].toUpperCase() : 'A';
  };

  // Obter grupos musculares principais
  const getMainMuscleGroups = () => {
    if (!workout.muscle_groups || workout.muscle_groups.length === 0) {
      return ['Treino Geral'];
    }
    return workout.muscle_groups.slice(0, 2).join(' e ');
  };


  const workoutLetter = getWorkoutLetter(workout.title);
  const mainMuscleGroups = getMainMuscleGroups();

  return (
    <Card className="glass-card border border-white/10 hover-lift group">
      <CardHeader className="pb-3">
        {/* Header com letra do treino e tipo */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">{workoutLetter}</span>
            </div>
            <div>
              <CardTitle className="text-xl font-poppins gradient-text">
                Treino {workoutLetter}
              </CardTitle>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Target className="w-4 h-4" />
                {mainMuscleGroups}
              </p>
            </div>
          </div>
          
          {/* Delete Button */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDeleteWorkout}
            disabled={isDeleting}
            className="btn-destructive hover:bg-red-500/20 hover:border-red-500/50"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Excluindo...
              </>
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Informações básicas */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {workout.duration_minutes || 0} min
          </span>
          <span className="flex items-center gap-1">
            <Dumbbell className="w-4 h-4" />
            {workout.exercises?.length || 0} exercícios
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Lista de exercícios */}
        {workout.exercises && workout.exercises.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Dumbbell className="w-4 h-4" />
              Exercícios
            </h4>
                        <div className="space-y-2">
                          {workout.exercises.map((exercise, index) => (
                            <div 
                              key={exercise.id || index} 
                              className="flex items-center justify-between p-3 rounded-lg border bg-white/5 border-white/10"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">{index + 1}</span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-foreground">
                                    {exercise.name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {exercise.sets} séries de {exercise.reps} repetições
                                  </p>
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {exercise.rest_seconds}s descanso
                              </div>
                            </div>
                          ))}
                        </div>
          </div>
        )}

      </CardContent>
    </Card>
  );
};

export default WorkoutCard;