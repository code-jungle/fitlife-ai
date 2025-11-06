import { ArrowRight, Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const FitLifeCTA = () => {
  const navigate = useNavigate();
  
  const benefits = [
    "Treinos personalizados por IA",
    "Planos nutricionais adaptativos", 
    "Acompanhamento de progresso",
    "Comunidade motivadora",
    "Suporte 24/7",
    "Sem anúncios ou distrações"
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary-pink/10 to-primary-red/10" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-primary rounded-full blur-3xl opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <Card className="glass-card p-12 text-center border-2 border-white/20">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 text-sm mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-white/90">Comece sua transformação hoje</span>
            </div>

            {/* Headline */}
            <h2 className="font-poppins font-bold text-4xl md:text-5xl mb-6">
              Pronto para{" "}
              <span className="gradient-text">
                revolucionar
              </span>{" "}
              seus resultados?
            </h2>

            <p className="text-xl text-white/80 mb-12 max-w-2xl mx-auto">
              Junte-se a milhares de pessoas que já transformaram seus corpos com a nossa IA personalizada
            </p>

            {/* Benefits */}
            

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button 
                className="btn-primary text-lg px-12 py-4 h-auto hover-glow"
                onClick={() => navigate('/register')}
              >
                <span>Começar Gratuitamente</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FitLifeCTA;