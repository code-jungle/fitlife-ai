import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ProfileProvider, useProfileContext } from "@/contexts/ProfileContext";
import LoadingState from "@/components/ui/LoadingState";
import PersonalInfoStep from "@/components/profile/PersonalInfoStep";
import ActivityLevelStep from "@/components/profile/ActivityLevelStep";
import GoalsStep from "@/components/profile/GoalsStep";
import RestrictionsStep from "@/components/profile/RestrictionsStep";
import { toast } from "@/hooks/use-toast";

const steps = [
  { id: 1, title: "Informações Pessoais", description: "Dados básicos sobre você" },
  { id: 2, title: "Nível de Atividade", description: "Como você se exercita" },
  { id: 3, title: "Objetivos", description: "O que você quer alcançar" },
  { id: 4, title: "Restrições", description: "Limitações alimentares" },
];

const ProfileSetupContent = () => {
  const navigate = useNavigate();
  const {
    profileData,
    updateProfileData,
    currentStep,
    nextStep,
    previousStep,
    canProceed,
    profileLoading,
    profileError,
    saveProfile,
    validateProfile
  } = useProfileContext();

  useEffect(() => {
    if (profileError) {
      toast({
        title: "Erro ao salvar perfil",
        description: profileError,
        variant: "destructive",
      });
    }
  }, [profileError]);

  const handleNext = async () => {
    const validation = validateProfile();
    if (!validation.isValid) {
      toast({
        title: "Campos obrigatórios",
        description: validation.message,
        variant: "destructive",
      });
      return;
    }

    if (currentStep === steps.length) {
      await saveProfile();
      navigate('/dashboard');
    } else {
      nextStep();
    }
  };

  const handlePrevious = () => {
    previousStep();
  };

  const progress = (currentStep / steps.length) * 100;

  if (profileLoading) {
    return <LoadingState message="Verificando perfil..." fullScreen />;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoStep 
            data={profileData} 
            updateData={updateProfileData} 
          />
        );
      case 2:
        return (
          <ActivityLevelStep 
            data={profileData} 
            updateData={updateProfileData} 
          />
        );
      case 3:
        return (
          <GoalsStep 
            data={profileData} 
            updateData={updateProfileData} 
          />
        );
      case 4:
        return (
          <RestrictionsStep 
            data={profileData} 
            updateData={updateProfileData} 
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
            disabled={!canProceed}
          >
            {currentStep === steps.length ? "Finalizar" : "Próximo"}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const ProfileSetupRefactored = () => {
  return (
    <ProfileProvider>
      <ProfileSetupContent />
    </ProfileProvider>
  );
};

export default ProfileSetupRefactored;

