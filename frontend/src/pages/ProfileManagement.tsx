import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save, User, Target, Activity, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "@/hooks/use-toast";

const ProfileManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, updateProfile, loading } = useProfile();
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");

  const [formData, setFormData] = useState({
    // Personal Info
    full_name: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    // Activity Level
    activity_level: "",
    // Goals
    fitness_goal: "",
    // Restrictions
    allergies: [] as string[],
    dietary_restrictions: [] as string[],
  });

  const [newAllergy, setNewAllergy] = useState("");
  const [newRestriction, setNewRestriction] = useState("");

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || "",
        age: profile.age?.toString() || "",
        gender: profile.gender || "",
        height: profile.height?.toString() || "",
        weight: profile.weight?.toString() || "",
        activity_level: profile.activity_level || "",
        fitness_goal: profile.fitness_goal || "",
        allergies: profile.allergies || [],
        dietary_restrictions: profile.dietary_restrictions || [],
      });
    }
  }, [profile]);

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const profileUpdate = {
        full_name: formData.full_name || undefined,
        age: parseInt(formData.age) || undefined,
        gender: formData.gender as 'male' | 'female' | 'other' || undefined,
        height: parseFloat(formData.height) || undefined,
        weight: parseFloat(formData.weight) || undefined,
        activity_level: formData.activity_level as any || undefined,
        fitness_goal: formData.fitness_goal as any || undefined,
        allergies: formData.allergies,
        dietary_restrictions: formData.dietary_restrictions,
      };

      // Remove undefined values
      Object.keys(profileUpdate).forEach(key => {
        if (profileUpdate[key as keyof typeof profileUpdate] === undefined) {
          delete profileUpdate[key as keyof typeof profileUpdate];
        }
      });

      const { error } = await updateProfile(profileUpdate);
      
      if (!error) {
        toast({
          title: "Perfil atualizado!",
          description: "Suas informações foram salvas com sucesso",
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const addAllergy = () => {
    if (newAllergy.trim() && !formData.allergies.includes(newAllergy.trim())) {
      setFormData(prev => ({
        ...prev,
        allergies: [...prev.allergies, newAllergy.trim()]
      }));
      setNewAllergy("");
    }
  };

  const removeAllergy = (allergy: string) => {
    setFormData(prev => ({
      ...prev,
      allergies: prev.allergies.filter(a => a !== allergy)
    }));
  };

  const addRestriction = () => {
    if (newRestriction.trim() && !formData.dietary_restrictions.includes(newRestriction.trim())) {
      setFormData(prev => ({
        ...prev,
        dietary_restrictions: [...prev.dietary_restrictions, newRestriction.trim()]
      }));
      setNewRestriction("");
    }
  };

  const removeRestriction = (restriction: string) => {
    setFormData(prev => ({
      ...prev,
      dietary_restrictions: prev.dietary_restrictions.filter(r => r !== restriction)
    }));
  };

  const activityLevels = [
    { value: "sedentary", label: "Sedentário" },
    { value: "light", label: "Leve" },
    { value: "moderate", label: "Moderado" },
    { value: "active", label: "Ativo" },
    { value: "very_active", label: "Muito Ativo" }
  ];

  const fitnessGoals = [
    { value: "lose_weight", label: "Perder Peso" },
    { value: "gain_muscle", label: "Ganhar Massa Muscular" },
    { value: "maintain_weight", label: "Manter Peso" },
    { value: "improve_endurance", label: "Melhorar Resistência" },
    { value: "general_fitness", label: "Fitness Geral" }
  ];

  const genderOptions = [
    { value: "male", label: "Masculino" },
    { value: "female", label: "Feminino" },
    { value: "other", label: "Outro" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 glass border-b border-white/10 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/dashboard')}
              className="text-white/80 hover:text-white"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div className="h-6 w-px bg-white/20" />
            <h1 className="text-xl font-poppins font-bold gradient-text">
              Gerenciar Perfil
            </h1>
          </div>
          
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Salvando..." : "Salvar Alterações"}
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass bg-white/5 border border-white/10">
            <TabsTrigger value="personal" className="data-[state=active]:bg-gradient-primary">
              <User className="w-4 h-4 mr-2" />
              Informações Pessoais
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-gradient-primary">
              <Activity className="w-4 h-4 mr-2" />
              Atividade & Objetivos
            </TabsTrigger>
            <TabsTrigger value="restrictions" className="data-[state=active]:bg-gradient-primary">
              <AlertCircle className="w-4 h-4 mr-2" />
              Restrições
            </TabsTrigger>
          </TabsList>

          {/* Personal Information Tab */}
          <TabsContent value="personal" className="space-y-6">
            <Card className="glass-card border border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Informações Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Nome Completo</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age">Idade</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                      placeholder="Sua idade"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gênero</Label>
                    <Select value={formData.gender} onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione seu gênero" />
                      </SelectTrigger>
                      <SelectContent>
                        {genderOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="height">Altura (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      value={formData.height}
                      onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                      placeholder="Sua altura em cm"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={formData.weight}
                      onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                      placeholder="Seu peso em kg"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity & Goals Tab */}
          <TabsContent value="activity" className="space-y-6">
            <Card className="glass-card border border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Nível de Atividade
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="activity_level">Seu nível de atividade física</Label>
                  <Select value={formData.activity_level} onValueChange={(value) => setFormData(prev => ({ ...prev, activity_level: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu nível de atividade" />
                    </SelectTrigger>
                    <SelectContent>
                      {activityLevels.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Objetivo Fitness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="fitness_goal">Seu objetivo principal</Label>
                  <Select value={formData.fitness_goal} onValueChange={(value) => setFormData(prev => ({ ...prev, fitness_goal: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu objetivo" />
                    </SelectTrigger>
                    <SelectContent>
                      {fitnessGoals.map(goal => (
                        <SelectItem key={goal.value} value={goal.value}>
                          {goal.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Restrictions Tab */}
          <TabsContent value="restrictions" className="space-y-6">
            <Card className="glass-card border border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Alergias Alimentares
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    placeholder="Digite uma alergia"
                    onKeyPress={(e) => e.key === 'Enter' && addAllergy()}
                  />
                  <Button onClick={addAllergy} variant="outline">
                    Adicionar
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.allergies.map((allergy, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {allergy}
                      <button
                        onClick={() => removeAllergy(allergy)}
                        className="ml-1 hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card border border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Restrições Alimentares
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newRestriction}
                    onChange={(e) => setNewRestriction(e.target.value)}
                    placeholder="Digite uma restrição"
                    onKeyPress={(e) => e.key === 'Enter' && addRestriction()}
                  />
                  <Button onClick={addRestriction} variant="outline">
                    Adicionar
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {formData.dietary_restrictions.map((restriction, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {restriction}
                      <button
                        onClick={() => removeRestriction(restriction)}
                        className="ml-1 hover:text-red-500"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ProfileManagement;
