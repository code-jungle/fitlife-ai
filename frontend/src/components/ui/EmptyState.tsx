import { LucideIcon, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
}

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: Feature[];
  buttonText: string;
  onAction: () => void;
  iconGradient?: string;
}

const EmptyState = ({ 
  icon: Icon,
  title,
  description,
  features,
  buttonText,
  onAction,
  iconGradient = "bg-gradient-primary"
}: EmptyStateProps) => {
  return (
    <Card className="glass-card border border-white/10 text-center py-12">
      <CardHeader>
        <div className={`w-24 h-24 mx-auto rounded-full ${iconGradient} flex items-center justify-center mb-6`}>
          <Icon className="w-12 h-12 text-white" />
        </div>
        <CardTitle className="text-2xl font-poppins text-foreground mb-2">
          {title}
        </CardTitle>
        <p className="text-muted-foreground max-w-md mx-auto">
          {description}
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* Features List */}
          <div className="grid gap-4 md:grid-cols-3 max-w-2xl mx-auto">
            {features.map((feature, index) => (
              <div key={index} className="space-y-2">
                <div className={`w-12 h-12 mx-auto rounded-xl ${feature.gradient} flex items-center justify-center`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Button 
            onClick={onAction}
            size="lg"
            className="btn-primary px-8 py-3 text-lg"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            {buttonText}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyState;

