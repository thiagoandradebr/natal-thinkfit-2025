# 🔐 Configurar Variáveis de Ambiente no Vercel

## 📍 Onde Encontrar os Valores no Supabase

### 1. Acesse o Dashboard do Supabase
- Vá para: https://supabase.com/dashboard
- Faça login na sua conta
- Selecione o projeto **ThinkFit** (ou o projeto que você está usando)

### 2. Encontre as Variáveis

#### **NEXT_PUBLIC_SUPABASE_URL**
1. No dashboard do Supabase, vá em **Settings** (⚙️) → **API**
2. Na seção **Project URL**, copie a URL
3. Exemplo: `https://xxxxx.supabase.co`

#### **NEXT_PUBLIC_SUPABASE_ANON_KEY**
1. Na mesma página (**Settings** → **API**)
2. Na seção **Project API keys**
3. Copie a chave **`anon` `public`**
4. Exemplo: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### **SUPABASE_SERVICE_ROLE_KEY**
1. Na mesma página (**Settings** → **API**)
2. Na seção **Project API keys**
3. Copie a chave **`service_role` `secret`**
4. ⚠️ **CUIDADO**: Esta chave tem acesso total ao banco! Não compartilhe!
5. Exemplo: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

#### **NEXT_PUBLIC_SITE_URL**
1. Use a URL que o Vercel forneceu após o deploy
2. Exemplo: `https://natal-thinkfit-2025.vercel.app`
3. Ou use a URL customizada se você configurou um domínio

---

## 🎯 Passo a Passo no Vercel

### 1. Acesse as Configurações
- No dashboard do Vercel, clique no projeto **natal-thinkfit-2025**
- Vá em **Settings** (no menu lateral)
- Clique em **Environment Variables**

### 2. Adicione Cada Variável

Para cada variável abaixo, clique em **"Add New"**:

#### Variável 1: NEXT_PUBLIC_SUPABASE_URL
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: [cole a URL do Supabase]
Environments: ☑ Production ☑ Preview ☑ Development
```

#### Variável 2: NEXT_PUBLIC_SUPABASE_ANON_KEY
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [cole a chave anon/public]
Environments: ☑ Production ☑ Preview ☑ Development
```

#### Variável 3: SUPABASE_SERVICE_ROLE_KEY
```
Key: SUPABASE_SERVICE_ROLE_KEY
Value: [cole a chave service_role/secret]
Environments: ☑ Production ☑ Preview ☑ Development
```

#### Variável 4: NEXT_PUBLIC_SITE_URL
```
Key: NEXT_PUBLIC_SITE_URL
Value: https://natal-thinkfit-2025.vercel.app
Environments: ☑ Production ☑ Preview ☑ Development
```

### 3. Salve e Faça Redeploy

Após adicionar todas as variáveis:

1. **Opção A - Redeploy Manual:**
   - Vá em **Deployments**
   - Clique nos **três pontos** (⋯) do último deploy
   - Selecione **"Redeploy"**
   - Confirme

2. **Opção B - Novo Commit:**
   - Faça qualquer alteração no código
   - Commit e push
   - O Vercel fará deploy automaticamente

---

## ✅ Checklist Final

- [ ] NEXT_PUBLIC_SUPABASE_URL configurada
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY configurada
- [ ] SUPABASE_SERVICE_ROLE_KEY configurada
- [ ] NEXT_PUBLIC_SITE_URL configurada
- [ ] Redeploy feito
- [ ] Site testado em produção

---

## 🧪 Testar Após Configurar

1. Acesse: https://natal-thinkfit-2025.vercel.app
2. Verifique se:
   - ✅ Página carrega sem erros
   - ✅ Produtos aparecem
   - ✅ Carrinho funciona
   - ✅ Checkout funciona
   - ✅ Pedidos são salvos no Supabase

---

## 🆘 Problemas Comuns

### Erro: "Failed to fetch"
- **Causa**: Variáveis de ambiente não configuradas
- **Solução**: Verifique se todas as variáveis foram adicionadas e faça redeploy

### Erro: "Invalid API key"
- **Causa**: Chave do Supabase incorreta
- **Solução**: Verifique se copiou a chave correta (anon vs service_role)

### Site carrega mas produtos não aparecem
- **Causa**: RLS (Row Level Security) pode estar bloqueando
- **Solução**: Verifique as políticas RLS no Supabase

---

## 📞 Precisa de Ajuda?

Se tiver dúvidas sobre onde encontrar as variáveis no Supabase, me avise!

