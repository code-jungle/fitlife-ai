import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useProfileValidation } from "@/hooks/useProfileValidation";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const { signIn, loading, user } = useAuth();
  const { isProfileComplete, loading: profileLoading } = useProfileValidation({ skipValidation: false });
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !profileLoading) {
      if (isProfileComplete) {
        navigate('/dashboard');
      } else {
        navigate('/profile-setup');
      }
    }
  }, [user, isProfileComplete, profileLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await signIn(formData.email, formData.password);
    
    // The useEffect will handle navigation based on profile completeness
    if (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
            Sua jornada fitness personalizada por IA
          </p>
        </div>

        <Card className="glass-card border border-white/10">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-poppins text-foreground">
              Entrar na sua conta
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  E-mail
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10 glass bg-white/5 border-white/10 text-foreground"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10 glass bg-white/5 border-white/10 text-foreground"
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
              </div>

              <Button type="submit" className="w-full btn-primary" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-muted-foreground">
                Não tem uma conta?{" "}
                <Link 
                  to="/register" 
                  className="gradient-text font-semibold hover:underline"
                >
                  Criar conta grátis
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;