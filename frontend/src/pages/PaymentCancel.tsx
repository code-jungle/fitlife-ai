import React from "react";
import { useNavigate } from "react-router-dom";
import { XCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="glass-card max-w-md w-full">
        <CardContent className="pt-6 text-center">
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Pagamento Cancelado
          </h1>
          
          <p className="text-muted-foreground mb-8">
            Você cancelou o processo de pagamento. Não se preocupe, nenhuma cobrança foi realizada.
          </p>

          <div className="space-y-3">
            <Button
              className="w-full btn-primary"
              onClick={() => navigate('/upgrade')}
            >
              Tentar Novamente
            </Button>
            
            <Button
              variant="ghost"
              className="w-full"
              onClick={() => navigate('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentCancel;