import { GoogleGenerativeAI } from '@google/generative-ai';

// Configuração do Gemini
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface UserProfile {
  age: number;
  weight: number;
  height: number;
  gender: 'male' | 'female' | 'other';
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  fitness_goal: 'lose_weight' | 'gain_muscle' | 'maintain_weight' | 'improve_endurance' | 'general_fitness';
  gym_days_per_week: number;
  allergies?: string[];
  dietary_restrictions?: string[];
}

export interface WorkoutPlan {
  name: string;
  description: string;
  duration_minutes: number;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  exercises: Array<{
    name: string;
    description: string;
    sets: number;
    reps: string;
    rest_seconds: number;
    muscle_groups: string[];
    equipment: string;
  }>;
}

export interface NutritionPlan {
  name: string;
  description: string;
  total_calories: number;
  meals: Array<{
    name: string;
    time: string;
    calories: number;
    foods: Array<{
      name: string;
      quantity: string;
      calories: number;
      protein: number;
      carbs: number;
      fat: number;
    }>;
  }>;
}

export interface GeminiError extends Error {
  code: string;
  retryable: boolean;
}

class GeminiService {
  private async generateContent(prompt: string, maxRetries: number = 3): Promise<string> {
    // Verificar se a API key está configurada
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      const error = new Error('Chave da API do Gemini não configurada') as GeminiError;
      error.code = 'MISSING_API_KEY';
      error.retryable = false;
      throw error;
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        if (!text || text.trim().length === 0) {
          throw new Error('Resposta vazia da IA');
        }
        
        return text;
      } catch (error: unknown) {
        console.error(`Erro na tentativa ${attempt}:`, error);
        
        // Verificar se é erro 503 (Service Unavailable)
        if (error instanceof Error && (error.message?.includes('503') || error.message?.includes('overloaded'))) {
          if (attempt < maxRetries) {
            const delay = attempt * 2000; // 2s, 4s, 6s
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          } else {
            const geminiError = new Error('Serviço de IA sobrecarregado. Tente novamente em alguns minutos.') as GeminiError;
            geminiError.code = 'SERVICE_OVERLOADED';
            geminiError.retryable = true;
            throw geminiError;
          }
        }
        
        // Verificar se é erro de rate limit
        if (error instanceof Error && error.message?.includes('429')) {
          const geminiError = new Error('Muitas requisições. Aguarde um momento antes de tentar novamente.') as GeminiError;
          geminiError.code = 'RATE_LIMIT';
          geminiError.retryable = true;
          throw geminiError;
        }
        
        // Verificar se é erro de autenticação
        if (error instanceof Error && error.message?.includes('401')) {
          const geminiError = new Error('Chave da API inválida. Verifique as configurações.') as GeminiError;
          geminiError.code = 'INVALID_API_KEY';
          geminiError.retryable = false;
          throw geminiError;
        }
        
        // Para outros erros, falha imediatamente
        const geminiError = new Error('Falha na comunicação com a IA') as GeminiError;
        geminiError.code = 'COMMUNICATION_ERROR';
        geminiError.retryable = true;
        throw geminiError;
      }
    }
    
    const error = new Error('Falha na comunicação com a IA após múltiplas tentativas') as GeminiError;
    error.code = 'MAX_RETRIES_EXCEEDED';
    error.retryable = false;
    throw error;
  }

  private parseWorkoutPlan(text: string): WorkoutPlan {
    try {
      // Tentar extrair JSON do texto retornado
      let jsonMatch = text.match(/\{[\s\S]*\}/);
      
      // Se não encontrar, tentar encontrar entre ```json e ```
      if (!jsonMatch) {
        const codeBlockMatch = text.match(/```json\s*(\{[\s\S]*?\})\s*```/);
        if (codeBlockMatch) {
          jsonMatch = [codeBlockMatch[1]];
        }
      }
      
      // Se ainda não encontrar, tentar encontrar qualquer JSON válido
      if (!jsonMatch) {
        const anyJsonMatch = text.match(/\{[\s\S]*?\}/);
        if (anyJsonMatch) {
          jsonMatch = anyJsonMatch;
        }
      }
      
      if (!jsonMatch) {
        throw new Error('Formato de resposta inválido');
      }
      
      const workoutData = JSON.parse(jsonMatch[0]);
      
      // Validar dados obrigatórios
      if (!workoutData.name || !workoutData.exercises || !Array.isArray(workoutData.exercises)) {
        throw new Error('Dados de treino inválidos');
      }
      
      return {
        name: workoutData.name || 'Treino Personalizado',
        description: workoutData.description || 'Treino gerado pela IA baseado no seu perfil',
        duration_minutes: workoutData.duration_minutes || 60,
        difficulty_level: workoutData.difficulty_level || 'intermediate',
        exercises: workoutData.exercises || []
      };
    } catch (error) {
      console.error('Erro ao fazer parse do treino:', error);
      
      // Retornar plano padrão em caso de erro
      return {
        name: 'Treino Personalizado',
        description: 'Treino gerado pela IA baseado no seu perfil',
        duration_minutes: 60,
        difficulty_level: 'intermediate',
        exercises: []
      };
    }
  }

  private parseMultipleWorkoutPlans(text: string): WorkoutPlan[] {
    try {
      // Tentar extrair JSON do texto retornado
      let jsonMatch = text.match(/\[[\s\S]*\]/);
      
      // Se não encontrar, tentar encontrar entre ```json e ```
      if (!jsonMatch) {
        const codeBlockMatch = text.match(/```json\s*(\[[\s\S]*?\])\s*```/);
        if (codeBlockMatch) {
          jsonMatch = [codeBlockMatch[1]];
        }
      }
      
      // Se ainda não encontrar, tentar encontrar qualquer JSON válido
      if (!jsonMatch) {
        const anyJsonMatch = text.match(/\[[\s\S]*?\]/);
        if (anyJsonMatch) {
          jsonMatch = anyJsonMatch;
        }
      }
      
      if (!jsonMatch) {
        throw new Error('Formato de resposta inválido');
      }
      
      const workoutPlans = JSON.parse(jsonMatch[0]);
      
      // Validar se é array
      if (!Array.isArray(workoutPlans)) {
        throw new Error('Formato de resposta inválido - esperado array');
      }
      
      // Processar cada plano
      return workoutPlans.map(plan => this.parseWorkoutPlan(JSON.stringify(plan)));
    } catch (error) {
      console.error('Erro ao fazer parse dos treinos:', error);
      
      // Retornar array com plano padrão em caso de erro
      return [this.parseWorkoutPlan('{}')];
    }
  }

  private parseNutritionPlan(text: string): NutritionPlan {
    try {
      // Tentar extrair JSON do texto retornado
      let jsonMatch = text.match(/\{[\s\S]*\}/);
      
      // Se não encontrar, tentar encontrar entre ```json e ```
      if (!jsonMatch) {
        const codeBlockMatch = text.match(/```json\s*(\{[\s\S]*?\})\s*```/);
        if (codeBlockMatch) {
          jsonMatch = [codeBlockMatch[1]];
        }
      }
      
      // Se ainda não encontrar, tentar encontrar qualquer JSON válido
      if (!jsonMatch) {
        const anyJsonMatch = text.match(/\{[\s\S]*?\}/);
        if (anyJsonMatch) {
          jsonMatch = anyJsonMatch;
        }
      }
      
      if (!jsonMatch) {
        throw new Error('Formato de resposta inválido');
      }
      
      const nutritionData = JSON.parse(jsonMatch[0]);
      
      // Validar dados obrigatórios
      if (!nutritionData.name || !nutritionData.meals || !Array.isArray(nutritionData.meals)) {
        throw new Error('Dados nutricionais inválidos');
      }
      
      return {
        name: nutritionData.name || 'Plano Nutricional Personalizado',
        description: nutritionData.description || 'Plano gerado pela IA baseado no seu perfil',
        total_calories: nutritionData.total_calories || 2000,
        meals: nutritionData.meals || []
      };
    } catch (error) {
      console.error('Erro ao fazer parse do plano nutricional:', error);
      
      // Retornar plano padrão em caso de erro
      return {
        name: 'Plano Nutricional Personalizado',
        description: 'Plano gerado pela IA baseado no seu perfil',
        total_calories: 2000,
        meals: []
      };
    }
  }

  async generateWorkoutPlan(profile: UserProfile): Promise<WorkoutPlan> {
    try {
      const prompt = `Crie um plano de treino personalizado baseado no perfil do usuário:
      
      Perfil:
      - Idade: ${profile.age} anos
      - Peso: ${profile.weight} kg
      - Altura: ${profile.height} cm
      - Gênero: ${profile.gender}
      - Nível de atividade: ${profile.activity_level}
      - Objetivo: ${profile.fitness_goal}
      - Dias na academia por semana: ${profile.gym_days_per_week}
      - Alergias: ${profile.allergies?.join(', ') || 'Nenhuma'}
      - Restrições alimentares: ${profile.dietary_restrictions?.join(', ') || 'Nenhuma'}

      Retorne um JSON com o seguinte formato:
      {
        "name": "Nome do treino",
        "description": "Descrição do treino",
        "duration_minutes": 60,
        "difficulty_level": "beginner|intermediate|advanced",
        "exercises": [
          {
            "name": "Nome do exercício",
            "description": "Descrição do exercício",
            "sets": 3,
            "reps": "10-12",
            "rest_seconds": 60,
            "muscle_groups": ["peito", "tríceps"],
            "equipment": "halteres"
          }
        ]
      }`;

      const response = await this.generateContent(prompt);
      return this.parseWorkoutPlan(response);
    } catch (error) {
      console.error('Erro ao gerar plano de treino:', error);
      throw error;
    }
  }

  async generateMultipleWorkoutPlans(profile: UserProfile): Promise<WorkoutPlan[]> {
    try {
      const prompt = `Crie ${profile.gym_days_per_week} planos de treino diferentes (A, B, C, etc.) baseados no perfil do usuário:
      
      Perfil:
      - Idade: ${profile.age} anos
      - Peso: ${profile.weight} kg
      - Altura: ${profile.height} cm
      - Gênero: ${profile.gender}
      - Nível de atividade: ${profile.activity_level}
      - Objetivo: ${profile.fitness_goal}
      - Dias na academia por semana: ${profile.gym_days_per_week}
      - Alergias: ${profile.allergies?.join(', ') || 'Nenhuma'}
      - Restrições alimentares: ${profile.dietary_restrictions?.join(', ') || 'Nenhuma'}

      Retorne um JSON array com o seguinte formato:
      [
        {
          "name": "Treino A - Peito e Tríceps",
          "description": "Descrição do treino",
          "duration_minutes": 60,
          "difficulty_level": "beginner|intermediate|advanced",
          "exercises": [...]
        },
        {
          "name": "Treino B - Costas e Bíceps",
          "description": "Descrição do treino",
          "duration_minutes": 60,
          "difficulty_level": "beginner|intermediate|advanced",
          "exercises": [...]
        }
      ]`;

      const response = await this.generateContent(prompt);
      return this.parseMultipleWorkoutPlans(response);
    } catch (error) {
      console.error('Erro ao gerar múltiplos planos de treino:', error);
      throw error;
    }
  }

  async generateNutritionPlan(profile: UserProfile): Promise<NutritionPlan> {
    try {
      const prompt = `Crie um plano nutricional personalizado baseado no perfil do usuário:
      
      Perfil:
      - Idade: ${profile.age} anos
      - Peso: ${profile.weight} kg
      - Altura: ${profile.height} cm
      - Gênero: ${profile.gender}
      - Nível de atividade: ${profile.activity_level}
      - Objetivo: ${profile.fitness_goal}
      - Dias na academia por semana: ${profile.gym_days_per_week}
      - Alergias: ${profile.allergies?.join(', ') || 'Nenhuma'}
      - Restrições alimentares: ${profile.dietary_restrictions?.join(', ') || 'Nenhuma'}

      Retorne um JSON com o seguinte formato:
      {
        "name": "Nome do plano nutricional",
        "description": "Descrição do plano",
        "total_calories": 2000,
        "meals": [
          {
            "name": "Café da Manhã",
            "time": "07:00",
            "calories": 500,
            "foods": [
              {
                "name": "Aveia",
                "quantity": "50g",
                "calories": 200,
                "protein": 8,
                "carbs": 35,
                "fat": 4
              }
            ]
          }
        ]
      }`;

      const response = await this.generateContent(prompt);
      return this.parseNutritionPlan(response);
    } catch (error) {
      console.error('Erro ao gerar plano nutricional:', error);
      throw error;
    }
  }

  async generateGoalSuggestions(profile: UserProfile): Promise<string[]> {
    try {
      const prompt = `Com base no perfil do usuário, sugira 5 metas de fitness específicas e alcançáveis:
      
      Perfil:
      - Idade: ${profile.age} anos
      - Peso: ${profile.weight} kg
      - Altura: ${profile.height} cm
      - Gênero: ${profile.gender}
      - Nível de atividade: ${profile.activity_level}
      - Objetivo: ${profile.fitness_goal}
      - Dias na academia por semana: ${profile.gym_days_per_week}

      Retorne um JSON array com strings:
      ["Meta 1", "Meta 2", "Meta 3", "Meta 4", "Meta 5"]`;

      const response = await this.generateContent(prompt);
      
      try {
        const suggestions = JSON.parse(response);
        if (Array.isArray(suggestions)) {
          return suggestions;
        }
      } catch (parseError) {
        console.error('Erro ao fazer parse das sugestões:', parseError);
      }
      
      // Fallback para sugestões padrão
      return [
        'Perder 2kg em 1 mês',
        'Treinar 3 vezes por semana',
        'Beber 2L de água por dia',
        'Dormir 8 horas por noite',
        'Comer 5 porções de frutas/verduras por dia'
      ];
    } catch (error) {
      console.error('Erro ao gerar sugestões de metas:', error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();

