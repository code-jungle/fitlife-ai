import os
import uuid
from emergentintegrations.llm.chat import LlmChat, UserMessage
from models import Profile

class GeminiService:
    def __init__(self):
        self.api_key = os.environ.get("EMERGENT_LLM_KEY")
        if not self.api_key:
            raise ValueError("EMERGENT_LLM_KEY não configurada")
    
    def _calculate_bmi(self, weight: float, height: int) -> float:
        """Calculate BMI from weight (kg) and height (cm)"""
        height_m = height / 100
        return round(weight / (height_m ** 2), 1)
    
    async def generate_workout(self, profile: Profile) -> str:
        """
        Generate personalized workout plan using Gemini
        Adapts to training location and current activities
        """
        bmi = self._calculate_bmi(profile.weight, profile.height)
        
        training_location = {
            "academia": "academia com equipamentos disponíveis",
            "casa": "casa sem equipamentos especiais",
            "ar_livre": "ao ar livre (parques, praças)"
        }.get(profile.training_type, "local escolhido")
        
        system_message = """Você é um personal trainer experiente especializado em criar treinos personalizados.
Sua missão é criar planos de treino seguros, eficientes e adaptados ao perfil do aluno."""
        
        prompt = f"""Crie um plano de treino personalizado com base nas seguintes informações:

**PERFIL DO ALUNO:**
- Nome: {profile.full_name}
- Idade: {profile.age} anos
- Peso: {profile.weight} kg
- Altura: {profile.height} cm
- IMC: {bmi}
- Local de treino: {training_location}
- Objetivos: {profile.objectives}
- Atividades físicas atuais: {profile.current_activities or "Nenhuma atividade regular"}
- Restrições: {profile.dietary_restrictions or "Nenhuma restrição mencionada"}

**INSTRUÇÕES IMPORTANTES:**
1. Adapte os exercícios para o local escolhido ({training_location})
2. Considere as atividades físicas que a pessoa já pratica para evitar sobrecarga
3. Se a pessoa já faz exercícios, complemente com treinos diferentes para trabalhar outros grupos musculares
4. Inclua sempre: aquecimento (5-10 min), treino principal (30-45 min), alongamento (5-10 min)
5. Para cada exercício, especifique: séries, repetições e tempo de descanso
6. Dê dicas de progressão e variações dos exercícios
7. Inclua avisos de segurança quando necessário

**FORMATO DA RESPOSTA:**
Retorne um plano estruturado com:
- Frequência semanal recomendada
- Divisão de treino (ex: ABC, upper/lower, etc)
- Exercícios detalhados para cada dia
- Orientações importantes

Seja motivador e educativo! Este é um plano educacional."""

        try:
            # Create a unique session for this request
            session_id = f"workout_{profile.user_id}_{uuid.uuid4()}"
            
            chat = LlmChat(
                api_key=self.api_key,
                session_id=session_id,
                system_message=system_message
            ).with_model("gemini", "gemini-2.0-flash")
            
            user_message = UserMessage(text=prompt)
            response = await chat.send_message(user_message)
            
            return response
            
        except Exception as e:
            print(f"Erro ao gerar treino: {str(e)}")
            # Fallback plan
            return self._get_default_workout(profile)
    
    async def generate_nutrition(self, profile: Profile) -> str:
        """
        Generate personalized nutrition plan using Gemini
        Focus on affordable and accessible foods
        """
        bmi = self._calculate_bmi(profile.weight, profile.height)
        
        system_message = """Você é um nutricionista experiente especializado em criar planos alimentares acessíveis e práticos.
Seu foco é em alimentos brasileiros comuns, baratos e fáceis de encontrar."""
        
        prompt = f"""Crie um plano nutricional personalizado com base nas seguintes informações:

**PERFIL DO ALUNO:**
- Nome: {profile.full_name}
- Idade: {profile.age} anos
- Peso: {profile.weight} kg
- Altura: {profile.height} cm
- IMC: {bmi}
- Objetivos: {profile.objectives}
- Restrições alimentares: {profile.dietary_restrictions or "Nenhuma restrição"}
- Nível de atividade: {profile.current_activities or "Sedentário"}

**INSTRUÇÕES IMPORTANTES - ALIMENTOS ACESSÍVEIS:**
1. PRIORIZE alimentos baratos e comuns no Brasil:
   - Ovos, frango, carne moída
   - Arroz, feijão, macarrão
   - Batata, mandioca, banana
   - Aveia, pão integral
   - Leite, iogurte natural
   - Frutas da estação (banana, laranja, maçã)
   - Verduras comuns (alface, tomate, cenoura)

2. EVITE alimentos caros ou difíceis de encontrar:
   - ❌ Castanhas importadas
   - ❌ Camarão, salmão
   - ❌ Quinoa, chia
   - ❌ Proteínas importadas
   - ❌ Superfoods exóticos

3. Respeite as restrições alimentares mencionadas
4. Calcule as calorias e macros aproximados
5. Dê opções de substituição para cada refeição
6. Inclua dicas de preparo simples e rápido

**FORMATO DA RESPOSTA:**
Retorne um plano com:
- Meta calórica diária
- Distribuição de macronutrientes
- Cardápio semanal com 5-6 refeições por dia:
  * Café da manhã
  * Lanche da manhã
  * Almoço
  * Lanche da tarde
  * Jantar
  * Ceia (opcional)
- Lista de compras com preços aproximados
- Dicas de economia e preparo

Seja prático e realista! Foque na acessibilidade financeira."""

        try:
            # Create a unique session for this request
            session_id = f"nutrition_{profile.user_id}_{uuid.uuid4()}"
            
            chat = LlmChat(
                api_key=self.api_key,
                session_id=session_id,
                system_message=system_message
            ).with_model("gemini", "gemini-2.0-flash")
            
            user_message = UserMessage(text=prompt)
            response = await chat.send_message(user_message)
            
            return response
            
        except Exception as e:
            print(f"Erro ao gerar plano nutricional: {str(e)}")
            # Fallback plan
            return self._get_default_nutrition(profile)
    
    def _get_default_workout(self, profile: Profile) -> str:
        """Fallback workout plan"""
        return f"""**PLANO DE TREINO - {profile.full_name}**

⚠️ Este é um plano básico gerado automaticamente. Para melhores resultados, complete seu perfil.

**TREINO ABC - 3x por semana**

**DIA A - PEITO E TRÍCEPS**
1. Aquecimento: 5 min de movimentos articulares
2. Flexões: 3 séries de 10-15 repetições
3. Mergulho entre cadeiras: 3 séries de 8-12 repetições
4. Alongamento: 5 minutos

**DIA B - COSTAS E BÍCEPS**
1. Aquecimento: 5 min
2. Remada com peso improvisado: 3 séries de 12 repetições
3. Rosca direta: 3 séries de 12 repetições
4. Alongamento: 5 minutos

**DIA C - PERNAS E CORE**
1. Aquecimento: 5 min
2. Agachamento: 3 séries de 15 repetições
3. Afundo: 3 séries de 10 repetições (cada perna)
4. Prancha: 3 séries de 30 segundos
5. Alongamento: 5 minutos

💡 **Dica:** Descanse 1-2 minutos entre as séries."""
    
    def _get_default_nutrition(self, profile: Profile) -> str:
        """Fallback nutrition plan"""
        return f"""**PLANO NUTRICIONAL - {profile.full_name}**

⚠️ Este é um plano básico gerado automaticamente. Para melhores resultados, complete seu perfil.

**CARDÁPIO DIÁRIO**

**Café da Manhã:**
- 2 ovos mexidos
- 2 fatias de pão integral
- 1 banana
- Café com leite

**Lanche da Manhã:**
- 1 iogurte natural
- 1 maçã

**Almoço:**
- Arroz integral (4 colheres)
- Feijão (1 concha)
- Frango grelhado (150g)
- Salada verde à vontade
- 1 colher de azeite

**Lanche da Tarde:**
- Pão integral com pasta de amendoim
- 1 fruta da estação

**Jantar:**
- Omelete de 3 ovos com legumes
- Salada verde
- 1 fatia de pão integral

**Ceia (opcional):**
- 1 copo de leite desnatado

💡 **Dica:** Beba pelo menos 2 litros de água por dia."""

# Create singleton instance
gemini_service = GeminiService()
