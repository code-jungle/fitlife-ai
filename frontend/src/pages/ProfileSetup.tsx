import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import PersonalInfoStep from "@/components/profile/PersonalInfoStep";
import ActivityLevelStep from "@/components/profile/ActivityLevelStep";
import GoalsStep from "@/components/profile/GoalsStep";
import RestrictionsStep from "@/components/profile/RestrictionsStep";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useProfileValidation } from "@/hooks/useProfileValidation";
import { toast } from "@/hooks/use-toast";

const steps = [
  { id: 1, title: "Informações Pessoais", description: "Dados físicos básicos" },
  { id: 2, title: "Nível de Atividade", description: "Frequência de exercícios" },
  { id: 3, title: "Objetivos", description: "Suas metas fitness" },
  { id: 4, title: "Restrições", description: "Limitações alimentares" },
];

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, updateProfile, loading } = useProfile();
  const { isProfileComplete } = useProfileValidation({ skipValidation: true });
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState({
    // Personal Info
    age: "",
    gender: "",
    height: "",
    weight: "",
    // Activity Level
    activityLevel: "",
    gymDaysPerWeek: "",
    // Goals
    goal: "",
    targetWeight: "",
    // Restrictions
    allergies: [] as string[],
    dietaryRestrictions: [] as string[],
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // If profile is already complete, redirect to dashboard
    if (profile && isProfileComplete(profile)) {
      navigate('/dashboard');
      return;
    }

    // Load existing profile data if available
    if (profile) {
      setProfileData({
        age: profile.age?.toString() || "",
        gender: profile.gender || "",
        height: profile.height?.toString() || "",
        weight: profile.weight?.toString() || "",
        activityLevel: profile.activity_level || "",
        goal: profile.fitness_goal || "",
        targetWeight: "", // This is a form field, not stored directly
        allergies: profile.allergies || [],
        dietaryRestrictions: profile.dietary_restrictions || [],
      });
    }
  }, [user, profile, navigate, isProfileComplete]);

  const progress = (currentStep / steps.length) * 100;

  // Show loading while profile is being fetched
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/70">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  const validateStep = (step: number): { isValid: boolean; message?: string } => {
    switch (step) {
      case 1: // Personal Info
        if (!profileData.age || !profileData.gender || !profileData.height || !profileData.weight) {
          return { isValid: false, message: "Todos os campos da etapa 1 são obrigatórios" };
        }
        if (parseInt(profileData.age) < 13 || parseInt(profileData.age) > 120) {
          return { isValid: false, message: "Idade deve estar entre 13 e 120 anos" };
        }
        if (parseFloat(profileData.height) < 100 || parseFloat(profileData.height) > 250) {
          return { isValid: false, message: "Altura deve estar entre 100 e 250 cm" };
        }
        if (parseFloat(profileData.weight) < 30 || parseFloat(profileData.weight) > 300) {
          return { isValid: false, message: "Peso deve estar entre 30 e 300 kg" };
        }
        return { isValid: true };
      
      case 2: // Activity Level
        if (!profileData.activityLevel) {
          return { isValid: false, message: "Nível de atividade é obrigatório" };
        }
        if (!profileData.gymDaysPerWeek || parseInt(profileData.gymDaysPerWeek) < 1 || parseInt(profileData.gymDaysPerWeek) > 7) {
          return { isValid: false, message: "Dias na academia deve estar entre 1 e 7" };
        }
        return { isValid: true };
      
      case 3: // Goals
        if (!profileData.goal) {
          return { isValid: false, message: "Objetivo fitness é obrigatório" };
        }
        return { isValid: true };
      
      case 4: // Restrictions (optional)
        return { isValid: true };
      
      default:
        return { isValid: true };
    }
  };

  const handleNext = async () => {
    // Validate current step before proceeding
    const validation = validateStep(currentStep);
    if (!validation.isValid) {
      toast({
        title: "Campos obrigatórios",
        description: validation.message,
        variant: "destructive",
      });
      return;
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save profile and redirect
      const profileUpdate = {
        age: parseInt(profileData.age) || undefined,
        gender: profileData.gender as 'male' | 'female' | 'other' || undefined,
        height: parseFloat(profileData.height) || undefined,
        weight: parseFloat(profileData.weight) || undefined,
        activity_level: profileData.activityLevel as any || undefined,
        gym_days_per_week: parseInt(profileData.gymDaysPerWeek) || undefined,
        fitness_goal: profileData.goal as any || undefined,
        allergies: profileData.allergies,
        dietary_restrictions: profileData.dietaryRestrictions,
      };

      // Remove undefined values
      Object.keys(profileUpdate).forEach(key => {
        if (profileUpdate[key as keyof typeof profileUpdate] === undefined) {
          delete profileUpdate[key as keyof typeof profileUpdate];
        }
      });

      const { error } = await updateProfile(profileUpdate);
      
      if (!error) {
        navigate("/dashboard");
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep 
            data={profileData} 
            updateData={setProfileData} 
          />
        );
      case 2:
        return (
          <ActivityLevelStep 
            data={profileData} 
            updateData={setProfileData} 
          />
        );
      case 3:
        return (
          <GoalsStep 
            data={profileData} 
            updateData={setProfileData} 
          />
        );
      case 4:
        return (
          <RestrictionsStep 
            data={profileData} 
            updateData={setProfileData} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-poppins font-bold gradient-text mb-2">
            Configurar Perfil
          </h1>
          <p className="text-muted-foreground">
            Personalize sua experiência fitness
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-muted-foreground">
              Etapa {currentStep} de {steps.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% concluído
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Card */}
        <Card className="glass-card border border-white/10 mb-8">
          <CardHeader>
            <CardTitle className="text-2xl font-poppins text-foreground">
              {steps[currentStep - 1].title}
            </CardTitle>
            <p className="text-muted-foreground">
              {steps[currentStep - 1].description}
            </p>
          </CardHeader>
          
          <CardContent>
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="btn-secondary"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>
          
          <Button
            onClick={handleNext}
            className="btn-primary"
            disabled={loading || !validateStep(currentStep).isValid}
          >
            {loading ? "Salvando..." : currentStep === steps.length ? "Finalizar" : "Próximo"}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;