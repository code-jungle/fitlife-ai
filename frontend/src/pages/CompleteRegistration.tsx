import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Dumbbell, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "@/hooks/use-toast";

// Componentes de etapas
import AccountStep from "@/components/registration/AccountStep";
import PersonalInfoStep from "@/components/registration/PersonalInfoStep";
import FitnessGoalsStep from "@/components/registration/FitnessGoalsStep";
import ActivityLevelStep from "@/components/registration/ActivityLevelStep";
import NutritionPreferencesStep from "@/components/registration/NutritionPreferencesStep";
import HealthInfoStep from "@/components/registration/HealthInfoStep";

const steps = [
  { id: 1, title: "Criar Conta", description: "Email e senha" },
  { id: 2, title: "Dados Pessoais", description: "Informações básicas" },
  { id: 3, title: "Objetivos Fitness", description: "Suas metas e preferências" },
  { id: 4, title: "Nível de Atividade", description: "Frequência de exercícios" },
  { id: 5, title: "Preferências Alimentares", description: "Dieta e restrições" },
  { id: 6, title: "Informações de Saúde", description: "Histórico e condições" },
];

interface RegistrationData {
  // Account data
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  
  // Personal info
  age: string;
  gender: string;
  height: string;
  weight: string;
  phone: string;
  
  // Fitness goals
  primaryGoal: string;
  secondaryGoals: string[];
  targetWeight: string;
  timeline: string;
  experience: string;
  
  // Activity level
  activityLevel: string;
  gymDaysPerWeek: string;
  preferredWorkoutTime: string;
  workoutDuration: string;
  
  // Nutrition preferences
  dietaryRestrictions: string[];
  allergies: string[];
  mealFrequency: string;
  cookingSkill: string;
  budget: string;
  
  // Health info
  medicalConditions: string[];
  medications: string[];
  injuries: string[];
  sleepHours: string;
  stressLevel: string;
}

