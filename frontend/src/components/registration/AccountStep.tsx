import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AccountStepProps {
  data: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
  };
  updateData: (updates: any) => void;
}

const AccountStep = ({ data, updateData }: AccountStepProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-6">
      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-foreground">
          Nome completo *
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="name"
            type="text"
            placeholder="Seu nome completo"
            className="pl-10 glass bg-white/5 border-white/10 text-foreground"
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground">
          E-mail *
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            className="pl-10 glass bg-white/5 border-white/10 text-foreground"
            value={data.email}
            onChange={(e) => updateData({ email: e.target.value })}
            required
          />
        </div>
      </div>

      {/* Phone Field */}
      <div className="space-y-2">
        <Label htmlFor="phone" className="text-foreground">
          Telefone (opcional)
        </Label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="phone"
            type="tel"
            placeholder="(11) 99999-9999"
            className="pl-10 glass bg-white/5 border-white/10 text-foreground"
            value={data.phone}
            onChange={(e) => updateData({ phone: e.target.value })}
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <Label htmlFor="password" className="text-foreground">
          Senha *
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-10 pr-10 glass bg-white/5 border-white/10 text-foreground"
            value={data.password}
            onChange={(e) => updateData({ password: e.target.value })}
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
        <p className="text-xs text-muted-foreground">
          Mínimo de 8 caracteres
        </p>
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-foreground">
          Confirmar senha *
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="••••••••"
            className="pl-10 pr-10 glass bg-white/5 border-white/10 text-foreground"
            value={data.confirmPassword}
            onChange={(e) => updateData({ confirmPassword: e.target.value })}
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
        {data.password && data.confirmPassword && data.password !== data.confirmPassword && (
          <p className="text-sm text-red-500">As senhas não coincidem</p>
        )}
      </div>

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <p className="text-sm text-blue-400">
          <strong>🔒 Segurança:</strong> Suas informações são protegidas com criptografia de ponta a ponta.
        </p>
      </div>
    </div>
  );
};

export default AccountStep;
