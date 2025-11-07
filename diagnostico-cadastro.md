# 🔍 Diagnóstico - Erro no Cadastro

## Como Investigar o Erro

### 1️⃣ Abrir Console do Navegador
1. Pressione **F12** (ou Ctrl+Shift+I)
2. Vá para a aba **"Console"**
3. Tente fazer o cadastro
4. Procure por mensagens em **vermelho**
5. **Copie e cole** as mensagens de erro

### 2️⃣ Verificar Network
1. No F12, vá para a aba **"Network"**
2. Clique em **"Fetch/XHR"**
3. Tente fazer o cadastro
4. Procure pela requisição **"register"**
5. Clique nela e veja:
   - **Status Code**: (deve ser 201 ou 200)
   - **Response**: (mensagem de erro se houver)
   - **Preview**: (dados retornados)

### 3️⃣ Verificar Dados do Formulário
1. Abra o Console (F12)
2. Antes de submeter, cole este código:
```javascript
document.querySelector('form').addEventListener('submit', (e) => {
  const formData = new FormData(e.target);
  console.log('Dados do formulário:', Object.fromEntries(formData));
});
```
3. Tente fazer o cadastro
4. Veja os dados no console

## Possíveis Causas e Soluções

### ❌ Erro: "Network Error" ou "Failed to fetch"
**Causa:** Backend não está acessível
**Solução:**
```bash
# Verificar se backend está rodando
sudo supervisorctl status backend

# Se não estiver, reiniciar
sudo supervisorctl restart backend
```

### ❌ Erro: "401 Unauthorized"
**Causa:** Problema com autenticação
**Solução:** Não deveria acontecer no registro (não precisa auth)

### ❌ Erro: "400 Bad Request"
**Causa:** Dados inválidos sendo enviados
**Solução:** Verificar validação dos campos (idade, peso, altura)

### ❌ Erro: "Email já cadastrado"
**Causa:** Email já existe no banco
**Solução:** Use outro email ou delete o usuário existente:
```bash
# Conectar ao MongoDB
mongosh test_database

# Deletar usuário
db.users.deleteOne({"email": "seu@email.com"})
```

### ❌ Erro: "CORS"
**Causa:** Problema de CORS entre frontend e backend
**Solução:** Backend já está configurado com CORS *, não deveria acontecer

### ❌ Formulário não submete (nada acontece)
**Causa:** Validação do formulário falhando
**Solução:** 
1. Verificar se todos os campos obrigatórios estão preenchidos
2. Verificar se senha tem mínimo 8 caracteres
3. Verificar se senhas coincidem
4. Verificar se idade está entre 12-100
5. Verificar se peso está entre 30-300
6. Verificar se altura está entre 120-250

## Testes Manuais

### Testar Backend Diretamente
```bash
# Teste de saúde
curl https://fitgenai.preview.emergentagent.com/api/health

# Teste de registro
curl -X POST https://fitgenai.preview.emergentagent.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "teste123@email.com",
    "password": "senha12345",
    "full_name": "Usuario Teste",
    "age": 25,
    "weight": 70.5,
    "height": 175,
    "objectives": "Ganhar massa",
    "dietary_restrictions": "Nenhuma",
    "training_type": "academia",
    "current_activities": "Caminhada"
  }'
```

### Verificar Logs do Backend
```bash
# Ver logs mais recentes
tail -50 /var/log/supervisor/backend.err.log

# Ver logs em tempo real
tail -f /var/log/supervisor/backend.err.log
```

## Checklist de Verificação

- [ ] Backend está rodando?
- [ ] Frontend está rodando?
- [ ] Console do navegador mostra algum erro?
- [ ] Network tab mostra a requisição falhando?
- [ ] Qual é o status code da requisição?
- [ ] Todos os campos obrigatórios estão preenchidos?
- [ ] Senhas coincidem?
- [ ] Valores estão dentro dos limites (idade, peso, altura)?
- [ ] Email já não está cadastrado?

## Me Envie Essas Informações

Para eu poder te ajudar melhor, me envie:

1. **Screenshot do erro** (se aparecer mensagem visual)
2. **Erro do Console** (F12 → Console → texto em vermelho)
3. **Response da requisição** (F12 → Network → register → Response)
4. **Status Code** (F12 → Network → register → Status)
5. **Dados que você está tentando cadastrar** (sem a senha!)

---

**Última atualização:** 07/11/2024