const CompleteRegistration = () => {
  const navigate = useNavigate();
  const { signUp, loading } = useAuth();
  const { updateProfile } = useProfile();
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    // Account data
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    
    // Personal info
    age: "",
    gender: "",
    height: "",
    weight: "",
    phone: "",
    
    // Fitness goals
    primaryGoal: "",
    secondaryGoals: [],
    targetWeight: "",
    timeline: "",
    experience: "",
    
    // Activity level
    activityLevel: "",
    gymDaysPerWeek: "",
    preferredWorkoutTime: "",
    workoutDuration: "",
    
    // Nutrition preferences
    dietaryRestrictions: [],
    allergies: [],
    mealFrequency: "",
    cookingSkill: "",
    budget: "",
    
    // Health info
    medicalConditions: [],
    medications: [],
    injuries: [],
    sleepHours: "",
    stressLevel: "",
  });

  const progress = (currentStep / steps.length) * 100;

  const updateData = (updates: Partial<RegistrationData>) => {
    setRegistrationData(prev => ({ ...prev, ...updates }));
  };

  const validateStep = (step: number): { isValid: boolean; message?: string } => {
    switch (step) {
      case 1: // Account
        if (!registrationData.name || !registrationData.email || !registrationData.password || !registrationData.confirmPassword) {
          return { isValid: false, message: "Todos os campos são obrigatórios" };
        }
        if (registrationData.password !== registrationData.confirmPassword) {
          return { isValid: false, message: "As senhas não coincidem" };
        }
        if (registrationData.password.length < 8) {
          return { isValid: false, message: "A senha deve ter pelo menos 8 caracteres" };
        }
        return { isValid: true };
      
      case 2: // Personal Info
        if (!registrationData.age || !registrationData.gender || !registrationData.height || !registrationData.weight) {
          return { isValid: false, message: "Todos os campos são obrigatórios" };
        }
        if (parseInt(registrationData.age) < 13 || parseInt(registrationData.age) > 120) {
          return { isValid: false, message: "Idade deve estar entre 13 e 120 anos" };
        }
        if (parseFloat(registrationData.height) < 100 || parseFloat(registrationData.height) > 250) {
          return { isValid: false, message: "Altura deve estar entre 100 e 250 cm" };
        }
        if (parseFloat(registrationData.weight) < 30 || parseFloat(registrationData.weight) > 300) {
          return { isValid: false, message: "Peso deve estar entre 30 e 300 kg" };
        }
        return { isValid: true };
      
      case 3: // Fitness Goals
        if (!registrationData.primaryGoal || !registrationData.timeline || !registrationData.experience) {
          return { isValid: false, message: "Todos os campos são obrigatórios" };
        }
        return { isValid: true };
      
      case 4: // Activity Level
        if (!registrationData.activityLevel || !registrationData.gymDaysPerWeek || !registrationData.preferredWorkoutTime || !registrationData.workoutDuration) {
          return { isValid: false, message: "Todos os campos são obrigatórios" };
        }
        return { isValid: true };
      
      case 5: // Nutrition Preferences
        if (!registrationData.mealFrequency || !registrationData.cookingSkill || !registrationData.budget) {
          return { isValid: false, message: "Todos os campos são obrigatórios" };
        }
        return { isValid: true };
      
      case 6: // Health Info
        if (!registrationData.sleepHours || !registrationData.stressLevel) {
          return { isValid: false, message: "Todos os campos são obrigatórios" };
        }
        return { isValid: true };
      
      default:
        return { isValid: true };
    }
  };

  const handleNext = async () => {
    // Validate current step
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
      // Final step - create account and save profile
      await handleCompleteRegistration();
    }
  };

  const handleCompleteRegistration = async () => {
    try {
      // 1. Create account
      const { error: signUpError } = await signUp(
        registrationData.email, 
        registrationData.password, 
        registrationData.name
      );
      
      if (signUpError) {
        return; // Error already handled by signUp
      }

      // 2. Save complete profile data
      const profileUpdate = {
        // Personal info
        age: parseInt(registrationData.age),
        gender: registrationData.gender as 'male' | 'female' | 'other',
        height: parseFloat(registrationData.height),
        weight: parseFloat(registrationData.weight),
        
        // Fitness goals
        fitness_goal: registrationData.primaryGoal as any,
        target_weight: registrationData.targetWeight ? parseFloat(registrationData.targetWeight) : undefined,
        
        // Activity level
        activity_level: registrationData.activityLevel as any,
        gym_days_per_week: parseInt(registrationData.gymDaysPerWeek),
        
        // Nutrition preferences
        dietary_restrictions: registrationData.dietaryRestrictions,
        allergies: registrationData.allergies,
        
        // Additional data (you may need to extend your profile schema)
        phone: registrationData.phone,
        secondary_goals: registrationData.secondaryGoals,
        timeline: registrationData.timeline,
        experience: registrationData.experience,
        preferred_workout_time: registrationData.preferredWorkoutTime,
        workout_duration: registrationData.workoutDuration,
        meal_frequency: registrationData.mealFrequency,
        cooking_skill: registrationData.cookingSkill,
        budget: registrationData.budget,
        medical_conditions: registrationData.medicalConditions,
        medications: registrationData.medications,
        injuries: registrationData.injuries,
        sleep_hours: parseInt(registrationData.sleepHours),
        stress_level: registrationData.stressLevel,
      };

      const { error: profileError } = await updateProfile(profileUpdate);
      
      if (profileError) {
        toast({
          title: "Erro ao salvar perfil",
          description: "Conta criada, mas houve erro ao salvar o perfil. Você pode completá-lo depois.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Cadastro concluído com sucesso!",
          description: "Bem-vindo ao FitLife AI! Seu perfil foi configurado completamente.",
        });
      }

      // 3. Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Erro no cadastro",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
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
        return <AccountStep data={registrationData} updateData={updateData} />;
      case 2:
        return <PersonalInfoStep data={registrationData} updateData={updateData} />;
      case 3:
        return <FitnessGoalsStep data={registrationData} updateData={updateData} />;
      case 4:
        return <ActivityLevelStep data={registrationData} updateData={updateData} />;
      case 5:
        return <NutritionPreferencesStep data={registrationData} updateData={updateData} />;
      case 6:
        return <HealthInfoStep data={registrationData} updateData={updateData} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <button 
            onClick={() => navigate('/')}
            className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 hover:scale-105 transition-transform duration-200 cursor-pointer"
          >
            <Dumbbell className="w-8 h-8 text-white" />
          </button>
          <h1 className="text-4xl font-orbitron font-bold gradient-text mb-2">
            Cadastro Completo FitLife AI
          </h1>
          <p className="text-muted-foreground text-center max-w-2xl">
            Configure sua conta e perfil personalizado para receber treinos e dietas únicos criados por IA
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
            <CardTitle className="text-2xl font-poppins text-foreground flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-primary" />
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
            {loading ? "Processando..." : currentStep === steps.length ? "Finalizar Cadastro" : "Próximo"}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompleteRegistration;
