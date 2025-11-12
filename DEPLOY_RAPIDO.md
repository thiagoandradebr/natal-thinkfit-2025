# ⚡ Deploy Rápido - 5 Minutos

## 🚀 Deploy na Vercel (Mais Rápido)

### Opção 1: Via CLI da Vercel (Recomendado)

```bash
# 1. Instalar Vercel CLI (se ainda não tiver)
npm i -g vercel

# 2. Fazer login
vercel login

# 3. Deploy
vercel

# 4. Configurar variáveis de ambiente
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_SITE_URL

# 5. Deploy de produção
vercel --prod
```

### Opção 2: Via Dashboard Vercel

1. Acesse: https://vercel.com/new
2. Conecte seu repositório Git
3. Configure as variáveis de ambiente (veja abaixo)
4. Clique em "Deploy"

## 🔑 Variáveis de Ambiente Necessárias

Configure estas variáveis na Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
NEXT_PUBLIC_SITE_URL=https://seu-dominio.vercel.app
```

**Onde encontrar:**
- Supabase Dashboard > Settings > API
- Copie a URL e as chaves

## ✅ Checklist Pré-Deploy

- [x] Build local funcionando (`npm run build`)
- [ ] Variáveis de ambiente configuradas
- [ ] Supabase configurado e ativo
- [ ] Storage bucket `products` criado e público
- [ ] Migrações do banco executadas

## 🎯 Após o Deploy

1. Teste a URL fornecida pela Vercel
2. Verifique se os produtos aparecem
3. Teste o formulário de pedido
4. Acesse `/admin` e faça login

## 📝 Próximos Passos

- Configurar domínio personalizado (opcional)
- Configurar notificações de email (SendGrid)
- Configurar WhatsApp (opcional)

---

**Tempo estimado:** 5-10 minutos

