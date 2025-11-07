import os
import uuid
import json
from dotenv import load_dotenv
from pathlib import Path
from emergentintegrations.llm.chat import LlmChat, UserMessage
from models import Profile
from templates import (
    get_workout_template, 
    get_nutrition_template,
    format_exercise_item,
    format_food_item,
    format_warmup_item,
    format_cooldown_item
)

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

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
        Generate personalized workout plan using Gemini with fixed template
        Adapts to training location and current activities
        """
        bmi = self._calculate_bmi(profile.weight, profile.height)
        
        training_location = {
            "academia": "academia com equipamentos disponíveis",
            "casa": "casa sem equipamentos especiais",
            "ar_livre": "ao ar livre (parques, praças)"
        }.get(profile.training_type, "local escolhido")
        
        system_message = """Você é um personal trainer experiente especializado em criar treinos personalizados.
Você deve retornar APENAS um JSON estruturado com os dados do treino. NÃO adicione texto extra."""
        
        prompt = f"""Crie um plano de treino personalizado retornando um JSON estruturado.

PERFIL
Nome: {profile.full_name}
Idade: {profile.age} anos
Peso: {profile.weight} kg  
Altura: {profile.height} cm
IMC: {bmi}
Local: {training_location}
Objetivos: {profile.objectives}
Atividades atuais: {profile.current_activities or "Nenhuma"}

INSTRUÇÕES
- Adapte para {training_location}
- Considere atividades atuais
- Inclua aquecimento, treino e alongamento
- Seja específico nas séries e repetições

RETORNE APENAS ESTE JSON (sem texto extra):

PLANO DE TREINO - {profile.full_name.upper()}

FREQUÊNCIA
3 a 4 vezes por semana com 1 dia de descanso entre treinos

DIVISÃO
[Especifique a divisão: ABC, Upper/Lower, Full Body, etc]

DIA A - [NOME DO GRUPO MUSCULAR]

AQUECIMENTO
1. [Exercício] - [tempo/repetições]
2. [Exercício] - [tempo/repetições]

TREINO PRINCIPAL
1. [Nome do exercício]
   Séries: [número], Repetições: [número], Descanso: [tempo]

2. [Nome do exercício]
   Séries: [número], Repetições: [número], Descanso: [tempo]

3. [Nome do exercício]
   Séries: [número], Repetições: [número], Descanso: [tempo]

ALONGAMENTO
1. [Músculo] - [tempo]
2. [Músculo] - [tempo]

[Repita a estrutura para outros dias se necessário]

DICAS IMPORTANTES
- [Dica 1]
- [Dica 2]
- [Dica 3]

PROGRESSÃO
[Orientações de como progredir ao longo das semanas]

OBSERVAÇÕES
[Avisos de segurança e recomendações]

REGRAS DE FORMATAÇÃO:
- Use MAIÚSCULAS apenas para títulos de seções (DIA A, AQUECIMENTO, etc)
- Liste exercícios numerados (1., 2., 3.)
- Coloque séries/repetições em linhas separadas SEMPRE
- Use travessão (-) para listas de dicas
- NÃO use asteriscos ou tabelas markdown
- Mantenha espaçamento consistente
- Seja claro e direto

Seja motivador e profissional! Este é um plano educacional."""

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
Seu foco é em alimentos brasileiros comuns, baratos e fáceis de encontrar.
IMPORTANTE: Siga EXATAMENTE o formato especificado para garantir consistência visual."""
        
        prompt = f"""Crie um plano nutricional personalizado com base nas seguintes informações:

PERFIL
Nome: {profile.full_name}
Idade: {profile.age} anos
Peso: {profile.weight} kg
Altura: {profile.height} cm
IMC: {bmi}
Objetivos: {profile.objectives}
Restrições alimentares: {profile.dietary_restrictions or "Nenhuma restrição"}
Nível de atividade: {profile.current_activities or "Sedentário"}

INSTRUÇÕES - ALIMENTOS ACESSÍVEIS
PRIORIZE alimentos baratos e comuns:
- Ovos, frango, carne moída
- Arroz, feijão, macarrão
- Batata, mandioca, banana
- Aveia, pão integral
- Leite, iogurte natural
- Frutas da estação
- Verduras comuns

EVITE alimentos caros:
- Castanhas importadas, salmão, quinoa, chia, superfoods exóticos

FORMATO OBRIGATÓRIO - SIGA EXATAMENTE ESTA ESTRUTURA:

PLANO NUTRICIONAL - {profile.full_name.upper()}

METAS DIÁRIAS
Calorias: [valor] kcal
Proteínas: [valor]g
Carboidratos: [valor]g
Gorduras: [valor]g

CAFÉ DA MANHÃ

1. [Alimento] - [quantidade]
2. [Alimento] - [quantidade]
3. [Alimento] - [quantidade]

Total: [calorias aproximadas]

LANCHE DA MANHÃ

1. [Alimento] - [quantidade]
2. [Alimento] - [quantidade]

Total: [calorias aproximadas]

ALMOÇO

1. [Alimento] - [quantidade]
2. [Alimento] - [quantidade]
3. [Alimento] - [quantidade]
4. [Alimento] - [quantidade]

Total: [calorias aproximadas]

LANCHE DA TARDE

1. [Alimento] - [quantidade]
2. [Alimento] - [quantidade]

Total: [calorias aproximadas]

JANTAR

1. [Alimento] - [quantidade]
2. [Alimento] - [quantidade]
3. [Alimento] - [quantidade]

Total: [calorias aproximadas]

CEIA

1. [Alimento] - [quantidade]

Total: [calorias aproximadas]

LISTA DE COMPRAS SEMANAL
- [Item] - Preço aproximado: R$ [valor]
- [Item] - Preço aproximado: R$ [valor]
[Continue...]

Total estimado: R$ [valor]

DICAS DE PREPARO
- [Dica 1]
- [Dica 2]
- [Dica 3]

DICAS DE ECONOMIA
- [Dica 1]
- [Dica 2]

SUBSTITUIÇÕES POSSÍVEIS
- [Alimento] pode ser substituído por [alternativa]
- [Alimento] pode ser substituído por [alternativa]

OBSERVAÇÕES IMPORTANTES
- [Observação 1]
- [Observação 2]

REGRAS DE FORMATAÇÃO:
- Use MAIÚSCULAS apenas para títulos de seções (CAFÉ DA MANHÃ, ALMOÇO, etc)
- Liste alimentos numerados (1., 2., 3.)
- Sempre inclua quantidade após o alimento
- Use travessão (-) para listas de dicas
- NÃO use asteriscos ou tabelas markdown
- Mantenha espaçamento consistente
- Seja claro e direto
- Foque em alimentos BARATOS e ACESSÍVEIS

Seja prático e realista! Foque em alimentação econômica e nutritiva."""

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
