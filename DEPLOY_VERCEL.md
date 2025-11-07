# 🚀 Guia de Deploy no Vercel - FitLife AI

## ⚠️ IMPORTANTE: Estrutura do Projeto

Este projeto tem uma estrutura **monorepo** com frontend e backend separados:
```
/app/
├── frontend/          # React + Vite (Deploy no Vercel)
├── backend/           # FastAPI (Deploy separado)
└── vercel.json        # ❌ NÃO EXISTE (removido)
```

## 📋 Passo a Passo para Deploy

### 1️⃣ Configuração no Dashboard do Vercel

Ao importar o projeto do GitHub, configure:

**Build & Development Settings:**
```
Framework Preset: Vite
Root Directory: frontend          ⚠️ CRÍTICO!
Build Command: yarn build
Output Directory: build
Install Command: yarn install
Node.js Version: 18.x
```

### 2️⃣ Variáveis de Ambiente

Adicione em **Environment Variables** no Vercel:

```
VITE_BACKEND_URL = https://smart-workout-38.preview.emergentagent.com
```

⚠️ **IMPORTANTE:** Adicione para todos os ambientes (Production, Preview, Development)

### 3️⃣ Deploy

1. Faça commit das alterações:
```bash
git add .
git commit -m "Configure Vercel deployment"
git push origin main
```

2. No Vercel Dashboard:
   - Clique em **"Deploy"**
   - Aguarde o build completar

## 🔍 Resolução de Problemas

### ❌ Erro: "vite: command not found"
**Causa:** Root Directory não está configurado como `frontend`
**Solução:** Configurar Root Directory = `frontend` no Vercel

### ❌ Erro: "NOT_FOUND"
**Causa:** Vercel não encontrou o package.json correto
**Solução:** Verificar se Root Directory = `frontend`

### ❌ Erro: Build bem-sucedido mas site não carrega
**Causa:** Variável de ambiente `VITE_BACKEND_URL` não configurada
**Solução:** Adicionar a variável de ambiente no Vercel

### ❌ API calls falham (401/403/404)
**Causa:** Backend URL incorreto ou CORS
**Solução:** 
1. Verificar `VITE_BACKEND_URL` está correto
2. Verificar backend está rodando
3. Verificar CORS no backend permite o domínio do Vercel

## 🏗️ Arquitetura de Deploy

```
┌─────────────────────┐
│   Vercel            │
│   (Frontend Only)   │
│   ↓                 │
│   React App         │
└──────┬──────────────┘
       │ API Calls
       ↓
┌─────────────────────┐
│   Emergent          │
│   (Backend Only)    │
│   ↓                 │
│   FastAPI + MongoDB │
└─────────────────────┘
```

## ✅ Checklist Final

Antes do deploy, confirme:

- [ ] Root Directory = `frontend` no Vercel
- [ ] Build Command = `yarn build`
- [ ] Output Directory = `build`
- [ ] Variável `VITE_BACKEND_URL` configurada
- [ ] Backend está rodando e acessível
- [ ] CORS configurado no backend
- [ ] Commit e push feitos

## 🎯 URLs do Projeto

- **Frontend (Vercel):** https://seu-projeto.vercel.app
- **Backend (Emergent):** https://smart-workout-38.preview.emergentagent.com
- **API Endpoint:** https://smart-workout-38.preview.emergentagent.com/api

## 📝 Notas Importantes

1. **O Vercel só hospeda o frontend**
   - É uma plataforma para static sites e serverless functions
   - Não suporta FastAPI/Python diretamente

2. **Backend permanece no Emergent**
   - Ou pode ser deployado em: Railway, Render, Heroku, DigitalOcean

3. **Comunicação Frontend ↔ Backend**
   - Frontend faz chamadas HTTP para o backend
   - Configurado via `VITE_BACKEND_URL`

4. **Arquivos de configuração**
   - `frontend/vercel.json` - Rewrites para API calls
   - `.vercelignore` - Arquivos ignorados no deploy
   - `vite.config.ts` - Build configuration

## 🆘 Suporte

Se encontrar problemas:
1. Verifique logs do build no Vercel
2. Verifique console do browser (F12)
3. Verifique Network tab para chamadas API
4. Teste o backend diretamente: `https://smart-workout-38.preview.emergentagent.com/api/health`

## 🔄 Próximos Deploys

Após o primeiro deploy bem-sucedido, deployments futuros são automáticos:
- Push para `main` → Deploy automático em Production
- Pull Request → Deploy de Preview automático

---

**Última atualização:** 06/11/2024
**Projeto:** FitLife AI
**Stack:** React + Vite + FastAPI + MongoDB
