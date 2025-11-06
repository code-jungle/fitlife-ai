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

class GeminiService {
  private async generateContent(prompt: string, maxRetries: number = 3): Promise<string> {
    // Verificar se a API key está configurada
    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      throw new Error('Chave da API do Gemini não configurada');
    }

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
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
            throw new Error('SERVICE_OVERLOADED');
          }
        }
        
        // Para outros erros, falha imediatamente
        throw new Error('Falha na comunicação com a IA');
      }
    }
    
    throw new Error('Falha na comunicação com a IA');
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
      
      return {
        name: workoutData.name || 'Treino Personalizado',
        description: workoutData.description || 'Treino gerado pela IA baseado no seu perfil',
        duration_minutes: workoutData.duration_minutes || 60,
        difficulty_level: workoutData.difficulty_level || 'intermediate',
        exercises: workoutData.exercises || []
      };
    } catch (error) {
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
      
      const workoutData = JSON.parse(jsonMatch[0]);
      
      if (!Array.isArray(workoutData)) {
        throw new Error('Resposta deve ser um array de treinos');
      }
      
      return workoutData.map((workout: Record<string, unknown>) => ({
        name: workout.name || 'Treino Personalizado',
        description: workout.description || 'Treino gerado pela IA',
        duration_minutes: workout.duration_minutes || 60,
        difficulty_level: workout.difficulty_level || 'intermediate',
        exercises: (workout.exercises || []).map((exercise: Record<string, unknown>, index: number) => {
          // Validar e corrigir repetições absurdas
          let reps = exercise.reps || 10;
          if (typeof reps === 'string') {
            // Se for string como "8-10", pegar o primeiro número
            const match = reps.match(/(\d+)/);
            reps = match ? parseInt(match[1]) : 10;
          }
          // Limitar a 20 repetições máximo
          if (reps > 20) {
            reps = 20;
          }
          // Garantir mínimo de 4 repetições
          if (reps < 4) {
            reps = 4;
          }
          
          return {
            ...exercise,
            reps: reps
          };
        })
      }));
    } catch (error) {
      throw new Error('Falha ao processar planos de treino');
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
      
      return {
        name: nutritionData.name || 'Plano Nutricional Personalizado',
        description: nutritionData.description || 'Plano nutricional gerado pela IA baseado no seu perfil',
        total_calories: nutritionData.total_calories || 2000,
        meals: nutritionData.meals || []
      };
    } catch (error) {
      // Retornar plano padrão em caso de erro
      return {
        name: 'Plano Nutricional Personalizado',
        description: 'Plano nutricional gerado pela IA baseado no seu perfil',
        total_calories: 2000,
        meals: []
      };
    }
  }

  async generateWorkoutPlan(profile: UserProfile): Promise<WorkoutPlan[]> {
    const prompt = `
    Você é um personal trainer especializado em criar planos de treino personalizados e realistas.
    Crie ${profile.gym_days_per_week} planos de treino diferentes baseado no perfil do usuário fornecido.

    Perfil do usuário:
    - Idade: ${profile.age} anos
    - Peso: ${profile.weight} kg
    - Altura: ${profile.height} cm
    - Gênero: ${profile.gender}
    - Nível de atividade: ${profile.activity_level}
    - Objetivo: ${profile.fitness_goal}
    - Dias na academia por semana: ${profile.gym_days_per_week}

    ESTRUTURA OBRIGATÓRIA DO TREINO:
    1. Tipo de Treino: Deve ser "Treino A", "Treino B", "Treino C", etc.
    2. Grupo Muscular: Especificar claramente (ex: "Peito e Tríceps", "Costas e Bíceps", "Pernas")
    3. Tempo Máximo: Duração total do treino (45-75 minutos)
    4. Número de Exercícios: Entre 6-8 exercícios por treino

    DETALHES DOS EXERCÍCIOS:
    - Nome do Exercício: Nome claro e específico
    - Séries e Repetições: Números realistas baseados no objetivo:
      * FORÇA: 4-6 séries de 4-8 repetições
      * HIPERTROFIA: 3-4 séries de 8-12 repetições  
      * RESISTÊNCIA: 2-3 séries de 12-20 repetições
      * REGRA OBRIGATÓRIA: MÁXIMO 20 repetições por série (nunca mais que 20)
      * EXEMPLOS CORRETOS: 8, 10, 12, 15, 18, 20 repetições
      * EXEMPLOS INCORRETOS: 50, 100, 500, 1000+ repetições
    - Descanso: Tempo realista entre séries (30-120 segundos)

    IMPORTANTE: Responda APENAS com um JSON válido no seguinte formato:
    [
      {
        "name": "Treino A - Peito e Tríceps",
        "description": "Treino focado em desenvolvimento do peitoral e tríceps",
        "duration_minutes": 60,
        "difficulty_level": "beginner|intermediate|advanced",
        "exercises": [
          {
            "name": "Supino Reto com Barra",
            "description": "Deitado no banco, segure a barra com pegada ligeiramente mais larga que os ombros. Desça controladamente até o peito e empurre para cima.",
                      "sets": 4,
                      "reps": 8,
                      "rest_seconds": 90,
            "muscle_groups": ["peito", "tríceps"],
            "equipment": "barra e banco"
          }
        ]
      }
    ]

    DIRETRIZES OBRIGATÓRIAS:
    - Crie ${profile.gym_days_per_week} treinos diferentes
    - Cada treino deve ter 6-8 exercícios
    - Repetições devem ser REALISTAS (nunca exceder 20 por série)
    - Tempo de descanso deve ser adequado ao exercício (30-120s)
    - Grupos musculares devem ser equilibrados entre os treinos
    - Nomes dos treinos devem seguir o padrão: "Treino [LETRA] - [GRUPOS MUSCULARES]"
    - Baseie as repetições no objetivo do usuário: ${profile.fitness_goal}
    - Use equipamentos básicos: halteres, barra, peso corporal, banco
    - REGRA OBRIGATÓRIA: Máximo 20 repetições por série (nunca 21, 25, 30, 50, 100, 500, 1000+)
    - Para exercícios de alta resistência, use 15-20 repetições máximo
    - NUNCA use números absurdos como 100, 500, 1000+ repetições
    - Use apenas números entre 4-20 repetições por série
    `;

    try {
      const response = await this.generateContent(prompt);
      return this.parseMultipleWorkoutPlans(response);
    } catch (error: unknown) {
      if (error.message === 'SERVICE_OVERLOADED') {
        return this.generateFallbackWorkoutPlans(profile);
      }
      throw error;
    }
  }

  private generateFallbackWorkoutPlans(profile: UserProfile): WorkoutPlan[] {
    const basePlans = [
      {
        name: 'Treino A - Peito e Tríceps',
        muscle_groups: ['Peito', 'Tríceps'],
        duration: 60,
        exercises: [
          { name: 'Supino reto com halteres', sets: 4, reps: 8, rest: 90, instructions: 'Deite no banco, segure os halteres e empurre para cima' },
          { name: 'Flexão de braço', sets: 3, reps: 12, rest: 60, instructions: 'Mantenha o corpo alinhado e desça até quase tocar o chão' },
          { name: 'Crucifixo com halteres', sets: 3, reps: 12, rest: 60, instructions: 'Deite no banco e abra os braços em movimento de crucifixo' },
          { name: 'Tríceps testa', sets: 3, reps: 10, rest: 60, instructions: 'Deite no banco e desça o haltere em direção à testa' },
          { name: 'Tríceps coice', sets: 3, reps: 12, rest: 45, instructions: 'Incline o corpo e estenda o braço para trás' },
          { name: 'Mergulho no banco', sets: 3, reps: 10, rest: 60, instructions: 'Apoie as mãos no banco e desça o corpo' }
        ]
      },
      {
        name: 'Treino B - Costas e Bíceps',
        muscle_groups: ['Costas', 'Bíceps'],
        duration: 60,
        exercises: [
          { name: 'Puxada frontal', sets: 4, reps: 8, rest: 90, instructions: 'Puxe a barra em direção ao peito, contraindo as costas' },
          { name: 'Remada curvada', sets: 4, reps: 10, rest: 90, instructions: 'Incline o tronco e puxe os halteres em direção ao abdômen' },
          { name: 'Puxada alta', sets: 3, reps: 12, rest: 60, instructions: 'Puxe a barra em direção ao peito, focando nas costas' },
          { name: 'Rosca bíceps', sets: 3, reps: 12, rest: 60, instructions: 'Mantenha os cotovelos fixos e flexione os braços' },
          { name: 'Rosca martelo', sets: 3, reps: 12, rest: 45, instructions: 'Segure os halteres como martelos e flexione os braços' },
          { name: 'Rosca concentrada', sets: 3, reps: 10, rest: 45, instructions: 'Sente-se e faça a rosca apoiando o cotovelo na coxa' }
        ]
      },
      {
        name: 'Treino C - Pernas e Ombros',
        muscle_groups: ['Pernas', 'Ombros'],
        duration: 65,
        exercises: [
          { name: 'Agachamento', sets: 4, reps: 12, rest: 90, instructions: 'Desça como se fosse sentar, mantendo o peso nos calcanhares' },
          { name: 'Afundo', sets: 3, reps: 10, rest: 60, instructions: 'Dê um passo à frente e desça até formar 90 graus' },
          { name: 'Levantamento terra', sets: 3, reps: 8, rest: 90, instructions: 'Mantenha as costas retas e levante a barra do chão' },
          { name: 'Elevação lateral', sets: 3, reps: 12, rest: 45, instructions: 'Levante os halteres lateralmente até a altura dos ombros' },
          { name: 'Desenvolvimento', sets: 3, reps: 10, rest: 60, instructions: 'Empurre os halteres para cima, acima da cabeça' },
          { name: 'Panturrilha em pé', sets: 4, reps: 15, rest: 30, instructions: 'Fique na ponta dos pés e desça lentamente' }
        ]
      }
    ];

    return basePlans.slice(0, profile.gym_days_per_week).map((plan, index) => ({
      id: `fallback-workout-${index + 1}-${Date.now()}`,
      user_id: profile.id,
      name: plan.name,
      muscle_groups: plan.muscle_groups,
      duration: plan.duration,
      difficulty: 'intermediate',
      exercises: plan.exercises.map((exercise, exerciseIndex) => ({
        id: `exercise-${exerciseIndex + 1}-${Date.now()}`,
        name: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        rest_seconds: exercise.rest,
        instructions: exercise.instructions,
        muscle_group: plan.muscle_groups[0],
        equipment: 'Halteres, Barra, Banco'
      })),
      created_at: new Date().toISOString(),
      started_at: null,
      completed_at: null
    }));
  }

  async generateNutritionPlan(profile: UserProfile): Promise<NutritionPlan> {
    const allergies = profile.allergies?.length ? `Alergias: ${profile.allergies.join(', ')}` : 'Nenhuma alergia conhecida';
    const restrictions = profile.dietary_restrictions?.length ? `Restrições: ${profile.dietary_restrictions.join(', ')}` : 'Nenhuma restrição dietética';

    const prompt = `
Você é um nutricionista especializado em criar planos alimentares personalizados.
Crie um plano nutricional baseado no perfil do usuário fornecido.

IMPORTANTE: Use SEMPRE português brasileiro em TODAS as respostas.

Perfil do usuário:
- Idade: ${profile.age} anos
- Peso: ${profile.weight} kg
- Altura: ${profile.height} cm
- Gênero: ${profile.gender}
- Nível de atividade: ${profile.activity_level}
- Objetivo: ${profile.fitness_goal}
- ${allergies}
- ${restrictions}

IMPORTANTE: Responda APENAS com um JSON válido no seguinte formato:
{
  "name": "Plano Nutricional Personalizado",
  "description": "Plano alimentar completo e balanceado para seu objetivo",
  "total_calories": 2000,
  "meals": [
    {
      "name": "Café da Manhã Energético",
      "meal_type": "Café da Manhã",
      "suggested_time": "07:00 - 08:00",
      "calories": 500,
      "protein": 25,
      "carbs": 60,
      "fat": 15,
      "fiber": 8,
      "benefits": [
        "Energia para começar o dia",
        "Saciedade prolongada",
        "Suporte ao metabolismo"
      ],
      "instructions": [
        "Misture a aveia com leite e deixe descansar por 5 minutos",
        "Adicione as frutas picadas e as sementes",
        "Misture bem e sirva imediatamente"
      ],
      "tips": [
        "Pode preparar na noite anterior e guardar na geladeira",
        "Substitua as frutas conforme a estação",
        "Adicione mel se preferir mais doce"
      ],
      "meal_foods": [
        {
          "food_name": "Aveia em flocos",
          "quantity": 50,
          "unit": "g",
          "calories_per_unit": 4
        },
        {
          "food_name": "Banana",
          "quantity": 1,
          "unit": "unidade média",
          "calories_per_unit": 90
        }
      ]
    }
  ]
}

DIRETRIZES OBRIGATÓRIAS:
- Crie EXATAMENTE 4 refeições por dia: "Café da Manhã", "Almoço", "Lanche", "Jantar"
- Para cada refeição, inclua TODAS as informações solicitadas
- Horários sugeridos realistas (ex: 07:00-08:00, 12:00-13:00, 15:00-16:00, 19:00-20:00)
- Benefícios específicos e úteis para cada refeição
- Instruções de preparo simples e práticas
- Dicas de substituições e variações
- Quantidades precisas em gramas, unidades ou medidas caseiras
- Valores nutricionais realistas e balanceados
- Foque no objetivo do usuário: ${profile.fitness_goal}
- Considere as restrições: ${restrictions}
- Use alimentos acessíveis e fáceis de encontrar
- IMPORTANTE: Use SEMPRE português brasileiro para meal_type: "Café da Manhã", "Almoço", "Lanche", "Jantar"
`;

    try {
      const response = await this.generateContent(prompt);
      return this.parseNutritionPlan(response);
    } catch (error: unknown) {
      if (error.message === 'SERVICE_OVERLOADED') {
        console.log('Usando fallback para plano nutricional...');
        return this.generateFallbackNutritionPlan(profile);
      }
      throw error;
    }
  }

  private generateFallbackNutritionPlan(profile: UserProfile): NutritionPlan {
    console.log('Gerando plano nutricional básico (fallback)...');
    
    const baseCalories = profile.gender === 'male' ? 2000 : 1800;
    const adjustedCalories = Math.round(baseCalories * (profile.activity_level === 'high' ? 1.2 : 1.0));
    
    return {
      id: `fallback-${Date.now()}`,
      user_id: profile.id,
      created_at: new Date().toISOString(),
      meals: [
        {
          id: `meal-1-${Date.now()}`,
          meal_type: 'breakfast',
          name: 'Café da Manhã Completo',
          suggested_time: '07:00-08:00',
          description: 'Refeição energética para começar o dia com disposição',
          calories: Math.round(adjustedCalories * 0.25),
          protein: 25,
          carbs: 45,
          fat: 15,
          fiber: 8,
          meal_foods: [
            { name: 'Aveia', quantity: '50g', calories: 200, protein: 7, carbs: 35, fat: 4 },
            { name: 'Banana', quantity: '1 unidade', calories: 100, protein: 1, carbs: 25, fat: 0 },
            { name: 'Leite desnatado', quantity: '200ml', calories: 80, protein: 6, carbs: 8, fat: 2 },
            { name: 'Mel', quantity: '1 colher de sopa', calories: 60, protein: 0, carbs: 15, fat: 0 }
          ],
          benefits: 'Fornece energia sustentada, proteínas para recuperação muscular e fibras para saciedade',
          instructions: 'Misture a aveia com o leite, adicione a banana cortada e finalize com mel',
          tips: 'Pode adicionar nozes ou sementes para mais proteínas e gorduras boas'
        },
        {
          id: `meal-2-${Date.now()}`,
          meal_type: 'lunch',
          name: 'Almoço Balanceado',
          suggested_time: '12:00-13:00',
          description: 'Refeição principal com carboidratos, proteínas e vegetais',
          calories: Math.round(adjustedCalories * 0.35),
          protein: 35,
          carbs: 50,
          fat: 20,
          fiber: 12,
          meal_foods: [
            { name: 'Arroz integral', quantity: '100g', calories: 120, protein: 3, carbs: 25, fat: 1 },
            { name: 'Frango grelhado', quantity: '150g', calories: 250, protein: 45, carbs: 0, fat: 8 },
            { name: 'Salada verde', quantity: '100g', calories: 20, protein: 2, carbs: 4, fat: 0 },
            { name: 'Azeite extra virgem', quantity: '1 colher de sopa', calories: 120, protein: 0, carbs: 0, fat: 14 }
          ],
          benefits: 'Proteínas para construção muscular, carboidratos para energia e vegetais para vitaminas',
          instructions: 'Grelhe o frango temperado, prepare o arroz e monte a salada com azeite',
          tips: 'Varie os vegetais e temperos para não enjoar'
        },
        {
          id: `meal-3-${Date.now()}`,
          meal_type: 'snack',
          name: 'Lanche da Tarde',
          suggested_time: '15:00-16:00',
          description: 'Lanche nutritivo para manter energia até o jantar',
          calories: Math.round(adjustedCalories * 0.15),
          protein: 15,
          carbs: 20,
          fat: 8,
          fiber: 5,
          meal_foods: [
            { name: 'Iogurte grego', quantity: '150g', calories: 120, protein: 15, carbs: 8, fat: 4 },
            { name: 'Frutas vermelhas', quantity: '100g', calories: 50, protein: 1, carbs: 12, fat: 0 },
            { name: 'Granola', quantity: '20g', calories: 80, protein: 2, carbs: 15, fat: 3 }
          ],
          benefits: 'Proteínas para saciedade, antioxidantes das frutas e energia dos carboidratos',
          instructions: 'Misture o iogurte com as frutas e polvilhe a granola por cima',
          tips: 'Use frutas da estação para melhor sabor e preço'
        },
        {
          id: `meal-4-${Date.now()}`,
          meal_type: 'dinner',
          name: 'Jantar Leve',
          suggested_time: '19:00-20:00',
          description: 'Refeição noturna leve e nutritiva para finalizar o dia',
          calories: Math.round(adjustedCalories * 0.25),
          protein: 25,
          carbs: 30,
          fat: 12,
          fiber: 8,
          meal_foods: [
            { name: 'Salmão grelhado', quantity: '120g', calories: 200, protein: 30, carbs: 0, fat: 10 },
            { name: 'Batata doce', quantity: '100g', calories: 100, protein: 2, carbs: 25, fat: 0 },
            { name: 'Brócolis', quantity: '80g', calories: 30, protein: 3, carbs: 6, fat: 0 },
            { name: 'Azeite', quantity: '1 colher de chá', calories: 40, protein: 0, carbs: 0, fat: 5 }
          ],
          benefits: 'Ômega-3 do salmão, carboidratos complexos da batata doce e vitaminas dos vegetais',
          instructions: 'Grelhe o salmão, asse a batata doce e refogue o brócolis com azeite',
          tips: 'Pode substituir o salmão por outros peixes ou frango'
        }
      ]
    };
  }

  async generateGoalSuggestions(profile: UserProfile): Promise<string[]> {
    const prompt = `
Com base no perfil do usuário, sugira 3-5 metas realistas e específicas para os próximos 3 meses.

Perfil:
- Idade: ${profile.age} anos
- Peso: ${profile.weight} kg
- Altura: ${profile.height} cm
- Gênero: ${profile.gender}
- Nível de atividade: ${profile.activity_level}
- Objetivo: ${profile.fitness_goal}

Responda APENAS com um array JSON de strings, cada uma sendo uma meta específica e mensurável.
Exemplo: ["Perder 5kg em 3 meses", "Treinar 4x por semana", "Consumir 2L de água por dia"]
`;

    try {
      const response = await this.generateContent(prompt);
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return [];
    } catch (error) {
      return [];
    }
  }
}

export const geminiService = new GeminiService();
