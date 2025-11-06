#!/bin/bash

# FitLife AI - Deploy Checklist Script
# Este script verifica se tudo está pronto para deploy no Vercel

echo "🚀 FitLife AI - Deploy Checklist"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check counter
CHECKS_PASSED=0
CHECKS_FAILED=0

# Function to check
check() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((CHECKS_PASSED++))
    else
        echo -e "${RED}✗${NC} $2"
        ((CHECKS_FAILED++))
    fi
}

# 1. Check if frontend directory exists
echo "📁 Verificando estrutura do projeto..."
if [ -d "frontend" ]; then
    check 0 "Diretório frontend existe"
else
    check 1 "Diretório frontend não encontrado"
fi

# 2. Check if package.json exists in frontend
if [ -f "frontend/package.json" ]; then
    check 0 "package.json encontrado"
else
    check 1 "package.json não encontrado em frontend/"
fi

# 3. Check if vite.config.ts exists
if [ -f "frontend/vite.config.ts" ]; then
    check 0 "vite.config.ts configurado"
else
    check 1 "vite.config.ts não encontrado"
fi

# 4. Check if vercel.json exists in frontend
if [ -f "frontend/vercel.json" ]; then
    check 0 "vercel.json encontrado em frontend/"
else
    check 1 "vercel.json não encontrado em frontend/"
fi

# 5. Check if there's NO vercel.json in root (should be removed)
if [ ! -f "vercel.json" ]; then
    check 0 "vercel.json não existe na raiz (correto)"
else
    check 1 "vercel.json existe na raiz (deve ser removido)"
fi

# 6. Check if .env.example exists
if [ -f "frontend/.env.example" ]; then
    check 0 ".env.example existe"
else
    check 1 ".env.example não encontrado"
fi

# 7. Check if .vercelignore exists
if [ -f ".vercelignore" ]; then
    check 0 ".vercelignore configurado"
else
    check 1 ".vercelignore não encontrado"
fi

# 8. Check build output directory in vite.config
if grep -q "outDir: 'build'" frontend/vite.config.ts; then
    check 0 "Output directory configurado como 'build'"
else
    check 1 "Output directory não está configurado corretamente"
fi

# 9. Check if node_modules is in .gitignore
if [ -f ".gitignore" ] && grep -q "node_modules" .gitignore; then
    check 0 "node_modules está no .gitignore"
else
    check 1 "node_modules não está no .gitignore"
fi

# 10. Check if backend is ignored for Vercel
if grep -q "backend" .vercelignore; then
    check 0 "Backend ignorado no deploy (correto)"
else
    check 1 "Backend não está no .vercelignore"
fi

echo ""
echo "=================================="
echo "Resultado do Checklist:"
echo -e "${GREEN}✓ Checks passados: $CHECKS_PASSED${NC}"
echo -e "${RED}✗ Checks falhos: $CHECKS_FAILED${NC}"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 Tudo pronto para deploy!${NC}"
    echo ""
    echo "Próximos passos:"
    echo "1. git add ."
    echo "2. git commit -m 'Configure Vercel deployment'"
    echo "3. git push origin main"
    echo "4. Configure no Vercel Dashboard:"
    echo "   - Root Directory: frontend"
    echo "   - Build Command: yarn build"
    echo "   - Output Directory: build"
    echo "   - Environment Variable: REACT_APP_BACKEND_URL"
    exit 0
else
    echo -e "${RED}⚠️  Alguns checks falharam. Corrija antes de fazer deploy.${NC}"
    echo ""
    echo "Leia o guia completo em: DEPLOY_VERCEL.md"
    exit 1
fi
