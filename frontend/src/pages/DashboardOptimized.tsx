import React, { memo, useCallback, useMemo } from 'react';
import { Activity, Target, TrendingUp, User, Dumbbell, Apple, AlertCircle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsGridOptimized from "@/components/dashboard/StatsGridOptimized";
import QuickActions from "@/components/dashboard/QuickActions";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useNutrition } from "@/hooks/useNutrition";
import { useProfileValidation } from "@/hooks/useProfileValidation";
import { useNavigate } from "react-router-dom";

// ✅ OTIMIZADO: React.memo para evitar re-renderizações desnecessárias
const DashboardOptimized = memo(() => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { workoutPlans } = useWorkouts();
  const { nutritionPlans } = useNutrition();
  const { isProfileComplete, loading: profileLoading } = useProfileValidation({ redirectOnIncomplete: false });
  const navigate = useNavigate();

  // ✅ OTIMIZADO: useCallback para funções de navegação
  const handleNavigate = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  const handleGenerateWorkout = useCallback(() => {
    navigate('/workouts');
  }, [navigate]);

  const handleGenerateNutrition = useCallback(() => {
    navigate('/nutrition');
  }, [navigate]);

  const handleViewGoals = useCallback(() => {
    navigate('/goals');
  }, [navigate]);

  const handleViewProfile = useCallback(() => {
    navigate('/profile');
  }, [navigate]);

  // ✅ OTIMIZADO: useMemo para cálculos pesados
  const userName = useMemo(() => {
    return profile?.full_name || user?.email?.split('@')[0] || 'Usuário';
  }, [profile?.full_name, user?.email]);

  const workoutStats = useMemo(() => {
    const totalWorkouts = workoutPlans?.length || 0;
    const completedWorkouts = workoutPlans?.filter(workout => workout.completed_at)?.length || 0;
    const inProgressWorkouts = workoutPlans?.filter(workout => workout.started_at && !workout.completed_at)?.length || 0;
    
    return {
      total: totalWorkouts,
      completed: completedWorkouts,
      inProgress: inProgressWorkouts,
      completionRate: totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0
    };
  }, [workoutPlans]);

  const nutritionStats = useMemo(() => {
    const totalPlans = nutritionPlans?.length || 0;
    const completedPlans = nutritionPlans?.filter(plan => plan.completed_at)?.length || 0;
    const inProgressPlans = nutritionPlans?.filter(plan => plan.started_at && !plan.completed_at)?.length || 0;
    
    return {
      total: totalPlans,
      completed: completedPlans,
      inProgress: inProgressPlans,
      completionRate: totalPlans > 0 ? Math.round((completedPlans / totalPlans) * 100) : 0
    };
  }, [nutritionPlans]);

  const quickActions = useMemo(() => [
    {
      title: "Gerar Treino",
      description: "Crie um treino personalizado com IA",
      icon: Dumbbell,
      onClick: handleGenerateWorkout,
      color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
    },
    {
      title: "Plano Nutricional",
      description: "Receba sugestões de refeições",
      icon: Apple,
      onClick: handleGenerateNutrition,
      color: "bg-green-500/10 text-green-500 border-green-500/20"
    },
    {
      title: "Metas",
      description: "Acompanhe seus objetivos",
      icon: Target,
      onClick: handleViewGoals,
      color: "bg-purple-500/10 text-purple-500 border-purple-500/20"
    },
    {
      title: "Perfil",
      description: "Gerencie suas informações",
      icon: User,
      onClick: handleViewProfile,
      color: "bg-orange-500/10 text-orange-500 border-orange-500/20"
    }
  ], [handleGenerateWorkout, handleGenerateNutrition, handleViewGoals, handleViewProfile]);

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

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-poppins font-bold gradient-text mb-2">
            Olá, {userName}! 
          </h1>
          <p className="text-muted-foreground text-lg">
            Acompanhe seu progresso e conquiste seus objetivos
          </p>
        </div>

        {/* Stats Grid */}
        <StatsGridOptimized />

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-poppins font-semibold text-foreground mb-6">
            Ações Rápidas
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {quickActions.map((action, index) => (
              <Card key={index} className="glass-card border border-white/10 hover-lift group cursor-pointer" onClick={action.onClick}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <CardTitle className="text-lg font-poppins text-foreground">
                      {action.title}
                    </CardTitle>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {action.description}
                  </p>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button variant="ghost" size="sm" className="w-full group-hover:bg-primary/10">
                    Acessar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Workout Progress */}
          <Card className="glass-card border border-white/10">
            <CardHeader>
              <CardTitle className="text-xl font-poppins text-foreground flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-blue-500" />
                Progresso dos Treinos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Treinos Concluídos</span>
                  <span className="text-lg font-semibold text-foreground">
                    {workoutStats.completed}/{workoutStats.total}
                  </span>
                </div>
                <div className="w-full bg-muted/20 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${workoutStats.completionRate}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {workoutStats.completionRate}% de conclusão
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Nutrition Progress */}
          <Card className="glass-card border border-white/10">
            <CardHeader>
              <CardTitle className="text-xl font-poppins text-foreground flex items-center gap-2">
                <Apple className="w-5 h-5 text-green-500" />
                Progresso Nutricional
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Planos Concluídos</span>
                  <span className="text-lg font-semibold text-foreground">
                    {nutritionStats.completed}/{nutritionStats.total}
                  </span>
                </div>
                <div className="w-full bg-muted/20 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${nutritionStats.completionRate}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {nutritionStats.completionRate}% de conclusão
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Completion Alert */}
        {!isProfileComplete && (
          <Card className="glass-card border border-yellow-500/20 bg-yellow-500/5 mt-8">
            <CardHeader>
              <CardTitle className="text-xl font-poppins text-yellow-500 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Complete seu perfil
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Para receber recomendações personalizadas, complete seu perfil com suas informações básicas.
              </p>
              <Button 
                onClick={() => handleNavigate('/profile-setup')}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                Completar Perfil
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
});

// ✅ OTIMIZADO: displayName para debugging
DashboardOptimized.displayName = 'DashboardOptimized';

export default DashboardOptimized;

