import { useState } from "react";
import { MessageSquare, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const FeedbackButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      toast({
        title: "Mensagem obrigatória",
        description: "Por favor, escreva sua sugestão ou feedback",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Criar o link mailto com todos os dados
      const subject = `[FitLife AI Feedback] ${formData.subject || 'Sugestão/Feedback'}`;
      const body = `
Olá CodeJungle,

${formData.message}

---
Dados do usuário:
Nome: ${formData.name || 'Não informado'}
Email: ${formData.email || 'Não informado'}
Data: ${new Date().toLocaleString('pt-BR')}
      `.trim();

      const mailtoLink = `mailto:codejungle8@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      // Abrir o cliente de email
      window.open(mailtoLink, '_blank');
      
      toast({
        title: "Email aberto!",
        description: "Seu cliente de email foi aberto. Envie a mensagem para finalizar o feedback.",
      });

      // Resetar formulário
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsOpen(false);
      
    } catch (error) {
      console.error('Error opening email client:', error);
      toast({
        title: "Erro ao abrir email",
        description: "Não foi possível abrir o cliente de email. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Botão de Feedback */}
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-primary hover:bg-gradient-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        size="lg"
      >
        <MessageSquare className="w-5 h-5 mr-2" />
        Enviar Feedback
      </Button>

      {/* Modal de Feedback */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md glass-card border border-white/10">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-poppins gradient-text">
                  Enviar Feedback
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Sua opinião é muito importante para melhorarmos a aplicação!
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome (opcional)</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Seu nome"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email (opcional)</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="seu@email.com"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject">Assunto (opcional)</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Ex: Sugestão de funcionalidade"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="message">Mensagem *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Descreva sua sugestão, feedback ou problema encontrado..."
                    className="mt-1 min-h-[120px]"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOpen(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-primary hover:bg-gradient-primary/90"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Enviar
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default FeedbackButton;
