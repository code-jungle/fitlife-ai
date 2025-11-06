import { User, Calendar, Ruler, Weight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useProfileContext } from "@/contexts/ProfileContext";
import { Gender } from "@/types/profile";

const PersonalInfoStepRefactored = () => {
  const { profileData, updateProfileData } = useProfileContext();

  const handleGenderSelect = (gender: Gender) => {
    updateProfileData({ gender });
  };

  const handleInputChange = (field: keyof typeof profileData, value: string) => {
    updateProfileData({ [field]: value });
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
            variant={profileData.gender === "male" ? "default" : "outline"}
            className={`h-12 ${profileData.gender === "male" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => handleGenderSelect("male")}
          >
            <User className="w-5 h-5 mr-2" />
            Masculino
          </Button>
          <Button
            type="button"
            variant={profileData.gender === "female" ? "default" : "outline"}
            className={`h-12 ${profileData.gender === "female" ? "btn-primary" : "btn-secondary"}`}
            onClick={() => handleGenderSelect("female")}
          >
            <User className="w-5 h-5 mr-2" />
            Feminino
          </Button>
        </div>
      </div>

      {/* Age */}
      <div className="space-y-2">
        <Label htmlFor="age" className="text-foreground font-medium">
          Idade <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            id="age"
            type="number"
            placeholder="Ex: 25"
            value={profileData.age || ""}
            onChange={(e) => handleInputChange("age", e.target.value)}
            className="pl-10 h-12"
            min="13"
            max="120"
          />
        </div>
      </div>

      {/* Height and Weight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="height" className="text-foreground font-medium">
            Altura (cm) <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="height"
              type="number"
              placeholder="Ex: 175"
              value={profileData.height || ""}
              onChange={(e) => handleInputChange("height", e.target.value)}
              className="pl-10 h-12"
              min="100"
              max="250"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="weight" className="text-foreground font-medium">
            Peso (kg) <span className="text-red-500">*</span>
          </Label>
          <div className="relative">
            <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="weight"
              type="number"
              placeholder="Ex: 70"
              value={profileData.weight || ""}
              onChange={(e) => handleInputChange("weight", e.target.value)}
              className="pl-10 h-12"
              min="30"
              max="300"
              step="0.1"
            />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
        <p className="text-sm text-blue-200">
          💡 <strong>Dica:</strong> Essas informações nos ajudam a calcular suas necessidades calóricas e criar planos personalizados para você.
        </p>
      </div>
    </div>
  );
};

export default PersonalInfoStepRefactored;

