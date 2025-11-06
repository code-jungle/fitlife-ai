import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { User, Ruler, Weight, Calendar } from "lucide-react";

interface PersonalInfoStepProps {
  data: {
    age: string;
    gender: string;
    height: string;
    weight: string;
  };
  updateData: (updates: any) => void;
}

const PersonalInfoStep = ({ data, updateData }: PersonalInfoStepProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Age */}
        <div className="space-y-2">
          <Label htmlFor="age" className="text-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Idade *
          </Label>
          <Input
            id="age"
            type="number"
            placeholder="25"
            min="13"
            max="120"
            className="glass bg-white/5 border-white/10 text-foreground"
            value={data.age}
            onChange={(e) => updateData({ age: e.target.value })}
            required
          />
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label className="text-foreground flex items-center gap-2">
            <User className="w-4 h-4" />
            Gênero *
          </Label>
          <Select value={data.gender} onValueChange={(value) => updateData({ gender: value })}>
            <SelectTrigger className="glass bg-white/5 border-white/10 text-foreground">
              <SelectValue placeholder="Selecione" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Masculino</SelectItem>
              <SelectItem value="female">Feminino</SelectItem>
              <SelectItem value="other">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Height */}
        <div className="space-y-2">
          <Label htmlFor="height" className="text-foreground flex items-center gap-2">
            <Ruler className="w-4 h-4" />
            Altura (cm) *
          </Label>
          <Input
            id="height"
            type="number"
            placeholder="175"
            min="100"
            max="250"
            className="glass bg-white/5 border-white/10 text-foreground"
            value={data.height}
            onChange={(e) => updateData({ height: e.target.value })}
            required
          />
        </div>

        {/* Weight */}
        <div className="space-y-2">
          <Label htmlFor="weight" className="text-foreground flex items-center gap-2">
            <Weight className="w-4 h-4" />
            Peso (kg) *
          </Label>
          <Input
            id="weight"
            type="number"
            placeholder="70"
            min="30"
            max="300"
            step="0.1"
            className="glass bg-white/5 border-white/10 text-foreground"
            value={data.weight}
            onChange={(e) => updateData({ weight: e.target.value })}
            required
          />
        </div>
      </div>

      {/* BMI Calculator */}
      {data.height && data.weight && (
        <Card className="bg-green-500/10 border border-green-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-green-400">Seu IMC</h4>
                <p className="text-sm text-green-300">
                  {(() => {
                    const height = parseFloat(data.height) / 100;
                    const weight = parseFloat(data.weight);
                    const bmi = weight / (height * height);
                    return `${bmi.toFixed(1)} kg/m²`;
                  })()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-green-300">
                  {(() => {
                    const height = parseFloat(data.height) / 100;
                    const weight = parseFloat(data.weight);
                    const bmi = weight / (height * height);
                    if (bmi < 18.5) return "Abaixo do peso";
                    if (bmi < 25) return "Peso normal";
                    if (bmi < 30) return "Sobrepeso";
                    return "Obesidade";
                  })()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <p className="text-sm text-blue-400">
          <strong>💡 Dica:</strong> Essas informações nos ajudam a calcular suas necessidades calóricas e criar planos personalizados para você.
        </p>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
