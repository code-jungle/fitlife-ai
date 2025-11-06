import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Dumbbell, Target, Scale, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { UserRegister } from "@/types/auth";

const RegisterNew = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<UserRegister & { confirmPassword: string }>({
    email: "",
    password: "",
    confirmPassword: "",
    full_name: "",
    age: 25,
    weight: 70,
    height: 170,
    objectives: "",
    dietary_restrictions: "",
    training_type: "academia",
    current_activities: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Password validation
    if (formData.password.length < 8) {
      newErrors.password = "A senha deve ter pelo menos 8 caracteres";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }
    
    // Age validation
    if (formData.age < 12 || formData.age > 100) {
      newErrors.age = "Idade deve estar entre 12 e 100 anos";
    }
    
    // Weight validation
    if (formData.weight < 30 || formData.weight > 300) {
      newErrors.weight = "Peso deve estar entre 30 e 300 kg";
    }
    
    // Height validation
    if (formData.height < 120 || formData.height > 250) {
      newErrors.height = "Altura deve estar entre 120 e 250 cm";
    }
    
    // Objectives validation
    if (!formData.objectives.trim()) {
      newErrors.objectives = "Por favor, descreva seus objetivos";
    }
    
    // Training type validation
    if (!formData.training_type) {
      newErrors.training_type = "Por favor, selecione onde você pretende treinar";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Remove confirmPassword before sending
    const { confirmPassword, ...registerData } = formData;
    
    const { error } = await register(registerData);
    
    if (!error) {
      toast({
        title: "Conta criada com sucesso!",
        description: "Bem-vindo ao FitLife AI",
      });
      navigate('/dashboard');
    } else {
      toast({
        title: "Erro ao criar conta",
        description: error,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <button 
            onClick={() => navigate('/')}
            className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 hover:scale-105 transition-transform duration-200 cursor-pointer"
          >
            <Dumbbell className="w-8 h-8 text-white" />
          </button>
          <h1 className="text-3xl font-orbitron font-bold gradient-text">
            FitLife AI
          </h1>
          <p className="text-muted-foreground text-center mt-2">
            Complete seu cadastro para começar
          </p>
        </div>

        <Card className="glass-card border border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl font-poppins text-foreground">
              Criar sua conta
            </CardTitle>
            <CardDescription>
              Preencha todos os campos para uma experiência personalizada
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informações Pessoais
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="full_name">Nome completo *</Label>
                    <Input
                      id="full_name"
                      type="text"
                      placeholder="Seu nome completo"
                      className="glass bg-white/5 border-white/10"
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        className="pl-10 glass bg-white/5 border-white/10"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  {/* Age */}
                  <div className="space-y-2">
                    <Label htmlFor="age">Idade * (12-100 anos)</Label>
                    <Input
                      id="age"
                      type="number"
                      min="12"
                      max="100"
                      placeholder="25"
                      className="glass bg-white/5 border-white/10"
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: parseInt(e.target.value) || 0})}
                      required
                    />
                    {errors.age && <p className="text-sm text-red-500">{errors.age}</p>}
                  </div>

                  {/* Weight */}
                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso * (30-300 kg)</Label>
                    <div className="relative">
                      <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="weight"
                        type="number"
                        min="30"
                        max="300"
                        step="0.1"
                        placeholder="70.5"
                        className="pl-10 glass bg-white/5 border-white/10"
                        value={formData.weight}
                        onChange={(e) => setFormData({...formData, weight: parseFloat(e.target.value) || 0})}
                        required
                      />
                    </div>
                    {errors.weight && <p className="text-sm text-red-500">{errors.weight}</p>}
                  </div>

                  {/* Height */}
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="height">Altura * (120-250 cm)</Label>
                    <div className="relative">
                      <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="height"
                        type="number"
                        min="120"
                        max="250"
                        placeholder="170"
                        className="pl-10 glass bg-white/5 border-white/10"
                        value={formData.height}
                        onChange={(e) => setFormData({...formData, height: parseInt(e.target.value) || 0})}
                        required
                      />
                    </div>
                    {errors.height && <p className="text-sm text-red-500">{errors.height}</p>}
                  </div>
                </div>
              </div>

              {/* Goals Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Objetivos e Preferências
                </h3>
                
                <div className="space-y-4">
                  {/* Objectives */}
                  <div className="space-y-2">
                    <Label htmlFor="objectives">Seus objetivos *</Label>
                    <Textarea
                      id="objectives"
                      placeholder="Ex: Perder peso, ganhar massa muscular, melhorar condicionamento físico..."
                      className="glass bg-white/5 border-white/10 min-h-[100px]"
                      value={formData.objectives}
                      onChange={(e) => setFormData({...formData, objectives: e.target.value})}
                      required
                    />
                    {errors.objectives && <p className="text-sm text-red-500">{errors.objectives}</p>}
                  </div>

                  {/* Training Type */}
                  <div className="space-y-2">
                    <Label htmlFor="training_type">Onde você pretende treinar? *</Label>
                    <Select 
                      value={formData.training_type} 
                      onValueChange={(value: 'academia' | 'casa' | 'ar_livre') => 
                        setFormData({...formData, training_type: value})
                      }
                    >
                      <SelectTrigger className="glass bg-white/5 border-white/10">
                        <SelectValue placeholder="Selecione o local" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="academia">Academia</SelectItem>
                        <SelectItem value="casa">Casa</SelectItem>
                        <SelectItem value="ar_livre">Ao ar livre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Current Activities */}
                  <div className="space-y-2">
                    <Label htmlFor="current_activities">Atividades físicas atuais (opcional)</Label>
                    <Textarea
                      id="current_activities"
                      placeholder="Ex: Caminhada 3x por semana, futebol aos fins de semana..."
                      className="glass bg-white/5 border-white/10 min-h-[80px]"
                      value={formData.current_activities}
                      onChange={(e) => setFormData({...formData, current_activities: e.target.value})}
                    />
                  </div>

                  {/* Dietary Restrictions */}
                  <div className="space-y-2">
                    <Label htmlFor="dietary_restrictions">Restrições alimentares (opcional)</Label>
                    <Textarea
                      id="dietary_restrictions"
                      placeholder="Ex: Vegetariano, intolerância à lactose, alergia a frutos do mar..."
                      className="glass bg-white/5 border-white/10 min-h-[80px]"
                      value={formData.dietary_restrictions}
                      onChange={(e) => setFormData({...formData, dietary_restrictions: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Segurança
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 glass bg-white/5 border-white/10"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar senha *</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10 glass bg-white/5 border-white/10"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full btn-primary" disabled={loading}>
                {loading ? "Criando conta..." : "Criar conta e começar"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Já tem uma conta?{" "}
                <button 
                  onClick={() => navigate('/login')}
                  className="gradient-text font-semibold hover:underline"
                >
                  Fazer login
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegisterNew;
