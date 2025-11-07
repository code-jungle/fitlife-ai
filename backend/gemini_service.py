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

{{
  "frequency": "3 a 4 vezes por semana com descanso entre treinos",
  "division": "Tipo de divisão (ABC, Upper/Lower, Full Body, etc)",
  "days": [
    {{
      "title": "DIA A - NOME DO GRUPO",
      "warmup": [
        {{"exercise": "Nome", "duration": "tempo"}},
        {{"exercise": "Nome", "duration": "tempo"}}
      ],
      "main_workout": [
        {{
          "name": "Nome do exercício",
          "sets": 3,
          "reps": "12",
          "rest": "60 segundos"
        }}
      ],
      "cooldown": [
        {{"muscle": "Nome do músculo", "duration": "30 segundos"}}
      ]
    }}
  ]
}}

Gere 3 dias de treino (A, B, C) adaptados ao perfil. Seja específico e prático."""

        try:
            # Create a unique session for this request
            session_id = f"workout_{profile.user_id}_{uuid.uuid4()}"
            
            chat = LlmChat(
                api_key=self.api_key,
                session_id=session_id,
                system_message=system_message
            ).with_model("gemini", "gemini-2.0-flash")
            
            user_message = UserMessage(text=prompt)
            json_response = await chat.send_message(user_message)
            
            # Try to parse JSON response
            try:
                # Remove markdown code blocks if present
                cleaned_response = json_response.strip()
                if cleaned_response.startswith('```'):
                    cleaned_response = cleaned_response.split('```')[1]
                    if cleaned_response.startswith('json'):
                        cleaned_response = cleaned_response[4:]
                cleaned_response = cleaned_response.strip()
                
                workout_data = json.loads(cleaned_response)
                
                # Format days using template
                formatted_days = []
                for day in workout_data.get('days', []):
                    # Format warmup
                    warmup_text = ""
                    for i, ex in enumerate(day.get('warmup', []), 1):
                        warmup_text += format_warmup_item(i, ex['exercise'], ex['duration'])
                    
                    # Format main workout
                    main_text = ""
                    for i, ex in enumerate(day.get('main_workout', []), 1):
                        main_text += format_exercise_item(
                            i, ex['name'], ex['sets'], ex['reps'], ex['rest']
                        )
                    
                    # Format cooldown
                    cooldown_text = ""
                    for i, stretch in enumerate(day.get('cooldown', []), 1):
                        cooldown_text += format_cooldown_item(i, stretch['muscle'], stretch['duration'])
                    
                    formatted_days.append({
                        'title': day['title'],
                        'warmup': warmup_text,
                        'main_workout': main_text,
                        'cooldown': cooldown_text
                    })
                
                # Generate final workout using template
                final_workout = get_workout_template(
                    profile_name=profile.full_name,
                    frequency=workout_data.get('frequency', '3 a 4 vezes por semana'),
                    division=workout_data.get('division', 'Treino ABC'),
                    days=formatted_days
                )
                
                return final_workout
                
            except (json.JSONDecodeError, KeyError) as parse_error:
                print(f"Erro ao parsear JSON, usando resposta direta: {str(parse_error)}")
                # Se falhar o parse, retorna resposta direta mas limpa
                return json_response.replace('**', '').replace('*', '')
            
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
        
        system_message = """Você é um nutricionista experiente especializado em criar planos alimentares acessíveis.
Você deve retornar APENAS um JSON estruturado com os dados do plano. NÃO adicione texto extra."""
        
        prompt = f"""Crie um plano nutricional personalizado retornando um JSON estruturado.

PERFIL
Nome: {profile.full_name}
Idade: {profile.age} anos
Peso: {profile.weight} kg
Altura: {profile.height} cm
IMC: {bmi}
Objetivos: {profile.objectives}
Restrições: {profile.dietary_restrictions or "Nenhuma"}
Atividade: {profile.current_activities or "Sedentário"}

INSTRUÇÕES
- Use APENAS alimentos baratos: ovos, frango, arroz, feijão, batata, banana, pão, leite
- EVITE: castanhas caras, salmão, quinoa, superfoods
- Respeite restrições alimentares
- Seja específico nas quantidades

RETORNE APENAS ESTE JSON (sem texto extra):

{{
  "calories": 2000,
  "protein": 150,
  "carbs": 200,
  "fats": 60,
  "meals": {{
    "breakfast": [
      {{"food": "Nome", "quantity": "quantidade", "details": "opcional"}}
    ],
    "breakfast_cal": 400,
    "morning_snack": [
      {{"food": "Nome", "quantity": "quantidade"}}
    ],
    "morning_snack_cal": 150,
    "lunch": [
      {{"food": "Nome", "quantity": "quantidade"}}
    ],
    "lunch_cal": 600,
    "afternoon_snack": [
      {{"food": "Nome", "quantity": "quantidade"}}
    ],
    "afternoon_snack_cal": 200,
    "dinner": [
      {{"food": "Nome", "quantity": "quantidade"}}
    ],
    "dinner_cal": 500,
    "supper": [
      {{"food": "Nome", "quantity": "quantidade"}}
    ],
    "supper_cal": 150,
    "shopping_list": [
      {{"item": "Nome", "price": 10.00}}
    ],
    "total_cost": "120.00",
    "substitutions": [
      {{"original": "Alimento", "alternative": "Substituto"}}
    ]
  }}
}}

Gere um plano completo com alimentos BARATOS e ACESSÍVEIS."""

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
