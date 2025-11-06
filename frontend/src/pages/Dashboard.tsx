import { Activity, Target, TrendingUp, User, Dumbbell, Apple, AlertCircle, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsGrid from "@/components/dashboard/StatsGrid";
import QuickActions from "@/components/dashboard/QuickActions";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useWorkouts } from "@/hooks/useWorkouts";
import { useNutrition } from "@/hooks/useNutrition";
import { useProfileValidation } from "@/hooks/useProfileValidation";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const { workoutPlans } = useWorkouts();
  const { nutritionPlans } = useNutrition();
  const { isProfileComplete, loading: profileLoading } = useProfileValidation({ redirectOnIncomplete: false });
  const navigate = useNavigate();

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
            Olá, {profile?.full_name || user?.email?.split('@')[0] || 'Usuário'}! 
          </h1>
          <p className="text-muted-foreground text-lg">
            Acompanhe seu progresso e conquiste seus objetivos
          </p>
        </div>

        {/* Profile Incomplete Banner */}
        {!isProfileComplete && (
          <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Complete seu perfil para uma experiência personalizada
                </h3>
                <p className="text-muted-foreground mb-4">
                  Para gerar treinos e planos nutricionais personalizados, precisamos de algumas informações sobre você.
                </p>
                <Button 
                  onClick={() => navigate('/profile-setup')}
                  className="btn-primary"
                >
                  Completar Perfil
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <StatsGrid />
        
        {/* Quick Actions */}
        <QuickActions />


      </main>
    </div>
  );
};

export default Dashboard;