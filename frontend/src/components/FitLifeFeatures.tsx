import { Brain, Dumbbell, Apple, Target, Users, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";

const FitLifeFeatures = () => {
  const features = [
    {
      icon: Brain,
      title: "IA Personalizada",
      description: "Algoritmos avançados criam sugestões de treinos únicos baseados no seu perfil, objetivos e progresso",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Dumbbell,
      title: "Treinos Adaptativos",
      description: "Exercícios que evoluem com você, ajustando intensidade e complexidade automaticamente",
      color: "text-accent-teal",
      bgColor: "bg-accent-teal/10",
    },
    {
      icon: Apple,
      title: "Nutrição Inteligente",
      description: "Sugestões de planos alimentares personalizados que se adaptam ao seu estilo de vida e preferências",
      color: "text-accent-yellow",
      bgColor: "bg-accent-yellow/10",
    },
   
  ];

  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-poppins font-bold text-4xl md:text-5xl mb-6">
            Recursos que fazem a{" "}
            <span className="gradient-text">diferença</span>
          </h2>
          <p className="text-xl text-white/80 leading-relaxed">
            Tecnologia de ponta combinada com ciência do exercício para resultados extraordinários
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={index}
                className="glass-card p-8 hover-lift group cursor-pointer border-white/10"
              >
                <div className={`w-16 h-16 rounded-2xl ${feature.bgColor} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                
                <h3 className="font-poppins font-semibold text-xl mb-4 text-white">
                  {feature.title}
                </h3>
                
                <p className="text-white/70 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FitLifeFeatures;