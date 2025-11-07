# 💪 FitLife AI - Personal Fitness Assistant

Aplicação completa de fitness com geração de treinos e planos nutricionais personalizados usando IA.

## 🚀 Stack Tecnológica

- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** FastAPI + Python 3.11 + MongoDB
- **Autenticação:** JWT (JSON Web Tokens)
- **IA:** Google Gemini via Emergent LLM Key
- **UI Components:** Radix UI + shadcn/ui

## 📁 Estrutura do Projeto

```
/app/
├── frontend/          # Aplicação React
│   ├── src/
│   │   ├── pages/           # Páginas (Register, Login, Dashboard)
│   │   ├── components/      # Componentes reutilizáveis
│   │   ├── contexts/        # React Contexts (Auth)
│   │   ├── services/        # API services
│   │   └── types/           # TypeScript types
│   ├── package.json
│   ├── vite.config.ts
│   └── vercel.json          # Configuração Vercel
├── backend/           # API FastAPI
│   ├── server.py            # Endpoints principais
│   ├── models.py            # Modelos Pydantic
│   ├── auth.py              # Sistema de autenticação
│   ├── gemini_service.py    # Integração Gemini AI
│   └── requirements.txt
└── DEPLOY_VERCEL.md   # Guia de deploy

## ✨ Funcionalidades

### 1. Sistema de Autenticação
- ✅ Registro com perfil completo
- ✅ Login com JWT
- ✅ Logout
- ✅ Proteção de rotas

### 2. Cadastro Completo
- Nome, email e senha
- Idade (12-100 anos)
- Peso (30-300kg com decimais)
- Altura (120-250cm)
- Objetivos fitness
- Tipo de treino (Academia/Casa/Ao ar livre)
- Atividades físicas atuais
- Restrições alimentares

### 3. Dashboard com 3 Abas

#### 📊 Sugestões IA
- Geração de treinos personalizados com IA
- Geração de planos nutricionais com IA
- Adaptados ao perfil do usuário

#### 📜 Histórico
- Visualização de treinos gerados
- Visualização de dietas geradas
- Deletar sugestões antigas

#### 👤 Perfil
- Informações pessoais completas
- Cálculo automático de IMC
- Edição de perfil
- Exclusão de conta

### 4. IA Personalizada (Gemini)
- Treinos adaptados ao local escolhido
- Considera atividades físicas atuais
- Nutrição focada em alimentos acessíveis
- Prompts otimizados para resultados práticos

## 🛠️ Desenvolvimento Local

### Pré-requisitos
- Node.js 18+
- Python 3.11+
- MongoDB
- Yarn

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

### Frontend

```bash
cd frontend
yarn install
yarn dev
```

Acesse: `http://localhost:3000`

## 🚀 Deploy

### Frontend (Vercel)
Siga as instruções em [DEPLOY_VERCEL.md](./DEPLOY_VERCEL.md)

**Resumo:**
1. Configure Root Directory: `frontend`
2. Build Command: `yarn build`
3. Output Directory: `build`
4. Adicione variável: `VITE_BACKEND_URL`

### Backend (Emergent/Railway/Render)
O backend pode ser deployado em:
- Emergent (atual)
- Railway
- Render
- Heroku
- DigitalOcean

## 🔑 Variáveis de Ambiente

### Frontend (.env)
```env
VITE_BACKEND_URL=https://seu-backend.com
```

### Backend (.env)
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=fitlife_db
SECRET_KEY=sua-chave-secreta
EMERGENT_LLM_KEY=sua-chave-gemini
CORS_ORIGINS=*
```

## 📡 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Fazer login

### Perfil
- `GET /api/profile` - Obter perfil
- `PUT /api/profile` - Atualizar perfil
- `DELETE /api/user` - Deletar conta

### Sugestões IA
- `POST /api/suggestions/workout` - Gerar treino
- `POST /api/suggestions/nutrition` - Gerar dieta
- `GET /api/suggestions/history` - Histórico
- `DELETE /api/suggestions/{id}` - Deletar sugestão

## 🧪 Testes

### Backend
```bash
cd backend
python backend_test.py
```

### Frontend
```bash
cd frontend
yarn test
```

## 📝 Notas Importantes

1. **Gemini AI:** Utiliza Emergent LLM Key para acesso unificado
2. **JWT Tokens:** Validade de 7 dias
3. **MongoDB:** Utiliza UUIDs ao invés de ObjectIDs
4. **CORS:** Configurado para aceitar requisições do frontend

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Desenvolvido por

FitLife AI - Assistente pessoal de fitness com IA

---

**Última atualização:** Novembro 2024
