# Configuração da Integração com Google Gemini

## Variáveis de Ambiente Necessárias

Para usar a integração com o Google Gemini, você precisa configurar as seguintes variáveis de ambiente:

### 1. Criar arquivo `.env` na raiz do projeto

```env
# Supabase Configuration (já configurado)
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Google Gemini API (NOVO)
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 2. Como obter a chave da API do Gemini

1. Acesse o [Google AI Studio](https://aistudio.google.com/)
2. Faça login com sua conta Google
3. Clique em "Get API Key"
4. Crie uma nova chave de API
5. Copie a chave e cole no arquivo `.env`

### 3. Funcionalidades Implementadas

- ✅ **Geração de Treinos Personalizados**: Cria planos de treino baseados no perfil do usuário
- ✅ **Geração de Planos Nutricionais**: Cria planos alimentares personalizados
- ✅ **Sugestões de Metas**: Gera metas realistas baseadas no perfil
- ✅ **Tratamento de Erros**: Fallback para planos padrão em caso de erro
- ✅ **Validação de Dados**: Parsing seguro das respostas da IA

### 4. Como Usar

As funcionalidades são integradas automaticamente nas páginas:
- **Treinos** (`/workouts`): Gera treinos com IA
- **Nutrição** (`/nutrition`): Gera planos nutricionais com IA
- **Metas** (`/goals`): Sugere metas personalizadas

### 5. Estrutura do Serviço

```typescript
// Exemplo de uso
import { geminiService } from '@/services/geminiService';

const workoutPlan = await geminiService.generateWorkoutPlan(userProfile);
const nutritionPlan = await geminiService.generateNutritionPlan(userProfile);
const goalSuggestions = await geminiService.generateGoalSuggestions(userProfile);
```

### 6. Limitações e Considerações

- **Rate Limits**: O Gemini tem limites de requisições por minuto
- **Custos**: Cada requisição tem um custo associado
- **Latência**: Pode haver delay nas respostas da IA
- **Fallback**: Em caso de erro, o sistema usa planos padrão

### 7. Testando a Integração

1. Configure a chave da API no `.env`
2. Reinicie o servidor de desenvolvimento
3. Faça login na aplicação
4. Tente gerar um treino ou plano nutricional
5. Verifique se a IA está funcionando corretamente
