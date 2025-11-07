# 📋 Formato Padrão de Treinos e Dietas - FitLife AI

## 🎯 Objetivo

Garantir que todos os treinos e planos nutricionais gerados pela IA sigam um padrão consistente, organizado e visualmente agradável.

## 💪 FORMATO DE TREINOS

### Estrutura Obrigatória:

```
PLANO DE TREINO - [NOME DO USUÁRIO]

FREQUÊNCIA
[Descrição da frequência semanal]

DIVISÃO
[Tipo de divisão: ABC, Upper/Lower, Full Body, etc]

DIA A - [GRUPO MUSCULAR]

AQUECIMENTO
1. [Exercício] - [tempo/repetições]
2. [Exercício] - [tempo/repetições]

TREINO PRINCIPAL
1. [Nome do exercício]
   Séries: [número], Repetições: [número], Descanso: [tempo]

2. [Nome do exercício]
   Séries: [número], Repetições: [número], Descanso: [tempo]

ALONGAMENTO
1. [Músculo] - [tempo]
2. [Músculo] - [tempo]

[Repetir para outros dias]

DICAS IMPORTANTES
- [Dica 1]
- [Dica 2]

PROGRESSÃO
[Orientações de progressão]

OBSERVAÇÕES
[Avisos de segurança]
```

### Regras de Formatação:

✅ **USAR:**
- MAIÚSCULAS para títulos de seções (DIA A, AQUECIMENTO, TREINO PRINCIPAL)
- Numeração (1., 2., 3.) para exercícios
- Travessão (-) para listas de dicas
- Séries e repetições em linhas separadas
- Espaçamento consistente

❌ **NÃO USAR:**
- Asteriscos (**) para negrito
- Tabelas markdown (|---|)
- Formatação excessiva
- Emojis no texto (já são adicionados automaticamente)

### Exemplo Visual (como aparece no app):

```
🏋️ DIA A - PEITO E TRÍCEPS

🔥 AQUECIMENTO
  • Polichinelos - 3 minutos
  • Rotação de braços - 2 minutos

💪 TREINO PRINCIPAL
  🎯 Supino reto
     ⟳ Séries: 4, Repetições: 12, Descanso: 90s
  
  🎯 Crucifixo com halteres
     ⟳ Séries: 3, Repetições: 15, Descanso: 60s

🧘 ALONGAMENTO
  • Peitoral - 30 segundos
  • Tríceps - 30 segundos

💡 DICAS IMPORTANTES
  ⚠️ Mantenha a postura correta durante todo o movimento
  ⚠️ Respire adequadamente: expire na força
```

## 🍎 FORMATO DE NUTRIÇÃO

### Estrutura Obrigatória:

```
PLANO NUTRICIONAL - [NOME DO USUÁRIO]

METAS DIÁRIAS
Calorias: [valor] kcal
Proteínas: [valor]g
Carboidratos: [valor]g
Gorduras: [valor]g

CAFÉ DA MANHÃ
1. [Alimento] - [quantidade]
2. [Alimento] - [quantidade]
Total: [calorias aproximadas]

LANCHE DA MANHÃ
1. [Alimento] - [quantidade]
Total: [calorias aproximadas]

ALMOÇO
1. [Alimento] - [quantidade]
2. [Alimento] - [quantidade]
3. [Alimento] - [quantidade]
Total: [calorias aproximadas]

LANCHE DA TARDE
1. [Alimento] - [quantidade]
Total: [calorias aproximadas]

JANTAR
1. [Alimento] - [quantidade]
2. [Alimento] - [quantidade]
Total: [calorias aproximadas]

CEIA
1. [Alimento] - [quantidade]
Total: [calorias aproximadas]

LISTA DE COMPRAS SEMANAL
- [Item] - Preço aproximado: R$ [valor]
- [Item] - Preço aproximado: R$ [valor]
Total estimado: R$ [valor]

DICAS DE PREPARO
- [Dica 1]
- [Dica 2]

DICAS DE ECONOMIA
- [Dica 1]
- [Dica 2]

SUBSTITUIÇÕES POSSÍVEIS
- [Alimento] pode ser substituído por [alternativa]

OBSERVAÇÕES IMPORTANTES
- [Observação 1]
- [Observação 2]
```

### Regras de Formatação:

✅ **USAR:**
- MAIÚSCULAS para refeições (CAFÉ DA MANHÃ, ALMOÇO, JANTAR)
- Numeração para alimentos (1., 2., 3.)
- Travessão (-) para listas
- Quantidade sempre após o alimento
- Total de calorias ao final de cada refeição

❌ **NÃO USAR:**
- Asteriscos ou formatação markdown
- Tabelas
- Alimentos caros (castanhas importadas, salmão, quinoa)
- Emojis no texto

### Exemplo Visual (como aparece no app):

```
☕ CAFÉ DA MANHÃ

  🥘 2 ovos mexidos - 3 unidades
     Ovos são fonte de proteína completa

  🥘 Pão integral - 2 fatias
     Carboidrato de absorção lenta

  🥘 Banana - 1 unidade média
     Energia rápida e potássio

  Total: 350 kcal

💰 LISTA DE COMPRAS SEMANAL
  • Ovos (dúzia) - R$ 8,00
  • Frango (1kg) - R$ 12,00
  • Arroz (5kg) - R$ 20,00
  
  Total estimado: R$ 120,00

💡 DICAS DE ECONOMIA
  ⚠️ Compre frutas da estação
  ⚠️ Prepare as refeições com antecedência
```

## 🎨 Componentes de Visualização

### Frontend automaticamente adiciona:

**Treinos:**
- 🔥 Emoji de aquecimento
- 💪 Emoji de treino principal
- 🧘 Emoji de alongamento
- 🎯 Ícones para exercícios
- ⟳ Ícones para séries/repetições
- 💡 Ícones para dicas

**Nutrição:**
- ☕ Emoji de café da manhã
- 🍽️ Emoji de almoço
- 🌙 Emoji de jantar
- 🥘 Ícones para alimentos
- 💰 Ícones para preços
- 💡 Ícones para dicas

## ✅ Benefícios do Formato Padrão

1. **Consistência Visual:** Todos os planos têm a mesma aparência
2. **Fácil Leitura:** Hierarquia clara de informações
3. **Profissionalismo:** Layout organizado e limpo
4. **Satisfação do Usuário:** Experiência agradável e previsível
5. **Facilidade de Uso:** Informações fáceis de encontrar

## 🔄 Atualização dos Prompts

Os prompts do Gemini foram atualizados em `/app/backend/gemini_service.py` para:

- Instruir o modelo a seguir EXATAMENTE o formato especificado
- Incluir exemplos de estrutura
- Especificar regras claras de formatação
- Proibir o uso de asteriscos e tabelas markdown
- Garantir consistência em todas as gerações

## 📱 Como Testar

1. Acesse o dashboard
2. Gere um novo treino
3. Gere uma nova dieta
4. Verifique se o formato está consistente
5. Todos os elementos devem estar bem organizados e visualmente agradáveis

---

**Última atualização:** 07/11/2024
**Versão:** 1.0
