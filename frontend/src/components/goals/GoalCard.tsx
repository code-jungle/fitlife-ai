import { Edit, Trash2, CheckCircle, Calendar, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Goal } from "@/hooks/useGoals";

interface GoalCardProps {
  goal: Goal;
  onEdit: (goal: Goal) => void;
  onDelete: (goalId: string) => void;
  onUpdateProgress: (goalId: string, currentValue: number) => void;
  getProgressPercentage: (current: number, target: number) => number;
  getDaysUntilTarget: (targetDate: string) => number;
  getGoalStatus: (goal: Goal) => string;
}

const GoalCard = ({ 
  goal, 
  onEdit, 
  onDelete, 
  onUpdateProgress, 
  getProgressPercentage, 
  getDaysUntilTarget, 
  getGoalStatus 
}: GoalCardProps) => {
  const progressPercentage = getProgressPercentage(goal.current_value, goal.target_value);
  const daysLeft = getDaysUntilTarget(goal.target_date);
  const status = getGoalStatus(goal);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'overdue':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'urgent':
        return 'bg-orange-500/20 text-orange-500 border-orange-500/30';
      default:
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'overdue':
        return 'Atrasada';
      case 'urgent':
        return 'Urgente';
      default:
        return 'Ativa';
    }
  };

  return (
    <Card className="glass-card border border-white/10 hover-lift group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg font-poppins gradient-text">
                {goal.title}
              </CardTitle>
              {goal.completed && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
            </div>
            {goal.description && (
              <p className="text-sm text-muted-foreground mb-3">
                {goal.description}
              </p>
            )}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                {goal.current_value} / {goal.target_value} {goal.unit}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {daysLeft > 0 ? `${daysLeft} dias restantes` : 'Prazo vencido'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(status)}>
              {getStatusText(status)}
            </Badge>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(goal)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(goal.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progresso</span>
              <span className="text-foreground font-medium">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {!goal.completed && (
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={() => onUpdateProgress(goal.id, goal.current_value + 1)}
                className="flex-1"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Atualizar Progresso
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GoalCard;

