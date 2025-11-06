import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Target, TrendingUp, Calendar, Plus, Edit, Trash2, CheckCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useGoals, Goal } from "@/hooks/useGoals";
import { geminiService } from "@/services/geminiService";
import { toast } from "@/hooks/use-toast";

const GoalsTracking = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const { goals, loading, createGoal, updateGoal, deleteGoal, updateGoalProgress } = useGoals();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [goalForm, setGoalForm] = useState({
    title: "",
    description: "",
    category: "general" as Goal['category'],
    target_value: "",
    current_value: "",
    unit: "",
    target_date: "",
  });

  const goalCategories = [
    { value: "weight", label: "Peso", icon: "⚖️" },
    { value: "fitness", label: "Fitness", icon: "💪" },
    { value: "nutrition", label: "Nutrição", icon: "🥗" },
    { value: "general", label: "Geral", icon: "🎯" }
  ];

  const unitOptions = {
    weight: ["kg", "g"],
    fitness: ["min", "reps", "sets", "km", "dias"],
    nutrition: ["kcal", "g", "ml", "porções"],
    general: ["unidades", "vezes", "dias", "%"]
  };


  const handleSaveGoal = async () => {
    if (!goalForm.title || !goalForm.target_value || !goalForm.target_date) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha pelo menos título, valor alvo e data",
        variant: "destructive",
      });
      return;
    }

    const goalData = {
      title: goalForm.title,
      description: goalForm.description,
      category: goalForm.category,
      target_value: parseFloat(goalForm.target_value),
      current_value: parseFloat(goalForm.current_value) || 0,
      unit: goalForm.unit,
      target_date: goalForm.target_date,
    };

    if (editingGoal) {
      await updateGoal(editingGoal.id, goalData);
    } else {
      await createGoal(goalData);
    }

    resetForm();
    setIsDialogOpen(false);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setGoalForm({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      target_value: goal.target_value.toString(),
      current_value: goal.current_value.toString(),
      unit: goal.unit,
      target_date: goal.target_date,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteGoal = async (goalId: string) => {
    await deleteGoal(goalId);
  };

  const handleCompleteGoal = async (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (goal) {
      await updateGoal(goalId, { 
        completed: true, 
        completed_at: new Date().toISOString() 
      });
    }
  };

  const resetForm = () => {
    setGoalForm({
      title: "",
      description: "",
      category: "general",
      target_value: "",
      current_value: "",
      unit: "",
      target_date: "",
    });
    setEditingGoal(null);
  };

  const getProgressPercentage = (goal: Goal) => {
    if (goal.completed) return 100;
    return Math.min((goal.current_value / goal.target_value) * 100, 100);
  };

  const getDaysRemaining = (targetDate: string) => {
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getCategoryIcon = (category: Goal['category']) => {
    return goalCategories.find(cat => cat.value === category)?.icon || "🎯";
  };

  const getCategoryLabel = (category: Goal['category']) => {
    return goalCategories.find(cat => cat.value === category)?.label || "Geral";
  };

  const generateGoalSuggestions = async () => {
    if (!profile) return;
    
    setIsGeneratingSuggestions(true);
    try {
      const suggestions = await geminiService.generateGoalSuggestions({
        age: profile.age || 25,
        weight: profile.weight || 70,
        height: profile.height || 170,
        gender: profile.gender || 'other',
        activity_level: profile.activity_level || 'moderate',
        fitness_goal: profile.fitness_goal || 'general_fitness',
        allergies: profile.allergies || [],
        dietary_restrictions: profile.dietary_restrictions || []
      });
      
      setSuggestions(suggestions);
      toast({
        title: "Sugestões geradas!",
        description: "Confira as metas personalizadas criadas pela IA",
      });
    } catch (error) {
      console.error('Error generating suggestions:', error);
      toast({
        title: "Erro ao gerar sugestões",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  const applySuggestion = (suggestion: string) => {
    setGoalForm(prev => ({
      ...prev,
      title: suggestion,
      description: `Meta sugerida pela IA: ${suggestion}`
    }));
    setIsDialogOpen(true);
  };

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
              Metas e Acompanhamento
            </h1>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={generateGoalSuggestions}
              disabled={isGeneratingSuggestions}
              variant="outline"
              className="btn-secondary"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isGeneratingSuggestions ? "Gerando..." : "Sugestões IA"}
            </Button>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  onClick={resetForm}
                  className="btn-primary"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Meta
                </Button>
              </DialogTrigger>
            <DialogContent className="glass-card border border-white/10">
              <DialogHeader>
                <DialogTitle>
                  {editingGoal ? "Editar Meta" : "Nova Meta"}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título da Meta</Label>
                  <Input
                    id="title"
                    value={goalForm.title}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Ex: Perder 5kg"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={goalForm.description}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Descreva sua meta..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select value={goalForm.category} onValueChange={(value) => setGoalForm(prev => ({ ...prev, category: value as Goal['category'] }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {goalCategories.map(category => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.icon} {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unidade</Label>
                    <Select value={goalForm.unit} onValueChange={(value) => setGoalForm(prev => ({ ...prev, unit: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {unitOptions[goalForm.category].map(unit => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="target_value">Valor Alvo</Label>
                    <Input
                      id="target_value"
                      type="number"
                      value={goalForm.target_value}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, target_value: e.target.value }))}
                      placeholder="Ex: 70"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="current_value">Valor Atual</Label>
                    <Input
                      id="current_value"
                      type="number"
                      value={goalForm.current_value}
                      onChange={(e) => setGoalForm(prev => ({ ...prev, current_value: e.target.value }))}
                      placeholder="Ex: 75"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="target_date">Data Alvo</Label>
                  <Input
                    id="target_date"
                    type="date"
                    value={goalForm.target_date}
                    onChange={(e) => setGoalForm(prev => ({ ...prev, target_date: e.target.value }))}
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSaveGoal} className="btn-primary flex-1">
                    {editingGoal ? "Atualizar" : "Criar"} Meta
                  </Button>
                  <Button onClick={() => setIsDialogOpen(false)} variant="outline">
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass-card border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-muted-foreground">Total de Metas</span>
              </div>
              <div className="text-2xl font-bold text-foreground mt-1">
                {goals.length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-muted-foreground">Concluídas</span>
              </div>
              <div className="text-2xl font-bold text-foreground mt-1">
                {goals.filter(g => g.completed).length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <span className="text-sm text-muted-foreground">Em Progresso</span>
              </div>
              <div className="text-2xl font-bold text-foreground mt-1">
                {goals.filter(g => !g.completed).length}
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card border border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-500" />
                <span className="text-sm text-muted-foreground">Taxa de Sucesso</span>
              </div>
              <div className="text-2xl font-bold text-foreground mt-1">
                {goals.length > 0 ? Math.round((goals.filter(g => g.completed).length / goals.length) * 100) : 0}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <Card className="glass-card border border-white/10 mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-500" />
                Sugestões Personalizadas da IA
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <span className="text-sm text-foreground">{suggestion}</span>
                    <Button
                      size="sm"
                      onClick={() => applySuggestion(suggestion)}
                      className="btn-primary"
                    >
                      Usar
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Goals List */}
        <div className="space-y-4">
          {goals.length === 0 ? (
            <Card className="glass-card border border-white/10">
              <CardContent className="p-8 text-center">
                <Target className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Nenhuma meta definida
                </h3>
                <p className="text-muted-foreground mb-4">
                  Crie sua primeira meta para começar a acompanhar seu progresso
                </p>
                <Button onClick={() => setIsDialogOpen(true)} className="btn-primary">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Meta
                </Button>
              </CardContent>
            </Card>
          ) : (
            goals.map((goal) => (
              <Card key={goal.id} className="glass-card border border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {getCategoryIcon(goal.category)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {goal.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {goal.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary">
                            {getCategoryLabel(goal.category)}
                          </Badge>
                          {goal.completed && (
                            <Badge variant="default" className="bg-green-500">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Concluída
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditGoal(goal)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteGoal(goal.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        Progresso: {goal.current_value} / {goal.target_value} {goal.unit}
                      </span>
                      <span className="text-muted-foreground">
                        {goal.completed ? "Concluída!" : `${getDaysRemaining(goal.target_date)} dias restantes`}
                      </span>
                    </div>
                    
                    <Progress 
                      value={getProgressPercentage(goal)} 
                      className="h-2"
                    />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Meta para: {new Date(goal.target_date).toLocaleDateString('pt-BR')}
                      </span>
                      
                      {!goal.completed && (
                        <Button
                          size="sm"
                          onClick={() => handleCompleteGoal(goal.id)}
                          className="btn-primary"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Marcar como Concluída
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default GoalsTracking;
