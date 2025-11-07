import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Sparkles, History, User, Dumbbell, Apple, 
  AlertCircle, Loader2, Trash2, Eye, LogOut,
  Scale, Ruler, Target, Activity, Crown 
} from "lucide-react";
import WorkoutDisplay from "@/components/WorkoutDisplay";
import NutritionDisplay from "@/components/NutritionDisplay";
import PWAInstallButton from "@/components/PWAInstallButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { Suggestion, SuggestionsHistory } from "@/types/auth";
import { ProfileUpdate } from "@/types/auth";

const DashboardNew = () => {
  const { user, logout, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("suggestions");
  
  // Suggestions state
  const [workoutSuggestion, setWorkoutSuggestion] = useState<Suggestion | null>(null);
  const [nutritionSuggestion, setNutritionSuggestion] = useState<Suggestion | null>(null);
  const [loadingWorkout, setLoadingWorkout] = useState(false);
  const [loadingNutrition, setLoadingNutrition] = useState(false);
  
  // History state
  const [history, setHistory] = useState<SuggestionsHistory>({ workouts: [], nutrition: [] });
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  // Profile edit state
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [profileFormData, setProfileFormData] = useState<ProfileUpdate>({});
  const [savingProfile, setSavingProfile] = useState(false);

  // Load history when switching to history tab
  useEffect(() => {
    if (activeTab === "history") {
      loadHistory();
    }
  }, [activeTab]);

  // Initialize profile form data
  useEffect(() => {
    if (user && editProfileOpen) {
      setProfileFormData({
        full_name: user.full_name,
        age: user.age,
        weight: user.weight,
        height: user.height,
        objectives: user.objectives,
        dietary_restrictions: user.dietary_restrictions || "",
        training_type: user.training_type as any,
        current_activities: user.current_activities || ""
      });
    }
  }, [user, editProfileOpen]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const data = await api.getSuggestionsHistory();
      setHistory(data);
    } catch (error) {
      console.error("Erro ao carregar histórico:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o histórico",
        variant: "destructive"
      });
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleGenerateWorkout = async () => {
    setLoadingWorkout(true);
    try {
      const suggestion = await api.generateWorkout();
      setWorkoutSuggestion(suggestion);
      toast({
        title: "Treino gerado!",
        description: "Seu plano de treino personalizado está pronto",
      });
    } catch (error: any) {
      console.error("Erro ao gerar treino:", error);
      toast({
        title: "Erro",
        description: error.response?.data?.detail || "Não foi possível gerar o treino",
        variant: "destructive"
      });
    } finally {
      setLoadingWorkout(false);
    }
  };

  const handleGenerateNutrition = async () => {
    setLoadingNutrition(true);
    try {
      const suggestion = await api.generateNutrition();
      setNutritionSuggestion(suggestion);
      toast({
        title: "Plano nutricional gerado!",
        description: "Seu plano alimentar personalizado está pronto",
      });
    } catch (error: any) {
      console.error("Erro ao gerar nutrição:", error);
      toast({
        title: "Erro",
        description: error.response?.data?.detail || "Não foi possível gerar o plano nutricional",
        variant: "destructive"
      });
    } finally {
      setLoadingNutrition(false);
    }
  };

  const handleDeleteSuggestion = async (suggestionId: string, type: string) => {
    try {
      await api.deleteSuggestion(suggestionId);
      toast({
        title: "Deletado",
        description: `${type === 'workout' ? 'Treino' : 'Plano nutricional'} deletado com sucesso`,
      });
      loadHistory();
    } catch (error) {
      console.error("Erro ao deletar sugestão:", error);
      toast({
        title: "Erro",
        description: "Não foi possível deletar",
        variant: "destructive"
      });
    }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      await api.updateProfile(profileFormData);
      await refreshProfile();
      setEditProfileOpen(false);
      toast({
        title: "Perfil atualizado!",
        description: "Suas informações foram salvas com sucesso",
      });
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error);
      toast({
        title: "Erro",
        description: error.response?.data?.detail || "Não foi possível atualizar o perfil",
        variant: "destructive"
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await api.deleteAccount();
      logout();
      toast({
        title: "Conta deletada",
        description: "Sua conta foi removida permanentemente",
      });
      navigate('/');
    } catch (error) {
      console.error("Erro ao deletar conta:", error);
      toast({
        title: "Erro",
        description: "Não foi possível deletar a conta",
        variant: "destructive"
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 glass border-b border-white/10 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-orbitron font-bold gradient-text">
              FitLife AI
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <PWAInstallButton />
            
            <Button 
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              className="text-white/80 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-poppins font-bold gradient-text mb-2">
            Olá, {user.full_name}! 
          </h1>
          <p className="text-muted-foreground text-lg">
            Bem-vindo ao seu painel personalizado
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="glass bg-white/5 border border-white/10 p-1">
            <TabsTrigger 
              value="suggestions" 
              className="data-[state=active]:bg-gradient-primary"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Sugestões IA
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="data-[state=active]:bg-gradient-primary"
            >
              <History className="w-4 h-4 mr-2" />
              Histórico
            </TabsTrigger>
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-gradient-primary"
            >
              <User className="w-4 h-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger 
              value="premium" 
              className="data-[state=active]:bg-gradient-primary"
            >
              <Crown className="w-4 h-4 mr-2" />
              Premium
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: SUGESTÕES IA */}
          <TabsContent value="suggestions" className="space-y-6">
            {/* Warning Alert */}
            <Alert className="bg-amber-500/10 border-amber-500/20">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-amber-100">
                <strong>Aviso Importante:</strong> As sugestões geradas pela IA são apenas orientações educacionais. 
                Consulte sempre um profissional de saúde antes de iniciar qualquer programa de exercícios ou dieta.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Workout Card */}
              <Card className="glass-card border border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-primary" />
                    Sugestão de Treino
                  </CardTitle>
                  <CardDescription>
                    Treino personalizado baseado no seu perfil
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {workoutSuggestion ? (
                    <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                      <WorkoutDisplay content={workoutSuggestion.content} />
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Clique no botão abaixo para gerar seu treino personalizado
                    </p>
                  )}
                  <Button 
                    onClick={handleGenerateWorkout}
                    disabled={loadingWorkout}
                    className="w-full btn-primary"
                  >
                    {loadingWorkout ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Gerando treino...
                      </>
                    ) : (
                      <>
                        <Dumbbell className="w-4 h-4 mr-2" />
                        Gerar Treino
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              {/* Nutrition Card */}
              <Card className="glass-card border border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Apple className="w-5 h-5 text-green-500" />
                    Sugestão de Nutrição
                  </CardTitle>
                  <CardDescription>
                    Plano alimentar adaptado às suas necessidades
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {nutritionSuggestion ? (
                    <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
                      <NutritionDisplay content={nutritionSuggestion.content} />
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Clique no botão abaixo para gerar seu plano nutricional
                    </p>
                  )}
                  <Button 
                    onClick={handleGenerateNutrition}
                    disabled={loadingNutrition}
                    className="w-full btn-primary"
                  >
                    {loadingNutrition ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Gerando dieta...
                      </>
                    ) : (
                      <>
                        <Apple className="w-4 h-4 mr-2" />
                        Gerar Dieta
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 2: HISTÓRICO */}
          <TabsContent value="history" className="space-y-6">
            {loadingHistory ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Workout History */}
                <Card className="glass-card border border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Dumbbell className="w-5 h-5 text-primary" />
                      Histórico de Treinos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {history.workouts.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        Nenhum treino gerado ainda
                      </p>
                    ) : (
                      history.workouts.map((workout) => (
                        <div 
                          key={workout.id}
                          className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {new Date(workout.created_at).toLocaleDateString('pt-BR')}
                            </span>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto custom-scrollbar">
                                  <DialogHeader>
                                    <DialogTitle>Treino Completo</DialogTitle>
                                  </DialogHeader>
                                  <div className="mt-4">
                                    <WorkoutDisplay content={workout.content} />
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteSuggestion(workout.id, 'workout')}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Nutrition History */}
                <Card className="glass-card border border-white/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Apple className="w-5 h-5 text-green-500" />
                      Histórico de Dietas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {history.nutrition.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        Nenhum plano nutricional gerado ainda
                      </p>
                    ) : (
                      history.nutrition.map((nutrition) => (
                        <div 
                          key={nutrition.id}
                          className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              {new Date(nutrition.created_at).toLocaleDateString('pt-BR')}
                            </span>
                            <div className="flex gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto custom-scrollbar">
                                  <DialogHeader>
                                    <DialogTitle>Plano Nutricional Completo</DialogTitle>
                                  </DialogHeader>
                                  <div className="mt-4">
                                    <NutritionDisplay content={nutrition.content} />
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDeleteSuggestion(nutrition.id, 'nutrition')}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* TAB 3: PERFIL */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Personal Info */}
              <Card className="glass-card border border-white/10 md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informações Pessoais
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Nome</p>
                      <p className="font-semibold">{user.full_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Idade</p>
                      <p className="font-semibold">{user.age} anos</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Peso</p>
                      <p className="font-semibold">{user.weight} kg</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Altura</p>
                      <p className="font-semibold">{user.height} cm</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Tipo de Treino</p>
                      <p className="font-semibold capitalize">
                        {user.training_type.replace('_', ' ')}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Objetivos</p>
                      <p className="font-semibold">{user.objectives}</p>
                    </div>
                    {user.current_activities && (
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Atividades Atuais</p>
                        <p className="font-semibold">{user.current_activities}</p>
                      </div>
                    )}
                    {user.dietary_restrictions && (
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">Restrições Alimentares</p>
                        <p className="font-semibold">{user.dietary_restrictions}</p>
                      </div>
                    )}
                  </div>

                  <Dialog open={editProfileOpen} onOpenChange={setEditProfileOpen}>
                    <DialogTrigger asChild>
                      <Button className="w-full btn-primary mt-4">
                        Editar Perfil
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Editar Perfil</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2">
                            <Label>Nome Completo</Label>
                            <Input 
                              value={profileFormData.full_name || ''}
                              onChange={(e) => setProfileFormData({...profileFormData, full_name: e.target.value})}
                            />
                          </div>
                          <div>
                            <Label>Idade</Label>
                            <Input 
                              type="number"
                              min="12"
                              max="100"
                              value={profileFormData.age || ''}
                              onChange={(e) => setProfileFormData({...profileFormData, age: parseInt(e.target.value)})}
                            />
                          </div>
                          <div>
                            <Label>Peso (kg)</Label>
                            <Input 
                              type="number"
                              step="0.1"
                              min="30"
                              max="300"
                              value={profileFormData.weight || ''}
                              onChange={(e) => setProfileFormData({...profileFormData, weight: parseFloat(e.target.value)})}
                            />
                          </div>
                          <div className="col-span-2">
                            <Label>Altura (cm)</Label>
                            <Input 
                              type="number"
                              min="120"
                              max="250"
                              value={profileFormData.height || ''}
                              onChange={(e) => setProfileFormData({...profileFormData, height: parseInt(e.target.value)})}
                            />
                          </div>
                          <div className="col-span-2">
                            <Label>Tipo de Treino</Label>
                            <Select 
                              value={profileFormData.training_type} 
                              onValueChange={(value: any) => setProfileFormData({...profileFormData, training_type: value})}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="academia">Academia</SelectItem>
                                <SelectItem value="casa">Casa</SelectItem>
                                <SelectItem value="ar_livre">Ao ar livre</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-2">
                            <Label>Objetivos</Label>
                            <Textarea 
                              value={profileFormData.objectives || ''}
                              onChange={(e) => setProfileFormData({...profileFormData, objectives: e.target.value})}
                            />
                          </div>
                          <div className="col-span-2">
                            <Label>Atividades Físicas Atuais (opcional)</Label>
                            <Textarea 
                              value={profileFormData.current_activities || ''}
                              onChange={(e) => setProfileFormData({...profileFormData, current_activities: e.target.value})}
                            />
                          </div>
                          <div className="col-span-2">
                            <Label>Restrições Alimentares (opcional)</Label>
                            <Textarea 
                              value={profileFormData.dietary_restrictions || ''}
                              onChange={(e) => setProfileFormData({...profileFormData, dietary_restrictions: e.target.value})}
                            />
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button 
                          onClick={handleSaveProfile}
                          disabled={savingProfile}
                          className="btn-primary"
                        >
                          {savingProfile ? "Salvando..." : "Salvar Alterações"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>

              {/* BMI Card */}
              <Card className="glass-card border border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scale className="w-5 h-5" />
                    IMC
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold gradient-text mb-2">
                      {user.bmi}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {user.bmi_category}
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-muted-foreground">
                      IMC = Peso / (Altura)²
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Danger Zone */}
            <Card className="glass-card border border-red-500/20 bg-red-500/5">
              <CardHeader>
                <CardTitle className="text-red-500">Zona de Perigo</CardTitle>
                <CardDescription>
                  Ações irreversíveis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={deleteAccountOpen} onOpenChange={setDeleteAccountOpen}>
                  <DialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                      Excluir Conta Permanentemente
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Tem certeza?</DialogTitle>
                      <DialogDescription>
                        Esta ação não pode ser desfeita. Todos os seus dados, incluindo histórico de treinos 
                        e planos nutricionais, serão permanentemente deletados.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setDeleteAccountOpen(false)}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        variant="destructive"
                        onClick={handleDeleteAccount}
                      >
                        Sim, deletar minha conta
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DashboardNew;
