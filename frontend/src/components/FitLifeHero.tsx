import { ArrowRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const FitLifeHero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/lovable-uploads/079347ff-99da-4b90-a2e1-f6e9509959fb.png" 
          alt="FitLife AI - Equipamentos fitness com tecnologia inteligente" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-background/90" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Badge */}
          

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="font-poppins font-bold text-4xl md:text-6xl lg:text-7xl leading-tight">
              Transforme seu corpo com{" "}
              <span className="gradient-text">
                IA Personalizada
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 max-w-3xl mx-auto font-inter">
              Treinos e planos nutricionais únicos, criados especialmente para você por inteligência artificial avançada
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Button 
              className="btn-primary text-lg px-8 py-4 h-auto"
              onClick={() => navigate('/register')}
            >
              <span>Começar Jornada Grátis</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              className="btn-secondary text-lg px-8 py-4 h-auto"
              onClick={() => navigate('/login')}
            >
              <Play className="w-5 h-5 mr-2" />
              Já sou usuário
            </Button>
          </div>

          {/* Stats */}
          
        </div>
      </div>

      {/* Scroll Indicator */}
      
    </section>
  );
};

export default FitLifeHero;