import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Pill, Bandage, Moon, Brain } from "lucide-react";

interface HealthInfoStepProps {
  data: {
    medicalConditions: string[];
    medications: string[];
    injuries: string[];
    sleepHours: string;
    stressLevel: string;
  };
  updateData: (updates: any) => void;
}

const HealthInfoStep = ({ data, updateData }: HealthInfoStepProps) => {
  const medicalConditionsOptions = [
    { value: "diabetes", label: "Diabetes" },
    { value: "hypertension", label: "Hipertensão" },
    { value: "heart_disease", label: "Doença cardíaca" },
    { value: "asthma", label: "Asma" },
    { value: "arthritis", label: "Artrite" },
    { value: "osteoporosis", label: "Osteoporose" },
    { value: "thyroid", label: "Problemas de tireoide" },
    { value: "depression", label: "Depressão" },
    { value: "anxiety", label: "Ansiedade" },
    { value: "none", label: "Nenhuma" },
  ];

  const injuryOptions = [
    { value: "knee", label: "Joelho" },
    { value: "back", label: "Costas" },
    { value: "shoulder", label: "Ombro" },
    { value: "ankle", label: "Tornozelo" },
    { value: "wrist", label: "Pulso" },
    { value: "neck", label: "Pescoço" },
    { value: "hip", label: "Quadril" },
    { value: "elbow", label: "Cotovelo" },
    { value: "none", label: "Nenhuma" },
  ];

  const handleConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      updateData({ medicalConditions: [...data.medicalConditions, condition] });
    } else {
      updateData({ medicalConditions: data.medicalConditions.filter(c => c !== condition) });
    }
  };

  const handleInjuryChange = (injury: string, checked: boolean) => {
    if (checked) {
      updateData({ injuries: [...data.injuries, injury] });
    } else {
      updateData({ injuries: data.injuries.filter(i => i !== injury) });
    }
  };

  return (
    <div className="space-y-6">
      {/* Sleep Hours */}
      <div className="space-y-2">
        <Label className="text-foreground flex items-center gap-2">
          <Moon className="w-4 h-4" />
          Horas de sono por noite *
        </Label>
        <Select value={data.sleepHours} onValueChange={(value) => updateData({ sleepHours: value })}>
          <SelectTrigger className="glass bg-white/5 border-white/10 text-foreground">
            <SelectValue placeholder="Quantas horas você dorme?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="4">Menos de 5 horas</SelectItem>
            <SelectItem value="5">5 horas</SelectItem>
            <SelectItem value="6">6 horas</SelectItem>
            <SelectItem value="7">7 horas</SelectItem>
            <SelectItem value="8">8 horas</SelectItem>
            <SelectItem value="9">9 horas</SelectItem>
            <SelectItem value="10">10+ horas</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stress Level */}
      <div className="space-y-2">
        <Label className="text-foreground flex items-center gap-2">
          <Brain className="w-4 h-4" />
          Nível de estresse atual *
        </Label>
        <Select value={data.stressLevel} onValueChange={(value) => updateData({ stressLevel: value })}>
          <SelectTrigger className="glass bg-white/5 border-white/10 text-foreground">
            <SelectValue placeholder="Como você se sente?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="very_low">Muito baixo</SelectItem>
            <SelectItem value="low">Baixo</SelectItem>
            <SelectItem value="moderate">Moderado</SelectItem>
            <SelectItem value="high">Alto</SelectItem>
            <SelectItem value="very_high">Muito alto</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Medical Conditions */}
      <div className="space-y-3">
        <Label className="text-foreground flex items-center gap-2">
          <Heart className="w-4 h-4" />
          Condições médicas
        </Label>
        <p className="text-sm text-muted-foreground">
          Selecione todas as condições que se aplicam a você
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {medicalConditionsOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={option.value}
                checked={data.medicalConditions.includes(option.value)}
                onCheckedChange={(checked) => handleConditionChange(option.value, checked as boolean)}
              />
              <Label
                htmlFor={option.value}
                className="text-sm text-foreground cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Medications */}
      <div className="space-y-2">
        <Label className="text-foreground flex items-center gap-2">
          <Pill className="w-4 h-4" />
          Medicamentos em uso
        </Label>
        <p className="text-sm text-muted-foreground">
          Liste os medicamentos que você toma regularmente (opcional)
        </p>
        <textarea
          className="w-full min-h-[80px] p-3 glass bg-white/5 border border-white/10 text-foreground rounded-md resize-none"
          placeholder="Ex: Losartana 50mg, Metformina 850mg..."
          value={data.medications.join(", ")}
          onChange={(e) => updateData({ medications: e.target.value.split(",").map(m => m.trim()).filter(m => m) })}
        />
      </div>

      {/* Injuries */}
      <div className="space-y-3">
        <Label className="text-foreground flex items-center gap-2">
          <Bandage className="w-4 h-4" />
          Lesões ou limitações físicas
        </Label>
        <p className="text-sm text-muted-foreground">
          Selecione áreas do corpo com lesões ou limitações
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {injuryOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`injury-${option.value}`}
                checked={data.injuries.includes(option.value)}
                onCheckedChange={(checked) => handleInjuryChange(option.value, checked as boolean)}
              />
              <Label
                htmlFor={`injury-${option.value}`}
                className="text-sm text-foreground cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Health Summary */}
      {(data.medicalConditions.length > 0 || data.injuries.length > 0 || data.medications.length > 0) && (
        <Card className="bg-red-500/10 border border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h4 className="font-medium text-red-400">Informações de saúde importantes</h4>
                <div className="text-sm text-red-300 mt-1">
                  {data.medicalConditions.length > 0 && (
                    <p><strong>Condições:</strong> {data.medicalConditions.join(", ")}</p>
                  )}
                  {data.medications.length > 0 && (
                    <p><strong>Medicamentos:</strong> {data.medications.join(", ")}</p>
                  )}
                  {data.injuries.length > 0 && (
                    <p><strong>Lesões:</strong> {data.injuries.join(", ")}</p>
                  )}
                </div>
                <p className="text-xs text-red-300 mt-2">
                  <strong>Importante:</strong> Consulte sempre um médico antes de iniciar qualquer programa de exercícios. 
                  Nossas sugestões são gerais e não substituem orientação médica profissional.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <p className="text-sm text-blue-400">
          <strong>🏥 Segurança:</strong> Essas informações nos ajudam a criar treinos seguros e adequados ao seu perfil de saúde. 
          Sempre consulte um médico antes de iniciar novos exercícios.
        </p>
      </div>
    </div>
  );
};

export default HealthInfoStep;
