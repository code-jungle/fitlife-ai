import { Dumbbell, Apple, Sparkles, Target, User, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const QuickActions = () => {
  const actions = [
    {
      title: "Gerar Treino com IA",
      description: "Crie um novo plano de treino personalizado",
      icon: Dumbbell,
      href: "/workouts",
      gradient: "from-orange-500 to-pink-500",
    },
    {
      title: "Gerar Plano Alimentar",
      description: "Monte sua dieta ideal com inteligência artificial",
      icon: Apple,
      href: "/nutrition",
      gradient: "from-green-500 to-teal-500",
    },
    {
      title: "Gerenciar Metas",
      description: "Acompanhe e defina suas metas de fitness",
      icon: Target,
      href: "/goals",
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      title: "Editar Perfil",
      description: "Atualize suas informações pessoais",
      icon: User,
      href: "/profile",
      gradient: "from-blue-500 to-cyan-500",
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-poppins font-bold text-foreground mb-6">
        Ações Rápidas
      </h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {actions.map((action, index) => (
          <Card key={index} className="glass-card border border-white/10 hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-foreground">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${action.gradient} flex items-center justify-center`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                {action.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {action.description}
              </p>
              <Button asChild className="w-full btn-primary">
                <Link to={action.href}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Começar Agora
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;