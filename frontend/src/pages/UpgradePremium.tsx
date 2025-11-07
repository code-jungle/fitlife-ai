import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Crown, Check, Loader2, ArrowLeft, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { toast } from "@/hooks/use-toast";

const UpgradePremium = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState([]);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);

  useEffect(() => {
    loadPackages();
    loadSubscriptionStatus();
  }, []);

  const loadPackages = async () => {
    try {
      const response = await api.getSubscriptionPackages();
      setPackages(response.packages);
    } catch (error) {
      console.error("Erro ao carregar pacotes:", error);
    }
  };

  const loadSubscriptionStatus = async () => {
    try {
      const status = await api.getSubscriptionStatus();
      setSubscriptionStatus(status);
    } catch (error) {
      console.error("Erro ao carregar status:", error);
    }
  };

  const handleUpgrade = async (packageId: string) => {
    setLoading(true);
    try {
      const originUrl = window.location.origin;
      const { url } = await api.createCheckoutSession(packageId, originUrl);
      
      // Redirect to Stripe
      window.location.href = url;
    } catch (error: any) {
      console.error("Erro ao criar checkout:", error);
      toast({
        title: "Erro",
        description: error.response?.data?.detail || "Não foi possível iniciar o pagamento",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 glass border-b border-white/10 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="text-white/80 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-primary mb-6">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Seja Premium
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Desbloqueie acesso ilimitado a treinos e dietas personalizadas com IA
          </p>
        </div>

        {/* Current Status */}
        {subscriptionStatus && subscriptionStatus.status === "trial" && (
          <div className="max-w-xl mx-auto mb-8">
            <Card className="glass-card border border-amber-500/20 bg-amber-500/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-amber-500" />
                  <div>
                    <p className="font-semibold text-foreground">
                      Você está no período de teste grátis
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Faltam {subscriptionStatus.days_left} dias. Após isso, você precisará assinar para continuar.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {subscriptionStatus && subscriptionStatus.status === "trial_ended" && (
          <div className="max-w-xl mx-auto mb-8">
            <Card className="glass-card border border-red-500/20 bg-red-500/10">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Crown className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="font-semibold text-foreground">
                      Seu período de teste expirou
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Assine agora para continuar gerando treinos e dietas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Pricing Card */}
        <div className="max-w-md mx-auto">
          {packages.map((pkg: any) => (
            <Card key={pkg.id} className="glass-card border-2 border-primary/30 relative overflow-hidden">
              {/* Badge */}
              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-white text-xs font-semibold">
                  <Crown className="w-3 h-3" />
                  Mais Popular
                </span>
              </div>

              <CardHeader>
                <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                <CardDescription>
                  {pkg.trial_days} dias grátis, depois apenas R$ {pkg.amount.toFixed(2)}/mês
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Price */}
                <div className="text-center py-6">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-bold gradient-text">
                      R$ {pkg.amount.toFixed(2)}
                    </span>
                    <span className="text-xl text-muted-foreground">/mês</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Primeiros {pkg.trial_days} dias grátis
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="text-foreground">Treinos ilimitados com IA</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="text-foreground">Dietas personalizadas ilimitadas</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="text-foreground">Histórico completo</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="text-foreground">Planos adaptados ao seu objetivo</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-green-500" />
                    </div>
                    <span className="text-foreground">Suporte prioritário</span>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  className="w-full btn-primary text-lg py-6"
                  onClick={() => handleUpgrade(pkg.id)}
                  disabled={loading || subscriptionStatus?.is_premium}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processando...
                    </>
                  ) : subscriptionStatus?.is_premium ? (
                    "Você já é Premium!"
                  ) : (
                    <>
                      <Crown className="w-5 h-5 mr-2" />
                      Começar Período Grátis
                    </>
                  )}
                </Button>

                {/* Trust Badges */}
                <div className="pt-4 border-t border-white/10">
                  <p className="text-xs text-center text-muted-foreground">
                    🔒 Pagamento seguro via Stripe<br />
                    ✓ Cancele quando quiser<br />
                    ✓ Sem compromisso
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">Perguntas Frequentes</h2>
          <div className="space-y-4">
            <Card className="glass-card">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Como funciona o período grátis?</h3>
                <p className="text-sm text-muted-foreground">
                  Você tem 7 dias para testar todas as funcionalidades premium sem pagar nada. 
                  Após o período, será cobrado automaticamente R$ 14,90/mês.
                </p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Posso cancelar quando quiser?</h3>
                <p className="text-sm text-muted-foreground">
                  Sim! Você pode cancelar a qualquer momento sem multas ou taxas extras.
                </p>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">É seguro?</h3>
                <p className="text-sm text-muted-foreground">
                  Sim! Usamos o Stripe, uma das plataformas de pagamento mais seguras do mundo.
                  Seus dados de cartão são criptografados e nunca ficam armazenados em nossos servidores.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default UpgradePremium;
