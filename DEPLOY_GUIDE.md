# 🚀 Guia de Deploy - NATAL25 ThinkFit

## Passo a Passo Completo para Deploy no Vercel

### 📋 Pré-requisitos

- ✅ Conta no GitHub
- ✅ Conta no Vercel
- ✅ Variáveis de ambiente configuradas localmente

---

## **PASSO 1: Inicializar Git e Fazer Commit**

### 1.1 Inicializar repositório Git

```bash
cd /Users/thiagoandrade/CascadeProjects/NATAL25
git init
```

### 1.2 Adicionar todos os arquivos

```bash
git add .
```

### 1.3 Fazer commit inicial

```bash
git commit -m "Initial commit: Landing page ThinkFit Natal 2025"
```

---

## **PASSO 2: Criar Repositório no GitHub**

### 2.1 Criar novo repositório

1. Acesse: https://github.com/new
2. Nome do repositório: `natal-thinkfit-2025` (ou outro nome de sua preferência)
3. Descrição: "Landing page de vendas do Cardápio de Natal ThinkFit 2025"
4. **NÃO** marque "Initialize with README" (já temos arquivos)
5. Clique em **"Create repository"**

### 2.2 Conectar repositório local ao GitHub

Após criar o repositório, GitHub mostrará comandos. Execute:

```bash
git remote add origin https://github.com/SEU_USUARIO/natal-thinkfit-2025.git
git branch -M main
git push -u origin main
```

**Substitua `SEU_USUARIO` pelo seu username do GitHub!**

---

## **PASSO 3: Configurar Variáveis de Ambiente no Vercel**

### 3.1 Criar projeto no Vercel

1. Acesse: https://vercel.com/new
2. Clique em **"Import Git Repository"**
3. Selecione o repositório `natal-thinkfit-2025`
4. Clique em **"Import"**

### 3.2 Configurar variáveis de ambiente

No dashboard do Vercel, vá em:
**Settings** → **Environment Variables**

Adicione as seguintes variáveis:

#### Variáveis Obrigatórias:

```
NEXT_PUBLIC_SUPABASE_URL
https://seu-projeto.supabase.co

NEXT_PUBLIC_SUPABASE_ANON_KEY
sua_anon_key_aqui

SUPABASE_SERVICE_ROLE_KEY
sua_service_role_key_aqui

NEXT_PUBLIC_SITE_URL
https://seu-dominio.vercel.app
```

#### Variáveis Opcionais (Email):

```
EMAIL_FROM
vendas@thinkfit.com.br

EMAIL_TO
vendas@thinkfit.com.br

SENDGRID_API_KEY
sua_sendgrid_key (se usar SendGrid)
```

### 3.3 Configurar Build Settings

- **Framework Preset**: Next.js (detectado automaticamente)
- **Root Directory**: `./` (raiz)
- **Build Command**: `npm run build` (padrão)
- **Output Directory**: `.next` (padrão)
- **Install Command**: `npm install` (padrão)

---

## **PASSO 4: Fazer Deploy**

### 4.1 Deploy automático

Após conectar o repositório e configurar as variáveis:

1. Clique em **"Deploy"**
2. Aguarde o build (2-5 minutos)
3. Quando concluir, você receberá uma URL: `https://seu-projeto.vercel.app`

### 4.2 Verificar deploy

- ✅ Acesse a URL fornecida
- ✅ Teste a landing page
- ✅ Verifique se os produtos carregam do Supabase
- ✅ Teste o formulário de pedido

---

## **PASSO 5: Atualizar NEXT_PUBLIC_SITE_URL**

Após o primeiro deploy:

1. Vá em **Settings** → **Environment Variables**
2. Atualize `NEXT_PUBLIC_SITE_URL` com a URL real do Vercel
3. Faça um novo deploy (ou aguarde o redeploy automático)

---

## **PASSO 6: Configurar Domínio Customizado (Opcional)**

### 6.1 Adicionar domínio

1. Vá em **Settings** → **Domains**
2. Adicione seu domínio (ex: `natal.thinkfit.com.br`)
3. Siga as instruções de DNS

### 6.2 Atualizar variável de ambiente

Atualize `NEXT_PUBLIC_SITE_URL` com o domínio customizado.

---

## ✅ Checklist Final

- [ ] Git inicializado e commit feito
- [ ] Repositório criado no GitHub
- [ ] Código enviado para GitHub
- [ ] Projeto criado no Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado com sucesso
- [ ] Site acessível e funcionando
- [ ] NEXT_PUBLIC_SITE_URL atualizado
- [ ] Testes realizados (produtos, carrinho, pedido)

---

## 🔧 Comandos Úteis

### Ver status do Git
```bash
git status
```

### Ver commits
```bash
git log --oneline
```

### Fazer novo commit após mudanças
```bash
git add .
git commit -m "Descrição das mudanças"
git push
```

### Ver logs do deploy no Vercel
```bash
vercel logs
```

---

## 🆘 Troubleshooting

### Erro: "Environment variables not found"
- Verifique se todas as variáveis foram adicionadas no Vercel
- Certifique-se de que não há espaços extras nos valores

### Erro: "Build failed"
- Verifique os logs no Vercel
- Confirme que todas as dependências estão no `package.json`
- Teste o build localmente: `npm run build`

### Erro: "Supabase connection failed"
- Verifique se as URLs e keys estão corretas
- Confirme que o projeto Supabase está ativo
- Verifique se as políticas RLS estão configuradas

---

## 📞 Próximos Passos

Após o deploy:
1. Testar fluxo completo de pedido
2. Configurar domínio customizado
3. Configurar e-mails transacionais (SendGrid/Resend)
4. Adicionar Google Analytics (opcional)
5. Configurar Meta Pixel (opcional)

