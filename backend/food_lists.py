"""
Listas de alimentos permitidos e proibidos
Garantem que apenas alimentos acessíveis sejam sugeridos
"""

# ALIMENTOS PERMITIDOS - Baratos e fáceis de encontrar
ALIMENTOS_PERMITIDOS = {
    "proteinas": [
        "Ovos",
        "Frango (peito, coxa, sobrecoxa)",
        "Carne moída",
        "Carne de segunda (patinho, músculo)",
        "Fígado bovino",
        "Linguiça",
        "Sardinha em lata",
        "Atum em lata",
        "Peito de peru fatiado",
        "Leite integral",
        "Leite em pó",
        "Iogurte natural",
        "Queijo minas",
        "Requeijão",
        "Feijão (preto, carioca)",
        "Lentilha",
        "Grão de bico",
        "Ervilha"
    ],
    "carboidratos": [
        "Arroz branco",
        "Arroz integral",
        "Macarrão",
        "Pão francês",
        "Pão de forma integral",
        "Pão de forma branco",
        "Aveia em flocos",
        "Farinha de trigo",
        "Farinha de mandioca",
        "Fubá",
        "Tapioca",
        "Batata inglesa",
        "Batata doce",
        "Mandioca/Aipim",
        "Inhame",
        "Cará",
        "Banana",
        "Maçã",
        "Laranja",
        "Mamão",
        "Melancia",
        "Abacaxi"
    ],
    "vegetais": [
        "Alface",
        "Tomate",
        "Cenoura",
        "Cebola",
        "Alho",
        "Chuchu",
        "Abobrinha",
        "Abóbora",
        "Beterraba",
        "Pepino",
        "Pimentão",
        "Couve",
        "Repolho",
        "Brócolis",
        "Couve-flor",
        "Vagem",
        "Espinafre",
        "Rúcula"
    ],
    "gorduras": [
        "Óleo de soja",
        "Azeite de oliva (pequenas quantidades)",
        "Manteiga",
        "Margarina",
        "Amendoim (torrado, sem casca)"
    ],
    "temperos": [
        "Sal",
        "Pimenta do reino",
        "Colorau",
        "Cominho",
        "Orégano",
        "Cheiro verde",
        "Limão",
        "Vinagre"
    ]
}

# ALIMENTOS PROIBIDOS - Caros ou difíceis de encontrar
ALIMENTOS_PROIBIDOS = [
    # Proteínas caras
    "Salmão",
    "Camarão",
    "Lagosta",
    "Bacalhau",
    "Atum fresco",
    "Picanha",
    "Filé mignon",
    "Cordeiro",
    "Whey protein",
    "Proteína isolada",
    "Creatina",
    "BCAA",
    
    # Grãos e cereais caros
    "Quinoa",
    "Amaranto",
    "Chia",
    "Linhaça dourada",
    "Granola gourmet",
    "Cereais importados",
    
    # Castanhas e nuts caros
    "Castanha de caju",
    "Castanha do Pará",
    "Nozes",
    "Amêndoas",
    "Pistache",
    "Avelã",
    "Macadâmia",
    "Mix de nuts",
    
    # Frutas caras ou exóticas
    "Açaí (bowl)",
    "Frutas vermelhas importadas",
    "Morango (fora de época)",
    "Kiwi",
    "Pera importada",
    "Uva importada",
    "Manga (fora de época)",
    "Frutas orgânicas premium",
    "Pitaya",
    "Lichia",
    
    # Superfoods e produtos especiais
    "Spirulina",
    "Chlorella",
    "Goji berry",
    "Maca peruana",
    "Óleo de coco extra virgem",
    "Ghee",
    "Manteiga de amêndoas",
    "Pasta de amendoim importada",
    "Tahine",
    "Produtos sem glúten premium",
    "Produtos veganos premium",
    "Barrinhas de proteína importadas",
    
    # Laticínios especiais
    "Queijos importados",
    "Iogurte grego premium",
    "Leite de amêndoas",
    "Leite de coco",
    "Cream cheese importado",
    
    # Outros
    "Alimentos orgânicos certificados",
    "Produtos diet/light premium",
    "Suplementos caros",
    "Bebidas isotônicas premium",
    "Shakes prontos importados"
]

def get_allowed_foods_text() -> str:
    """Retorna lista formatada de alimentos permitidos"""
    text = "ALIMENTOS PERMITIDOS (BARATOS E ACESSÍVEIS):\n\n"
    
    text += "Proteínas:\n"
    text += ", ".join(ALIMENTOS_PERMITIDOS["proteinas"][:10])
    text += "\n\n"
    
    text += "Carboidratos:\n"
    text += ", ".join(ALIMENTOS_PERMITIDOS["carboidratos"][:15])
    text += "\n\n"
    
    text += "Vegetais:\n"
    text += ", ".join(ALIMENTOS_PERMITIDOS["vegetais"][:12])
    text += "\n\n"
    
    text += "Gorduras:\n"
    text += ", ".join(ALIMENTOS_PERMITIDOS["gorduras"])
    
    return text

def get_forbidden_foods_text() -> str:
    """Retorna lista formatada de alimentos proibidos"""
    return "ALIMENTOS PROIBIDOS (CAROS/DIFÍCEIS):\n" + ", ".join(ALIMENTOS_PROIBIDOS[:30])

def validate_meal_plan(meal_text: str) -> tuple[bool, list]:
    """
    Valida se o plano alimentar contém alimentos proibidos
    
    Returns:
        tuple: (is_valid, forbidden_foods_found)
    """
    forbidden_found = []
    meal_lower = meal_text.lower()
    
    for forbidden in ALIMENTOS_PROIBIDOS:
        if forbidden.lower() in meal_lower:
            forbidden_found.append(forbidden)
    
    return len(forbidden_found) == 0, forbidden_found
