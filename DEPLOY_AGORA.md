# 🚀 Deploy para Produção - Passo a Passo

## ✅ Status Atual

- ✅ Código commitado e enviado para o repositório
- ✅ Build testado localmente
- ✅ Código limpo e otimizado
- ✅ Documentação completa

---

## 📋 Passos para Deploy no Vercel

### 1. Acessar o Vercel

1. Acesse: https://vercel.com
2. Faça login com sua conta GitHub
3. Clique em **"Add New Project"** ou selecione o projeto existente

### 2. Conectar Repositório

1. Se for novo projeto:
   - Selecione o repositório: `thiagoandradebr/natal-thinkfit-2025`
   - Clique em **"Import"**

2. Se o projeto já existe:
   - O Vercel detectará automaticamente o novo commit
   - Ou clique em **"Redeploy"** na última versão

### 3. ⚠️ CONFIGURAR VARIÁVEIS DE AMBIENTE (OBRIGATÓRIO!)

**ANTES de clicar em "Deploy", configure as variáveis:**

1. Na tela de configuração do projeto, expanda **"Environment Variables"**
2. Adicione as seguintes variáveis:

#### Variáveis Obrigatórias:

```
NEXT_PUBLIC_SUPABASE_URL
Valor: https://seu-projeto-id.supabase.co
Ambientes: Production, Preview, Development

NEXT_PUBLIC_SUPABASE_ANON_KEY
Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Ambientes: Production, Preview, Development

SUPABASE_SERVICE_ROLE_KEY
Valor: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Ambientes: Production, Preview, Development
⚠️ Esta é uma chave PRIVADA - não compartilhe!

NEXT_PUBLIC_SITE_URL
Valor: https://seu-projeto.vercel.app
(Atualizar após primeiro deploy com a URL real)
Ambientes: Production, Preview, Development
```

#### Variáveis Opcionais (Email):

```
EMAIL_FROM
Valor: vendas@thinkfit.com.br
Ambientes: Production, Preview, Development

EMAIL_TO
Valor: vendas@thinkfit.com.br
Ambientes: Production, Preview, Development

SENDGRID_API_KEY
Valor: SG.xxxxx...
(Se usar SendGrid para envio de emails)
Ambientes: Production, Preview, Development
```

### 4. Configurações do Projeto

- **Framework Preset:** Next.js (detectado automaticamente)
- **Root Directory:** `./` (raiz do projeto)
- **Build Command:** `npm run build` (padrão)
- **Output Directory:** `.next` (padrão)
- **Install Command:** `npm install` (padrão)

### 5. Fazer Deploy

1. Clique em **"Deploy"**
2. Aguarde o build (2-5 minutos)
3. O Vercel mostrará a URL do deploy: `https://seu-projeto.vercel.app`

### 6. Atualizar NEXT_PUBLIC_SITE_URL

Após o primeiro deploy:

1. Copie a URL do projeto (ex: `https://natal-thinkfit-2025.vercel.app`)
2. Vá em **Settings** → **Environment Variables**
3. Edite `NEXT_PUBLIC_SITE_URL` com a URL real
4. Faça um novo deploy (ou aguarde o redeploy automático)

---

## 🔍 Verificação Pós-Deploy

### 1. Testar Funcionalidades

- [ ] Landing page carrega corretamente
- [ ] Produtos aparecem no cardápio
- [ ] Carrinho funciona
- [ ] Checkout funciona
- [ ] Admin funciona (login)
- [ ] APIs respondem corretamente

### 2. Verificar Logs

1. No Vercel, vá em **"Deployments"**
2. Clique no último deploy
3. Vá em **"Functions"** para ver logs das APIs
4. Verifique se há erros

### 3. Verificar Variáveis de Ambiente

1. Vá em **Settings** → **Environment Variables**
2. Confirme que todas as variáveis estão configuradas
3. Verifique se estão marcadas para **Production**

---

## 🐛 Troubleshooting

### Erro: "NEXT_PUBLIC_SUPABASE_URL não está configurada"

**Solução:** Adicione a variável de ambiente no Vercel e faça um novo deploy.

### Erro: "SUPABASE_SERVICE_ROLE_KEY não está configurada"

**Solução:** Adicione a variável de ambiente no Vercel (apenas server-side).

### Build falha

**Solução:** 
1. Verifique os logs do build no Vercel
2. Teste localmente: `npm run build`
3. Verifique se todas as dependências estão no `package.json`

### Página não carrega

**Solução:**
1. Verifique se o build foi bem-sucedido
2. Verifique os logs do Vercel
3. Verifique se as variáveis de ambiente estão configuradas

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs no Vercel
2. Verifique a documentação: `AUDITORIA_PRODUCAO.md`
3. Verifique as variáveis de ambiente: `VERCEL_ENV_VARIABLES.md`

---

## ✅ Checklist Final

- [ ] Código commitado e enviado para GitHub
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Deploy realizado com sucesso
- [ ] URL do site funcionando
- [ ] Funcionalidades testadas
- [ ] Logs verificados

---

**Status:** ✅ Pronto para Deploy!

**Último Commit:** 5329fbe - "chore: Limpeza de código para produção"


