"""
Templates padrão para geração de treinos e dietas
Garantem formato consistente e profissional
"""

def get_workout_template(profile_name: str, frequency: str, division: str, days: list) -> str:
    """
    Template fixo para treinos
    
    Args:
        profile_name: Nome do usuário
        frequency: Frequência semanal (ex: "3 a 4 vezes por semana")
        division: Tipo de divisão (ex: "ABC - Treino dividido por grupos musculares")
        days: Lista de dicionários com estrutura de cada dia
    """
    
    template = f"""PLANO DE TREINO PERSONALIZADO - {profile_name.upper()}

FREQUÊNCIA SEMANAL
{frequency}

DIVISÃO DO TREINO
{division}

"""
    
    # Adicionar cada dia de treino
    for day in days:
        template += f"""
{day['title']}

AQUECIMENTO
{day['warmup']}

TREINO PRINCIPAL
{day['main_workout']}

ALONGAMENTO
{day['cooldown']}

"""
    
    template += """
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
- Mantenha uma alimentação adequada para seus objetivos
"""
    
    return template


def get_nutrition_template(profile_name: str, calories: int, protein: int, carbs: int, fats: int, meals: dict) -> str:
    """
    Template fixo para nutrição
    
    Args:
        profile_name: Nome do usuário
        calories: Meta calórica diária
        protein: Gramas de proteína
        carbs: Gramas de carboidratos
        fats: Gramas de gorduras
        meals: Dicionário com as refeições
    """
    
    template = f"""PLANO NUTRICIONAL PERSONALIZADO - {profile_name.upper()}

METAS DIÁRIAS
Calorias totais: {calories} kcal
Proteínas: {protein}g
Carboidratos: {carbs}g
Gorduras: {fats}g

CAFÉ DA MANHÃ
{meals['breakfast']}
Total aproximado: {meals['breakfast_cal']} kcal

LANCHE DA MANHÃ
{meals['morning_snack']}
Total aproximado: {meals['morning_snack_cal']} kcal

ALMOÇO
{meals['lunch']}
Total aproximado: {meals['lunch_cal']} kcal

LANCHE DA TARDE
{meals['afternoon_snack']}
Total aproximado: {meals['afternoon_snack_cal']} kcal

JANTAR
{meals['dinner']}
Total aproximado: {meals['dinner_cal']} kcal

CEIA
{meals['supper']}
Total aproximado: {meals['supper_cal']} kcal

LISTA DE COMPRAS SEMANAL
{meals['shopping_list']}

Total estimado da semana: R$ {meals['total_cost']}

DICAS DE PREPARO
- Prepare as refeições com antecedência nos finais de semana
- Use temperos naturais para dar mais sabor
- Cozinhe em maior quantidade e congele porções
- Prefira alimentos grelhados, assados ou cozidos
- Lave bem frutas e verduras antes de consumir

DICAS DE ECONOMIA
- Compre frutas e verduras da estação
- Escolha cortes de carne mais em conta
- Compre em maior quantidade quando houver promoção
- Evite desperdícios, aproveite sobras em novas receitas
- Faça uma lista antes de ir ao mercado

SUBSTITUIÇÕES POSSÍVEIS
{meals['substitutions']}

OBSERVAÇÕES IMPORTANTES
- Beba pelo menos 2 litros de água por dia
- Evite alimentos ultraprocessados
- Mastigue bem os alimentos
- Faça as refeições em horários regulares
- Consulte um nutricionista para orientações específicas
"""
    
    return template


def format_exercise_item(number: int, name: str, sets: int, reps: str, rest: str) -> str:
    """Formata um item de exercício"""
    return f"""{number}. {name}
   Séries: {sets}, Repetições: {reps}, Descanso: {rest}
"""


def format_food_item(number: int, food: str, quantity: str, details: str = "") -> str:
    """Formata um item de alimento"""
    if details:
        return f"{number}. {food} - {quantity}\n   {details}\n"
    return f"{number}. {food} - {quantity}\n"


def format_warmup_item(number: int, exercise: str, duration: str) -> str:
    """Formata um item de aquecimento"""
    return f"{number}. {exercise} - {duration}\n"


def format_cooldown_item(number: int, muscle: str, duration: str) -> str:
    """Formata um item de alongamento"""
    return f"{number}. {muscle} - {duration}\n"
