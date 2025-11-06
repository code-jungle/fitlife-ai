import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User, Target, Activity, CheckCircle } from "lucide-react";

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CompleteProfileModal = ({ isOpen, onClose }: CompleteProfileModalProps) => {
  const navigate = useNavigate();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleCompleteProfile = async () => {
    setIsNavigating(true);
    // Fechar modal primeiro
    onClose();
    // Navegar para profile setup
    navigate('/profile-setup');
    setIsNavigating(false);
  };

  const benefits = [
    {
      icon: Target,
      title: "Planos Personalizados",
      description: "Receba treinos e dietas adaptados ao seu perfil"
    },
    {
      icon: Activity,
      title: "Acompanhamento IA",
      description: "Inteligência artificial para otimizar seus resultados"
    },
    {
      icon: CheckCircle,
      title: "Metas Inteligentes",
      description: "Objetivos realistas baseados no seu estilo de vida"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md glass-card border border-white/20" hideClose>
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-xl font-poppins font-bold gradient-text">
            Complete seu Perfil
          </DialogTitle>
          <p className="text-muted-foreground text-sm">
            Para uma experiência personalizada, precisamos conhecer melhor seus objetivos e preferências
          </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {benefits.map((benefit, index) => (
            <Card key={index} className="glass-card border border-white/10">
              <CardContent className="flex items-center gap-3 p-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-foreground">
                    {benefit.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button
            onClick={handleCompleteProfile}
            disabled={isNavigating}
            className="w-full btn-primary"
          >
            {isNavigating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Redirecionando...
              </>
            ) : (
              'Completar Perfil Agora'
            )}
          </Button>
          
          <Button
            variant="ghost"
            onClick={onClose}
            className="w-full text-muted-foreground hover:text-foreground"
            disabled={isNavigating}
          >
            Fazer depois
          </Button>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-muted-foreground">
            Leva apenas 2 minutos para configurar
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompleteProfileModal;
