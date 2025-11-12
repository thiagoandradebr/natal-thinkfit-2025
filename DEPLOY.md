# 🚀 Guia de Deploy para Produção

Este guia vai te ajudar a colocar o projeto em produção na Vercel.

## ✅ Pré-requisitos

- Conta na [Vercel](https://vercel.com)
- Conta no [Supabase](https://supabase.com)
- Repositório Git (GitHub, GitLab ou Bitbucket)

## 📋 Passo a Passo

### 1. Preparar o Repositório Git

```bash
# Verificar se há mudanças não commitadas
git status

# Adicionar todas as mudanças
git add .

# Fazer commit
git commit -m "Preparar para produção"

# Fazer push para o repositório remoto
git push origin main
```

### 2. Configurar Variáveis de Ambiente na Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em **"Add New Project"**
3. Conecte seu repositório Git
4. Na página de configuração, vá em **"Environment Variables"**

Adicione as seguintes variáveis:

#### Variáveis Obrigatórias

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui

# Site URL (substitua pela URL final do seu site)
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com.br
```

#### Variáveis Opcionais (para notificações)

```env
# Email (SendGrid)
SENDGRID_API_KEY=sua_chave_sendgrid
EMAIL_FROM=vendas@thinkfit.com.br
EMAIL_TO=vendas@thinkfit.com.br

# WhatsApp (opcional)
WHATSAPP_PHONE=5511999999999
WHATSAPP_API_KEY=sua_chave_whatsapp
```

### 3. Configurações do Projeto na Vercel

- **Framework Preset**: Next.js (detectado automaticamente)
- **Root Directory**: `./` (raiz do projeto)
- **Build Command**: `npm run build` (padrão)
- **Output Directory**: `.next` (padrão)
- **Install Command**: `npm install` (padrão)

### 4. Deploy

1. Clique em **"Deploy"**
2. Aguarde o build completar (2-5 minutos)
3. Após o deploy, você receberá uma URL: `https://seu-projeto.vercel.app`

### 5. Configurar Domínio Personalizado (Opcional)

1. Na página do projeto na Vercel, vá em **"Settings" > "Domains"**
2. Adicione seu domínio personalizado
3. Configure os registros DNS conforme as instruções da Vercel

### 6. Verificar Deploy

Após o deploy, verifique:

- ✅ Site carregando corretamente
- ✅ Produtos aparecendo na página
- ✅ Formulário de pedido funcionando
- ✅ Painel admin acessível em `/admin`

## 🔧 Configurações Adicionais

### Configurar Supabase para Produção

1. No dashboard do Supabase, vá em **Settings > API**
2. Copie a **URL** e a **anon key**
3. Adicione essas variáveis na Vercel

### Configurar Storage no Supabase

1. No Supabase, vá em **Storage**
2. Certifique-se de que o bucket `products` existe
3. Configure as políticas:
   - **SELECT**: Público (qualquer um pode ler)
   - **INSERT/UPDATE/DELETE**: Apenas autenticados

### Configurar CORS (se necessário)

Se houver problemas de CORS, adicione no Supabase:
- Settings > API > CORS
- Adicione o domínio da Vercel: `https://seu-projeto.vercel.app`

## 🐛 Troubleshooting

### Build falha

- Verifique se todas as variáveis de ambiente estão configuradas
- Verifique os logs de build na Vercel
- Execute `npm run build` localmente para identificar erros

### Imagens não carregam

- Verifique se o bucket `products` está público no Supabase
- Verifique as políticas de Storage
- Verifique se as URLs das imagens estão corretas

### Erro de conexão com Supabase

- Verifique se `NEXT_PUBLIC_SUPABASE_URL` está correto
- Verifique se `NEXT_PUBLIC_SUPABASE_ANON_KEY` está correto
- Verifique se o projeto Supabase está ativo

## 📊 Monitoramento

Após o deploy, monitore:

- **Vercel Analytics**: Métricas de performance
- **Supabase Dashboard**: Uso do banco de dados
- **Logs da Vercel**: Erros e warnings

## 🔄 Atualizações Futuras

Para fazer atualizações:

1. Faça as mudanças no código
2. Commit e push para o repositório
3. A Vercel fará deploy automático (se configurado)
4. Ou faça deploy manual na Vercel

## 📞 Suporte

Se precisar de ajuda:
- Documentação Vercel: https://vercel.com/docs
- Documentação Supabase: https://supabase.com/docs
- Documentação Next.js: https://nextjs.org/docs

---

**Pronto!** Seu site está em produção! 🎉

