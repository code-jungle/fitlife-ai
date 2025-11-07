import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Loader2, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { api } from "@/services/api";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<any>(null);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      checkPaymentStatus();
    }
  }, [sessionId]);

  const checkPaymentStatus = async () => {
    try {
      const statusData = await api.getCheckoutStatus(sessionId!);
      setStatus(statusData);
    } catch (error) {
      console.error("Erro ao verificar status:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando pagamento...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="glass-card max-w-md w-full">
        <CardContent className="pt-6 text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold gradient-text mb-4">
            Pagamento Confirmado!
          </h1>
          
          <p className="text-muted-foreground mb-8">
            Seu pagamento foi processado com sucesso. Você agora tem acesso a todas as funcionalidades premium do FitLife AI!
          </p>

          <div className="space-y-3 mb-8">
            <div className="flex items-center justify-center gap-2 text-foreground">
              <Crown className="w-5 h-5 text-primary" />
              <span>Treinos ilimitados</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-foreground">
              <Crown className="w-5 h-5 text-primary" />
              <span>Dietas personalizadas</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-foreground">
              <Crown className="w-5 h-5 text-primary" />
              <span>Suporte prioritário</span>
            </div>
          </div>

          <Button
            className="w-full btn-primary"
            onClick={() => navigate('/dashboard')}
          >
            Ir para o Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;