import { useState } from "react";
import { Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StandardHeader from "@/components/StandardHeader";
import WorkoutGenerator from "@/components/workouts/WorkoutGenerator";
import WorkoutCard from "@/components/workouts/WorkoutCard";
import WorkoutStats from "@/components/workouts/WorkoutStats";
import EmptyWorkoutState from "@/components/workouts/EmptyWorkoutState";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useProfile } from "@/hooks/useProfile";
import { useProfileValidation } from "@/hooks/useProfileValidation";
import { geminiService } from "@/services/geminiService";
import { toast } from "@/hooks/use-toast";

const WorkoutPlans = () => {
  const { workoutPlans, loading, createWorkoutPlan, deleteAllWorkouts } = useWorkouts();
  const { profile } = useProfile();
  const { isProfileComplete, loading: profileLoading } = useProfileValidation({ redirectOnIncomplete: false });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeletingAll, setIsDeletingAll] = useState(false);

  // Show loading while checking profile
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Verificando perfil...</p>
        </div>
      </div>
    );
  }


  const handleGenerateWorkout = async () => {
    if (!isProfileComplete) {
      toast({
        title: "Perfil incompleto",
        description: "Complete seu perfil para gerar treinos personalizados",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Verificar se a chave da API do Gemini está configurada
      if (!import.meta.env.VITE_GEMINI_API_KEY) {
        toast({
          title: "Configuração necessária",
          description: "Chave da API do Gemini não configurada. Usando plano padrão.",
          variant: "destructive",
        });
        // Usar geração local como fallback
        const workoutData = generateWorkoutFromProfile(profile);
        const { error } = await createWorkoutPlan(workoutData);
        if (!error) {
                    toast({
                      title: "Sugestão de treino gerada!",
                      description: "Sua nova sugestão de treino foi criada com sucesso",
                    });
        }
        return;
      }

      // Usar Gemini para gerar treinos personalizados
      const geminiWorkouts = await geminiService.generateWorkoutPlan({
        age: profile.age || 25,
        weight: profile.weight || 70,
        height: profile.height || 170,
        gender: profile.gender || 'other',
        activity_level: profile.activity_level || 'moderate',
        fitness_goal: profile.fitness_goal || 'general_fitness',
        gym_days_per_week: profile.gym_days_per_week || 3,
        allergies: profile.allergies || [],
        dietary_restrictions: profile.dietary_restrictions || []
      });

      // Função para converter dificuldade de string para número
      const convertDifficultyToNumber = (difficulty: string | undefined): number => {
        if (!difficulty) return 3; // padrão intermediário
        
        switch (difficulty.toLowerCase()) {
          case 'beginner': return 1;
          case 'intermediate': return 3;
          case 'advanced': return 5;
          default: return 3; // padrão intermediário
        }
      };

      // Converter para o formato do banco de dados - processar múltiplos treinos
      const workoutPlans = await Promise.all(
        geminiWorkouts.map(async (geminiWorkout) => {
          const workoutData = {
            title: geminiWorkout.name,
            description: geminiWorkout.description,
            duration_minutes: geminiWorkout.duration_minutes,
            difficulty_level: convertDifficultyToNumber(geminiWorkout.difficulty_level),
            muscle_groups: geminiWorkout.exercises.flatMap(ex => ex.muscle_groups),
            equipment_needed: [...new Set(geminiWorkout.exercises.map(ex => ex.equipment))],
            ai_generated: true,
            exercises: geminiWorkout.exercises.map((exercise, index) => ({
              name: exercise.name,
              category: "strength" as const,
              instructions: exercise.description,
              sets: exercise.sets,
              reps: typeof exercise.reps === 'string' ? parseInt(exercise.reps.replace(/\D/g, '')) || 10 : exercise.reps,
              rest_seconds: exercise.rest_seconds,
              order_index: index
            }))
          };

          return await createWorkoutPlan(workoutData);
        })
      );

      toast({
        title: "Sugestões de treino geradas!",
        description: `${workoutPlans.length} sugestões de treino foram criadas com sucesso`,
      });
    } catch (error) {
      console.error('Error generating workout:', error);
      toast({
        title: "Erro ao gerar treino",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteAllWorkouts = async () => {
    if (workoutPlans.length === 0) {
      toast({
        title: "Nenhum treino encontrado",
        description: "Não há treinos para excluir",
      });
      return;
    }

    setIsDeletingAll(true);
    try {
      await deleteAllWorkouts();
    } finally {
      setIsDeletingAll(false);
    }
  };

  const generateWorkoutFromProfile = (profile: UserProfile) => {
    const { fitness_goal, activity_level } = profile;
    
    // Determine workout type based on fitness goal
    let workoutType = "Treino A - Funcional";
    let difficulty = 2;
    let duration = 45;
    let muscleGroups = ["Core", "Glúteos"];
    let exercises = [];

    switch (fitness_goal) {
      case "lose_weight":
        workoutType = "Treino A - Cardio e Core";
        difficulty = 3;
        duration = 45;
        muscleGroups = ["Cardio", "Core"];
        exercises = generateCardioExercises();
        break;
      case "gain_muscle":
        workoutType = "Treino A - Peito e Tríceps";
        difficulty = 4;
        duration = 60;
        muscleGroups = ["Peito", "Tríceps"];
        exercises = generateStrengthExercises();
        break;
      case "improve_endurance":
        workoutType = "Treino A - Resistência";
        difficulty = 3;
        duration = 50;
        muscleGroups = ["Cardio", "Pernas"];
        exercises = generateEnduranceExercises();
        break;
      default:
        workoutType = "Treino A - Funcional";
        exercises = generateFunctionalExercises();
    }

    // Adjust difficulty based on activity level
    if (activity_level === "sedentary") {
      difficulty = Math.max(1, difficulty - 1);
      duration = Math.max(30, duration - 10);
    } else if (activity_level === "very_active") {
      difficulty = Math.min(5, difficulty + 1);
      duration = Math.min(75, duration + 15);
    }

    return {
      title: workoutType,
      description: `Treino personalizado baseado no seu objetivo: ${fitness_goal}`,
      duration_minutes: duration,
      difficulty_level: difficulty,
      muscle_groups: muscleGroups,
      equipment_needed: ["Peso corporal", "Halteres"],
      ai_generated: true,
      exercises: exercises
    };
  };

  const generateCardioExercises = () => [
    {
      name: "Burpees",
      category: "cardio" as const,
      instructions: "Execute um agachamento, coloque as mãos no chão, estenda as pernas para trás, faça uma flexão, volte à posição de agachamento e salte para cima.",
      sets: 3,
      reps: 12,
      rest_seconds: 45,
      order_index: 0
    },
    {
      name: "Mountain Climbers",
      category: "cardio" as const,
      instructions: "Em posição de prancha, alterne rapidamente as pernas como se estivesse correndo no lugar.",
      sets: 3,
      duration_seconds: 30,
      rest_seconds: 30,
      order_index: 1
    },
    {
      name: "Jumping Jacks",
      category: "cardio" as const,
      instructions: "Salte abrindo as pernas e levantando os braços acima da cabeça, depois volte à posição inicial.",
      sets: 3,
      reps: 20,
      rest_seconds: 30,
      order_index: 2
    },
    {
      name: "Polichinelo",
      category: "cardio" as const,
      instructions: "Salte abrindo e fechando as pernas enquanto levanta os braços acima da cabeça.",
      sets: 3,
      reps: 15,
      rest_seconds: 30,
      order_index: 3
    },
    {
      name: "High Knees",
      category: "cardio" as const,
      instructions: "Corra no lugar elevando os joelhos até a altura do quadril.",
      sets: 3,
      reps: 18,
      rest_seconds: 30,
      order_index: 4
    },
    {
      name: "Skaters",
      category: "cardio" as const,
      instructions: "Salte lateralmente de um lado para o outro, tocando o chão com a mão oposta.",
      sets: 3,
      reps: 16,
      rest_seconds: 30,
      order_index: 5
    }
  ];

  const generateStrengthExercises = () => [
    {
      name: "Supino Reto com Barra",
      category: "strength" as const,
      instructions: "Deitado no banco, segure a barra com pegada ligeiramente mais larga que os ombros. Desça controladamente até o peito e empurre para cima.",
      sets: 4,
      reps: 10,
      rest_seconds: 90,
      order_index: 0
    },
    {
      name: "Agachamento com Barra",
      category: "strength" as const,
      instructions: "Com a barra nos ombros, desça como se fosse sentar em uma cadeira, mantendo o peito erguido.",
      sets: 4,
      reps: 12,
      rest_seconds: 90,
      order_index: 1
    },
    {
      name: "Puxada na Barra",
      category: "strength" as const,
      instructions: "Segure a barra com pegada mais larga que os ombros e puxe o corpo para cima até o queixo passar da barra.",
      sets: 3,
      reps: 8,
      rest_seconds: 90,
      order_index: 2
    },
    {
      name: "Desenvolvimento com Halteres",
      category: "strength" as const,
      instructions: "Sentado ou em pé, segure halteres na altura dos ombros e empurre para cima até estender os braços.",
      sets: 3,
      reps: 10,
      rest_seconds: 60,
      order_index: 3
    },
    {
      name: "Remada Curvada",
      category: "strength" as const,
      instructions: "Inclinado para frente, puxe a barra em direção ao abdômen, contraindo as costas.",
      sets: 3,
      reps: 10,
      rest_seconds: 60,
      order_index: 4
    },
    {
      name: "Rosca Bíceps",
      category: "strength" as const,
      instructions: "Em pé, segure halteres e flexione os braços, contraindo o bíceps.",
      sets: 3,
      reps: 12,
      rest_seconds: 45,
      order_index: 5
    }
  ];

  const generateEnduranceExercises = () => [
    {
      name: "Corrida no Local",
      category: "cardio" as const,
      instructions: "Corra no lugar elevando bem os joelhos, mantendo um ritmo constante.",
      sets: 3,
      duration_seconds: 60,
      rest_seconds: 30,
      order_index: 0
    },
    {
      name: "Pular Corda",
      category: "cardio" as const,
      instructions: "Pule corda mantendo um ritmo constante, pés juntos e saltos baixos.",
      sets: 3,
      duration_seconds: 45,
      rest_seconds: 30,
      order_index: 1
    },
    {
      name: "Step-ups",
      category: "functional" as const,
      instructions: "Suba e desça de um step ou banco alternando as pernas.",
      sets: 3,
      reps: 18,
      rest_seconds: 30,
      order_index: 2
    },
    {
      name: "Burpees",
      category: "cardio" as const,
      instructions: "Execute um agachamento, coloque as mãos no chão, estenda as pernas para trás, faça uma flexão, volte à posição de agachamento e salte para cima.",
      sets: 3,
      reps: 12,
      rest_seconds: 45,
      order_index: 3
    },
    {
      name: "Mountain Climbers",
      category: "cardio" as const,
      instructions: "Em posição de prancha, alterne rapidamente as pernas como se estivesse correndo no lugar.",
      sets: 3,
      duration_seconds: 45,
      rest_seconds: 30,
      order_index: 4
    },
    {
      name: "Jumping Jacks",
      category: "cardio" as const,
      instructions: "Salte abrindo as pernas e levantando os braços acima da cabeça, depois volte à posição inicial.",
      sets: 3,
      reps: 20,
      rest_seconds: 30,
      order_index: 5
    }
  ];

  const generateFunctionalExercises = () => [
    {
      name: "Prancha",
      category: "functional" as const,
      instructions: "Mantenha o corpo em linha reta, apoiado nos antebraços e pontas dos pés.",
      sets: 3,
      duration_seconds: 30,
      rest_seconds: 45,
      order_index: 0
    },
    {
      name: "Agachamento com Salto",
      category: "functional" as const,
      instructions: "Faça um agachamento e salte para cima, estendendo os braços.",
      sets: 3,
      reps: 15,
      rest_seconds: 45,
      order_index: 1
    },
    {
      name: "Lunges",
      category: "functional" as const,
      instructions: "Dê um passo à frente e desça até o joelho de trás quase tocar o chão.",
      sets: 3,
      reps: 12,
      rest_seconds: 30,
      order_index: 2
    },
    {
      name: "Flexão de Braço",
      category: "functional" as const,
      instructions: "Em posição de prancha, desça o corpo até quase tocar o chão e empurre para cima.",
      sets: 3,
      reps: 12,
      rest_seconds: 45,
      order_index: 3
    },
    {
      name: "Prancha Lateral",
      category: "functional" as const,
      instructions: "Deite de lado, apoie-se no antebraço e mantenha o corpo em linha reta.",
      sets: 3,
      duration_seconds: 20,
      rest_seconds: 30,
      order_index: 4
    },
    {
      name: "Burpees",
      category: "functional" as const,
      instructions: "Execute um agachamento, coloque as mãos no chão, estenda as pernas para trás, faça uma flexão, volte à posição de agachamento e salte para cima.",
      sets: 3,
      reps: 10,
      rest_seconds: 45,
      order_index: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <StandardHeader title="Gerar Treino com IA" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-poppins font-bold gradient-text mb-2">
              Planos de Treino
            </h1>
            <p className="text-muted-foreground text-lg">
              Treinos personalizados criados pela IA
            </p>
          </div>
          
          <Button 
            onClick={handleGenerateWorkout}
            disabled={isGenerating}
            className="btn-primary w-full md:w-auto"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {isGenerating ? "Gerando..." : "Gerar Sugestão de Treino"}
          </Button>
        </div>

        {/* Disclaimer Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 mb-8">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-amber-500 text-sm">⚠️</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Aviso Importante - Sugestões de Treino
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Todos os treinos gerados são <strong>sugestões personalizadas</strong> baseadas em IA e seus dados de perfil. 
                Não somos profissionais qualificados e estes treinos não substituem orientação de educadores físicos ou médicos. 
                Sempre consulte um profissional antes de iniciar qualquer programa de exercícios.
              </p>
            </div>
          </div>
        </div>

        {/* Workout Generator (Loading State) */}
        {isGenerating && <WorkoutGenerator />}

        {/* Workout Stats */}
        <WorkoutStats workouts={workoutPlans} />

        {/* Workout List */}
        <Tabs defaultValue="all" className="mt-8">
         

          {/* Delete All Button */}
          {workoutPlans.length > 0 && (
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteAllWorkouts}
                disabled={isDeletingAll || loading}
                className="btn-destructive hover:bg-red-500/20 hover:border-red-500/50"
              >
                {isDeletingAll ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Excluindo...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Excluir Todos os Treinos
                  </>
                )}
              </Button>
            </div>
          )}

          <TabsContent value="all" className="mt-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : workoutPlans.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {workoutPlans.map((workout) => (
                  <WorkoutCard key={workout.id} workout={workout} />
                ))}
              </div>
            ) : (
              <EmptyWorkoutState onGenerate={handleGenerateWorkout} />
            )}
          </TabsContent>

          <TabsContent value="recent" className="mt-6">
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {workoutPlans
                .slice(0, 3)
                .map((workout) => (
                  <WorkoutCard key={workout.id} workout={workout} />
                ))}
            </div>
            )}
          </TabsContent>

          <TabsContent value="favorites" className="mt-6">
            <EmptyWorkoutState 
              title="Nenhum treino favoritado ainda"
              description="Marque treinos como favoritos para acessá-los rapidamente"
              onGenerate={handleGenerateWorkout}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default WorkoutPlans;