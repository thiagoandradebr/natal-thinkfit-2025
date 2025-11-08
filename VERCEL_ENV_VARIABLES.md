# 🔐 Variáveis de Ambiente para Vercel

## ⚠️ IMPORTANTE: Configure ANTES do Deploy!

No Vercel, antes de clicar em "Deploy", expanda a seção **"Environment Variables"** e adicione:

---

## ✅ Variáveis Obrigatórias

### 1. Supabase - URL do Projeto
```
Nome: NEXT_PUBLIC_SUPABASE_URL
Valor: https://seu-projeto-id.supabase.co
Ambiente: Production, Preview, Development
```

### 2. Supabase - Chave Anônima (Pública)
```
Nome: NEXT_PUBLIC_SUPABASE_ANON_KEY
Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Ambiente: Production, Preview, Development
```

### 3. Supabase - Service Role Key (Privada)
```
Nome: SUPABASE_SERVICE_ROLE_KEY
Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Ambiente: Production, Preview, Development
⚠️ Esta é uma chave PRIVADA - não compartilhe!
```

### 4. URL do Site (Atualizar após primeiro deploy)
```
Nome: NEXT_PUBLIC_SITE_URL
Valor: https://natal-thinkfit-2025.vercel.app
(ou sua URL customizada)
Ambiente: Production, Preview, Development
```

---

## 📧 Variáveis Opcionais (Email)

### 5. Email - Remetente
```
Nome: EMAIL_FROM
Valor: vendas@thinkfit.com.br
Ambiente: Production, Preview, Development
```

### 6. Email - Destinatário
```
Nome: EMAIL_TO
Valor: vendas@thinkfit.com.br
Ambiente: Production, Preview, Development
```

### 7. SendGrid API Key (se usar SendGrid)
```
Nome: SENDGRID_API_KEY
Valor: SG.xxxxx...
Ambiente: Production, Preview, Development
```

---

## 📝 Como Adicionar no Vercel

1. **Na página de configuração do projeto:**
   - Expanda a seção **"Environment Variables"**
   - Clique em **"Add"** para cada variável
   - Preencha Nome e Valor
   - Selecione os ambientes (Production, Preview, Development)

2. **Ou após o deploy:**
   - Vá em **Settings** → **Environment Variables**
   - Adicione as variáveis
   - Faça um novo deploy

---

## ⚠️ Atenção

- **NEXT_PUBLIC_SITE_URL**: Após o primeiro deploy, atualize com a URL real do Vercel
- **SUPABASE_SERVICE_ROLE_KEY**: Mantenha segura, não compartilhe publicamente
- Todas as variáveis com `NEXT_PUBLIC_` são expostas ao cliente (browser)
- Variáveis sem `NEXT_PUBLIC_` são apenas server-side

---

## ✅ Checklist

- [ ] NEXT_PUBLIC_SUPABASE_URL configurada
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY configurada
- [ ] SUPABASE_SERVICE_ROLE_KEY configurada
- [ ] NEXT_PUBLIC_SITE_URL configurada (pode atualizar depois)
- [ ] EMAIL_FROM configurada (opcional)
- [ ] EMAIL_TO configurada (opcional)

