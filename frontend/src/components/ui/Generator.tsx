import { Sparkles, Brain, LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useState, useEffect } from "react";

interface GeneratorFeature {
  icon: LucideIcon;
  title: string;
  gradient: string;
}

interface GeneratorProps {
  title: string;
  icon: LucideIcon;
  iconGradient: string;
  phases: string[];
  tips: string[];
  features: GeneratorFeature[];
  disclaimer: string;
  tipGradient: string;
  tipBorder: string;
}

const Generator = ({
  title,
  icon: Icon,
  iconGradient,
  phases,
  tips,
  features,
  disclaimer,
  tipGradient,
  tipBorder
}: GeneratorProps) => {
  const [progress, setProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 2;
        if (newProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return newProgress;
      });
    }, 60);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const phaseIndex = Math.floor(progress / 20);
    setCurrentPhase(phaseIndex);
  }, [progress]);

  return (
    <Card className="glass-card border border-white/10 mb-8">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-3 text-2xl font-poppins text-foreground mb-4">
          <div className={`w-12 h-12 rounded-xl ${iconGradient} flex items-center justify-center animate-pulse`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="text-foreground font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Current Phase */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-lg font-medium text-foreground">
            <Sparkles className="w-5 h-5 text-pink-500 animate-spin" />
            {phases[currentPhase] || phases[0]}
          </div>
          
          {/* Tip */}
          <div className={`p-4 rounded-xl bg-gradient-to-r ${tipGradient} border ${tipBorder}`}>
            <p className="text-foreground font-medium">
              {tips[currentPhase] || tips[0]}
            </p>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-amber-500 text-sm">⚠️</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                Aviso Importante
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {disclaimer}
              </p>
            </div>
          </div>
        </div>

        {/* AI Features */}
        <div className="grid grid-cols-3 gap-4 pt-4">
          {features.map((feature, index) => (
            <div key={index} className="text-center space-y-2">
              <div className={`w-10 h-10 mx-auto rounded-xl ${feature.gradient} flex items-center justify-center`}>
                <feature.icon className="w-5 h-5 text-white" />
              </div>
              <p className="text-xs text-muted-foreground">{feature.title}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Generator;

