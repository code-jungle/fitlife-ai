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
from food_lists import (
    get_allowed_foods_text,
    get_forbidden_foods_text,
    validate_meal_plan,
    ALIMENTOS_PERMITIDOS
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
- IMPORTANTE: Para alongamentos, descreva COMO FAZER cada um passo a passo
- Exemplo alongamento: "Sentado, estenda uma perna à frente, incline o tronco buscando tocar os dedos dos pés"

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
        {{
          "muscle": "Nome do músculo",
          "duration": "30 segundos",
          "instructions": "Descrição passo a passo de como fazer o alongamento"
        }}
      ]
    }}
  ]
}}

Gere 3 dias de treino (A, B, C) adaptados ao perfil. 
Seja específico e prático.
LEMBRE-SE: Alongamentos devem ter instruções detalhadas de execução!"""

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
                        cooldown_text += format_cooldown_item(
                            i, 
                            stretch['muscle'], 
                            stretch['duration'],
                            stretch.get('instructions', '')
                        )
                    
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
        
        system_message = """Você é um nutricionista especializado em planos alimentares ECONÔMICOS e ACESSÍVEIS.
Você DEVE usar APENAS alimentos da lista permitida.
Retorne APENAS um JSON estruturado. NÃO adicione texto extra."""
        
        # Get allowed and forbidden foods lists
        allowed_foods = get_allowed_foods_text()
        forbidden_foods = get_forbidden_foods_text()
        
        prompt = f"""Crie um plano nutricional ECONÔMICO e ACESSÍVEL retornando um JSON estruturado.

PERFIL
Nome: {profile.full_name}
Idade: {profile.age} anos
Peso: {profile.weight} kg
Altura: {profile.height} cm
IMC: {bmi}
Objetivos: {profile.objectives}
Restrições: {profile.dietary_restrictions or "Nenhuma"}
Atividade: {profile.current_activities or "Sedentário"}

{allowed_foods}

{forbidden_foods}

REGRAS OBRIGATÓRIAS:
1. Use APENAS alimentos da lista permitida acima
2. NUNCA use alimentos da lista proibida
3. Priorize: ovos, frango, carne moída, arroz, feijão, batata, banana, pão, leite, aveia
4. Evite alimentos caros como: salmão, camarão, quinoa, chia, castanhas caras, superfoods
5. Preços devem ser realistas (R$ 5 a R$ 20 por item)
6. Total da semana deve ficar entre R$ 100 e R$ 150
7. Respeite as restrições alimentares do perfil

