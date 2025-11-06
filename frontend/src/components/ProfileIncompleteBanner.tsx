import { AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const ProfileIncompleteBanner = () => {
  const navigate = useNavigate();

  return (
    <Card className="border-orange-500/20 bg-orange-500/10 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-orange-500" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Perfil Incompleto
            </h3>
            <p className="text-muted-foreground text-sm">
              Complete seu perfil para acessar todas as funcionalidades da IA e receber treinos e planos nutricionais personalizados.
            </p>
          </div>
          
          <Button 
            onClick={() => navigate('/profile-setup')}
            className="btn-primary"
          >
            Completar Perfil
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileIncompleteBanner;
