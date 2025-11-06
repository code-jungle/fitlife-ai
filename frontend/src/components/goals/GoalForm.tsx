import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GoalFormData } from "@/hooks/useGoalsTracking";

interface GoalFormProps {
  isOpen: boolean;
  onClose: () => void;
  formData: GoalFormData;
  setFormData: (data: GoalFormData) => void;
  goalCategories: Array<{ value: string; label: string; icon: string }>;
  unitOptions: Record<string, string[]>;
  onSubmit: (data: GoalFormData) => void;
  isEditing: boolean;
}

const GoalForm = ({
  isOpen,
  onClose,
  formData,
  setFormData,
  goalCategories,
  unitOptions,
  onSubmit,
  isEditing
}: GoalFormProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof GoalFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Meta' : 'Nova Meta'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título da Meta</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Ex: Perder 5kg"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Descreva sua meta..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {goalCategories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    <span className="flex items-center gap-2">
                      <span>{category.icon}</span>
                      {category.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="target_value">Valor Alvo</Label>
              <Input
                id="target_value"
                type="number"
                value={formData.target_value}
                onChange={(e) => handleInputChange('target_value', e.target.value)}
                placeholder="100"
                required
              />
            </div>
            <div>
              <Label htmlFor="current_value">Valor Atual</Label>
              <Input
                id="current_value"
                type="number"
                value={formData.current_value}
                onChange={(e) => handleInputChange('current_value', e.target.value)}
                placeholder="0"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="unit">Unidade</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => handleInputChange('unit', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {unitOptions[formData.category]?.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="target_date">Data Alvo</Label>
              <Input
                id="target_date"
                type="date"
                value={formData.target_date}
                onChange={(e) => handleInputChange('target_date', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? 'Atualizar Meta' : 'Criar Meta'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GoalForm;