IMPORTANTE: Se incluir algum alimento caro ou não permitido, o plano será rejeitado!

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
                
                nutrition_data = json.loads(cleaned_response)
                meals_data = nutrition_data.get('meals', {})
                
                # Format meals
                formatted_meals = {}
                
                # Breakfast
                breakfast_text = ""
                for i, food in enumerate(meals_data.get('breakfast', []), 1):
                    breakfast_text += format_food_item(
                        i, food['food'], food['quantity'], food.get('details', '')
                    )
                formatted_meals['breakfast'] = breakfast_text
                formatted_meals['breakfast_cal'] = meals_data.get('breakfast_cal', 400)
                
                # Morning snack
                morning_snack_text = ""
                for i, food in enumerate(meals_data.get('morning_snack', []), 1):
                    morning_snack_text += format_food_item(
                        i, food['food'], food['quantity'], food.get('details', '')
                    )
                formatted_meals['morning_snack'] = morning_snack_text
                formatted_meals['morning_snack_cal'] = meals_data.get('morning_snack_cal', 150)
                
                # Lunch
                lunch_text = ""
                for i, food in enumerate(meals_data.get('lunch', []), 1):
                    lunch_text += format_food_item(
                        i, food['food'], food['quantity'], food.get('details', '')
                    )
                formatted_meals['lunch'] = lunch_text
                formatted_meals['lunch_cal'] = meals_data.get('lunch_cal', 600)
                
                # Afternoon snack
                afternoon_snack_text = ""
                for i, food in enumerate(meals_data.get('afternoon_snack', []), 1):
                    afternoon_snack_text += format_food_item(
                        i, food['food'], food['quantity'], food.get('details', '')
                    )
                formatted_meals['afternoon_snack'] = afternoon_snack_text
                formatted_meals['afternoon_snack_cal'] = meals_data.get('afternoon_snack_cal', 200)
                
                # Dinner
                dinner_text = ""
                for i, food in enumerate(meals_data.get('dinner', []), 1):
                    dinner_text += format_food_item(
                        i, food['food'], food['quantity'], food.get('details', '')
                    )
                formatted_meals['dinner'] = dinner_text
                formatted_meals['dinner_cal'] = meals_data.get('dinner_cal', 500)
                
                # Supper
                supper_text = ""
                for i, food in enumerate(meals_data.get('supper', []), 1):
                    supper_text += format_food_item(
                        i, food['food'], food['quantity'], food.get('details', '')
                    )
                formatted_meals['supper'] = supper_text
                formatted_meals['supper_cal'] = meals_data.get('supper_cal', 150)
                
                # Shopping list
                shopping_text = ""
                for item_data in meals_data.get('shopping_list', []):
                    shopping_text += f"- {item_data['item']} - Preço aproximado: R$ {item_data['price']:.2f}\n"
                formatted_meals['shopping_list'] = shopping_text
                formatted_meals['total_cost'] = meals_data.get('total_cost', '120.00')
                
                # Substitutions
                substitutions_text = ""
                for sub in meals_data.get('substitutions', []):
                    substitutions_text += f"- {sub['original']} pode ser substituído por {sub['alternative']}\n"
                formatted_meals['substitutions'] = substitutions_text
                
                # Generate final nutrition plan using template
                final_nutrition = get_nutrition_template(
                    profile_name=profile.full_name,
                    calories=nutrition_data.get('calories', 2000),
                    protein=nutrition_data.get('protein', 150),
                    carbs=nutrition_data.get('carbs', 200),
                    fats=nutrition_data.get('fats', 60),
                    meals=formatted_meals
                )
                
                # Validate for forbidden foods
                is_valid, forbidden_found = validate_meal_plan(final_nutrition)
                if not is_valid:
                    print(f"⚠️ AVISO: Alimentos caros detectados: {forbidden_found}")
                    print("Gerando plano alternativo com alimentos permitidos...")
                    # If validation fails, return default plan
                    return self._get_default_nutrition(profile)
                
                return final_nutrition
                
            except (json.JSONDecodeError, KeyError) as parse_error:
                print(f"Erro ao parsear JSON de nutrição, usando resposta direta: {str(parse_error)}")
                # Se falhar o parse, retorna resposta direta mas limpa
                return json_response.replace('**', '').replace('*', '')
            
        except Exception as e:
            print(f"Erro ao gerar plano nutricional: {str(e)}")
            # Fallback plan
            return self._get_default_nutrition(profile)
    
    def _get_default_workout(self, profile: Profile) -> str:
        """Fallback workout plan with detailed stretches"""
        return f"""PLANO DE TREINO - {profile.full_name.upper()}

FREQUÊNCIA SEMANAL
3 vezes por semana com 1 dia de descanso entre treinos

DIVISÃO DO TREINO
ABC - Treino dividido por grupos musculares

DIA A - PEITO E TRÍCEPS

AQUECIMENTO
1. Polichinelos - 3 minutos
2. Rotação de braços - 2 minutos

TREINO PRINCIPAL
1. Flexões no solo
   Séries: 3, Repetições: 10-15, Descanso: 60 segundos

2. Mergulho entre cadeiras
   Séries: 3, Repetições: 8-12, Descanso: 60 segundos

ALONGAMENTO
Mantenha cada posição de forma estática, sem forçar além do limite confortável.
Respire profundamente durante o alongamento para melhor relaxamento muscular.

1. Alongamento de Peitoral - 30 segundos
   Como fazer: Fique de pé ao lado de uma parede, apoie a mão na altura do ombro e gire o tronco para o lado oposto

2. Alongamento de Tríceps - 30 segundos (cada braço)
   Como fazer: Levante um braço, dobre o cotovelo levando a mão nas costas, use a outra mão para puxar suavemente o cotovelo

DIA B - COSTAS E BÍCEPS

AQUECIMENTO
1. Marcha no lugar - 3 minutos
2. Circundução de ombros - 2 minutos

TREINO PRINCIPAL
1. Remada com peso improvisado
   Séries: 3, Repetições: 12, Descanso: 60 segundos

2. Rosca direta
   Séries: 3, Repetições: 12, Descanso: 60 segundos

ALONGAMENTO
Mantenha cada posição de forma estática, sem forçar além do limite confortável.
Respire profundamente durante o alongamento para melhor relaxamento muscular.

1. Alongamento de Costas - 30 segundos
   Como fazer: Sentado ou em pé, entrelace os dedos à frente do corpo e empurre as palmas para frente arredondando as costas

2. Alongamento de Bíceps - 30 segundos (cada braço)
   Como fazer: Estenda o braço à frente com a palma para cima, use a outra mão para puxar suavemente os dedos para trás

DIA C - PERNAS E CORE

AQUECIMENTO
1. Elevação de joelhos - 3 minutos
2. Círculos com tornozelos - 2 minutos

TREINO PRINCIPAL
1. Agachamento
   Séries: 3, Repetições: 15, Descanso: 60 segundos

2. Afundo alternado
   Séries: 3, Repetições: 10 (cada perna), Descanso: 60 segundos

3. Prancha abdominal
   Séries: 3, Repetições: 30 segundos, Descanso: 45 segundos

ALONGAMENTO
Mantenha cada posição de forma estática, sem forçar além do limite confortável.
Respire profundamente durante o alongamento para melhor relaxamento muscular.

1. Alongamento de Quadríceps - 30 segundos (cada perna)
   Como fazer: Em pé, segure um pé atrás levando o calcanhar em direção ao glúteo, mantenha os joelhos alinhados

2. Alongamento de Posteriores de coxa - 30 segundos (cada perna)
   Como fazer: Sentado no chão, estenda uma perna à frente, dobre a outra, incline o tronco buscando tocar o pé

3. Alongamento de Panturrilha - 30 segundos (cada perna)
   Como fazer: Apoie as mãos na parede, estenda uma perna atrás mantendo o calcanhar no chão, dobre a perna da frente

DICAS IMPORTANTES
- Mantenha sempre uma boa postura durante os exercícios
- Hidrate-se antes, durante e após o treino
- Respeite os intervalos de descanso entre as séries
- Aumente a carga progressivamente conforme evolui
- Em caso de dor, interrompa o exercício

PROGRESSÃO
Semana 1-2: Foque na execução correta dos movimentos
Semana 3-4: Aumente levemente a carga mantendo a forma
Semana 5-6: Reduza o tempo de descanso entre séries
Semana 7-8: Aumente repetições ou adicione uma série extra

OBSERVAÇÕES DE SEGURANÇA
- Consulte um profissional antes de iniciar
- Faça um aquecimento adequado antes de cada treino
- Não treine o mesmo grupo muscular em dias consecutivos
- Descanse pelo menos 1 dia por semana
- Mantenha uma alimentação adequada para seus objetivos"""
    
    def _get_default_nutrition(self, profile: Profile) -> str:
        """Fallback nutrition plan with cheap and accessible foods"""
        return f"""PLANO NUTRICIONAL PERSONALIZADO - {profile.full_name.upper()}

METAS DIÁRIAS
Calorias totais: 2000 kcal
Proteínas: 130g
Carboidratos: 220g
Gorduras: 55g

CAFÉ DA MANHÃ
1. Ovos mexidos - 2 unidades
   Fonte de proteína de alta qualidade e baixo custo
2. Pão francês - 2 unidades
   Carboidrato de energia rápida
3. Banana - 1 unidade média
   Rica em potássio e fibras
4. Café com leite - 1 xícara

Total aproximado: 420 kcal

LANCHE DA MANHÃ
1. Iogurte natural - 1 copo (200ml)
   Probióticos para saúde intestinal
2. Aveia em flocos - 2 colheres de sopa
   Fibras e saciedade

Total aproximado: 180 kcal

ALMOÇO
1. Arroz branco - 5 colheres de sopa
   Base energética da refeição
2. Feijão carioca - 1 concha média
   Proteína vegetal e ferro
3. Frango (coxa ou sobrecoxa) - 150g
   Proteína acessível e saborosa
4. Salada de alface e tomate - à vontade
   Vitaminas e minerais
5. Óleo de soja - 1 colher de sopa
   Gordura para cozimento

Total aproximado: 650 kcal

LANCHE DA TARDE
1. Pão de forma - 2 fatias
   Praticidade e energia
2. Requeijão - 1 colher de sopa
   Gordura e sabor
3. Mamão - 1 fatia média
   Digestão e vitaminas

Total aproximado: 220 kcal

JANTAR
1. Macarrão - 1 pegador médio
   Carboidrato de fácil preparo
2. Carne moída - 100g
   Proteína econômica
3. Molho de tomate caseiro - à vontade
   Tempero natural
4. Cenoura ralada - 2 colheres de sopa
   Vitamina A e cor

Total aproximado: 480 kcal

CEIA
1. Leite integral - 1 copo (200ml)
   Cálcio e proteína antes de dormir

Total aproximado: 120 kcal

LISTA DE COMPRAS SEMANAL
- Ovos (30 unidades) - Preço aproximado: R$ 18,00
- Frango (coxa/sobrecoxa 2kg) - Preço aproximado: R$ 20,00
- Carne moída (1kg) - Preço aproximado: R$ 18,00
- Arroz (5kg) - Preço aproximado: R$ 20,00
- Feijão (1kg) - Preço aproximado: R$ 8,00
- Macarrão (1kg) - Preço aproximado: R$ 5,00
- Pão francês (14 unidades) - Preço aproximado: R$ 10,00
- Pão de forma (1 pacote) - Preço aproximado: R$ 6,00
- Leite (3L) - Preço aproximado: R$ 15,00
- Iogurte natural (1L) - Preço aproximado: R$ 8,00
- Aveia (500g) - Preço aproximado: R$ 5,00
- Banana (1 dúzia) - Preço aproximado: R$ 6,00
- Mamão (1 unidade) - Preço aproximado: R$ 5,00
- Alface (2 pés) - Preço aproximado: R$ 4,00
- Tomate (1kg) - Preço aproximado: R$ 6,00
- Cenoura (500g) - Preço aproximado: R$ 3,00
- Óleo de soja (900ml) - Preço aproximado: R$ 7,00
- Requeijão (200g) - Preço aproximado: R$ 6,00

Total estimado da semana: R$ 140,00

DICAS DE PREPARO
- Prepare as refeições com antecedência nos finais de semana
- Use temperos naturais (alho, cebola, cheiro verde) para dar mais sabor
- Cozinhe em maior quantidade e congele porções
- Prefira alimentos grelhados, assados ou cozidos
- Lave bem frutas e verduras antes de consumir

DICAS DE ECONOMIA
- Compre frutas e verduras da estação (mais baratas)
- Escolha coxa/sobrecoxa de frango ao invés de peito
- Compre ovos em caixas de 30 unidades (mais barato)
- Prefira pão francês ao invés de pães especiais
- Faça uma lista antes de ir ao mercado e evite compras por impulso

SUBSTITUIÇÕES POSSÍVEIS
- Frango pode ser substituído por Carne de segunda (patinho, músculo)
- Banana pode ser substituída por Laranja ou Maçã
- Mamão pode ser substituído por Melancia
- Iogurte natural pode ser substituído por Leite com aveia
- Requeijão pode ser substituído por Queijo minas

OBSERVAÇÕES IMPORTANTES
- Beba pelo menos 2 litros de água por dia
- Evite alimentos ultraprocessados e fast food
- Mastigue bem os alimentos para melhor digestão
- Faça as refeições em horários regulares
- Consulte um nutricionista para orientações específicas e personalizadas"""

# Create singleton instance
gemini_service = GeminiService()
