import { User, Calendar, Ruler, Weight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ProfileStepProps, Gender } from "@/types/profile";

interface PersonalInfoStepProps extends ProfileStepProps {}

const PersonalInfoStep = ({ data, updateData }: PersonalInfoStepProps) => {
  const handleGenderSelect = (gender: string) => {
    updateData({ ...data, gender });
  };

  return (
    <div className="space-y-6">
      {/* Gender Selection */}
      <div className="space-y-3">
        <Label className="text-foreground font-medium">
          Gênero <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <Button
            type="button"
            variant={data.gender === "male" ? "default" : "outline"}
            className={`h-12 ${data.gender === "male" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => handleGenderSelect("male")}
          >
            <User className="w-5 h-5 mr-2" />
            Masculino
          </Button>
          <Button
            type="button"
            variant={data.gender === "female" ? "default" : "outline"}
            className={`h-12 ${data.gender === "female" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => handleGenderSelect("female")}
          >
            <User className="w-5 h-5 mr-2" />
            Feminino
          </Button>
        </div>
      </div>

      {/* Age */}
      <div className="space-y-2">
        <Label htmlFor="age" className="text-foreground">
          Idade <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="age"
            type="number"
            placeholder="25"
            className="pl-10 glass bg-white/5 border-white/10 text-foreground"
            value={data.age}
            onChange={(e) => updateData({ ...data, age: e.target.value })}
            min="16"
            max="100"
          />
        </div>
      </div>

      {/* Height */}
      <div className="space-y-2">
        <Label htmlFor="height" className="text-foreground">
          Altura (cm) <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="height"
            type="number"
            placeholder="175"
            className="pl-10 glass bg-white/5 border-white/10 text-foreground"
            value={data.height}
            onChange={(e) => updateData({ ...data, height: e.target.value })}
            min="140"
            max="220"
          />
        </div>
      </div>

      {/* Weight */}
      <div className="space-y-2">
        <Label htmlFor="weight" className="text-foreground">
          Peso (kg) <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            id="weight"
            type="number"
            placeholder="70"
            className="pl-10 glass bg-white/5 border-white/10 text-foreground"
            value={data.weight}
            onChange={(e) => updateData({ ...data, weight: e.target.value })}
            min="30"
            max="200"
            step="0.1"
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;