import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const FitLifePricing = () => {
  const navigate = useNavigate();
  
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary-pink/5 to-primary-red/5" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="font-poppins font-bold text-4xl md:text-5xl mb-6">
            Planos que se adaptam ao{" "}
            <span className="gradient-text">
              seu estilo
            </span>
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Comece gratuitamente e descubra como nossa IA pode ajudar a transformar seus resultados
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <Card className="glass-card p-8 border-2 border-primary/20 relative">
            {/* Popular Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              
            </div>

            <div className="text-center mb-8">
              
              
              <div className="mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-4xl font-bold gradient-text">R$ 14,90</span>
                  <span className="text-white/60">/mês</span>
                </div>
                <div className="glass-card px-3 py-1 inline-block">
                  <span className="text-sm text-primary font-medium">
                    🎉 7 dias grátis para testar
                  </span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-8">
              {[
                "Sugestões de treinos personalizados ilimitados",
                "Sugestões nutricionais adaptativos",
                "Acompanhamento de progresso",
                "Sem anúncios",
                
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-gradient-primary flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <Button 
              className="btn-primary w-full text-lg py-4 h-auto"
              onClick={() => navigate('/register')}
            >
              Começar Teste Gratuito
            </Button>
            
            <p className="text-xs text-white/60 text-center mt-4">
              Cancele a qualquer momento • Sem compromisso
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FitLifePricing;