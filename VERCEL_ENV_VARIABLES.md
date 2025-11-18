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

## 📊 Analytics e Tracking (Opcional mas Recomendado)

### 5. Facebook Pixel ID
```
Nome: NEXT_PUBLIC_FACEBOOK_PIXEL_ID
Valor: 592535497822145
Ambiente: Production, Preview, Development
```
⚠️ **Importante**: Esta variável é necessária para rastreamento de conversões e campanhas no Facebook/Meta Ads.

### 6. Google Analytics 4 (GA4)
```
Nome: NEXT_PUBLIC_GA_MEASUREMENT_ID
Valor: G-LMLCX41SYL
Ambiente: Production, Preview, Development
```
📊 **Uso**: Métricas completas de tráfego, comportamento e conversões. Veja `IMPLEMENTAR_GOOGLE_ANALYTICS.md`

### 7. Microsoft Clarity
```
Nome: NEXT_PUBLIC_CLARITY_PROJECT_ID
Valor: xxxxxxxxxx
Ambiente: Production, Preview, Development
```
🔍 **Uso**: Gravações de sessão, heatmaps e insights de UX. Veja `IMPLEMENTAR_MICROSOFT_CLARITY.md`

### 8. Google Tag Manager (GTM) - Opcional
```
Nome: NEXT_PUBLIC_GTM_CONTAINER_ID
Valor: GTM-XXXXXXX
Ambiente: Production, Preview, Development
```
🏷️ **Uso**: Gerenciar todas as tags de tracking em um só lugar. Veja `ANALYTICS_E_METRICAS.md`

## 📧 Variáveis Opcionais (Email)

### 9. Email - Remetente
```
Nome: EMAIL_FROM
Valor: vendas@thinkfit.com.br
Ambiente: Production, Preview, Development
```

### 10. Email - Destinatário
```
Nome: EMAIL_TO
Valor: vendas@thinkfit.com.br
Ambiente: Production, Preview, Development
```

### 11. SendGrid API Key (se usar SendGrid)
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

### Variáveis Obrigatórias
- [ ] NEXT_PUBLIC_SUPABASE_URL configurada
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY configurada
- [ ] SUPABASE_SERVICE_ROLE_KEY configurada
- [ ] NEXT_PUBLIC_SITE_URL configurada (pode atualizar depois)

### Analytics e Tracking (Recomendado)
- [ ] NEXT_PUBLIC_FACEBOOK_PIXEL_ID configurada
- [ ] NEXT_PUBLIC_GA_MEASUREMENT_ID configurada (opcional)
- [ ] NEXT_PUBLIC_CLARITY_PROJECT_ID configurada (opcional)
- [ ] NEXT_PUBLIC_GTM_CONTAINER_ID configurada (opcional)

### Email (Opcional)
- [ ] EMAIL_FROM configurada
- [ ] EMAIL_TO configurada
- [ ] SENDGRID_API_KEY configurada (se usar SendGrid)

