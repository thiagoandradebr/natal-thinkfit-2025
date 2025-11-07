# 🎄 Cardápio de Natal ThinkFit 2025

Landing page de alta conversão para vendas do Cardápio de Natal ThinkFit, com painel administrativo completo para gestão de produtos, pedidos e configurações.

## 🚀 Stack Tecnológica

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: TailwindCSS
- **Animações**: Framer Motion
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Deploy**: Vercel
- **Ícones**: Lucide React

## 📋 Funcionalidades

### Landing Page
- ✅ Hero section com CTAs de alta conversão
- ✅ Cardápio de produtos com filtros e modal de detalhes
- ✅ Carrinho de compras integrado
- ✅ Formulário de pedido com validação
- ✅ Seção de diferenciais e FAQ
- ✅ Design responsivo e otimizado para mobile
- ✅ Animações suaves e microinterações
- ✅ SEO otimizado

### Painel Administrativo
- ✅ CRUD completo de produtos
- ✅ Upload de imagens para Supabase Storage
- ✅ Gestão de pedidos e status de pagamento
- ✅ Controle de estoque
- ✅ Configurações editáveis do site
- ✅ Autenticação segura

### Sistema de Notificações
- ✅ E-mail automático para admin e cliente
- ✅ Integração WhatsApp (preparado para API)
- ✅ Confirmação de pedido

## 🛠️ Instalação e Configuração

### 1. Clonar o Repositório

```bash
git clone <repository-url>
cd NATAL25
```

### 2. Instalar Dependências

```bash
npm install
```

### 3. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Email (SendGrid ou SMTP)
SENDGRID_API_KEY=your_sendgrid_api_key
EMAIL_FROM=vendas@thinkfit.com.br
EMAIL_TO=vendas@thinkfit.com.br

# WhatsApp (opcional)
WHATSAPP_PHONE=5511999999999
WHATSAPP_API_KEY=your_whatsapp_api_key

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Configurar Banco de Dados Supabase

#### Opção A: Usando Supabase MCP (Recomendado)

Se você já tem o Supabase MCP configurado no projeto:

```bash
# As migrações serão aplicadas automaticamente via MCP
```

#### Opção B: Manual via Dashboard Supabase

1. Acesse o dashboard do Supabase
2. Vá em **SQL Editor**
3. Execute os scripts na ordem:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_seed_produtos.sql`

### 5. Configurar Storage no Supabase

1. No dashboard do Supabase, vá em **Storage**
2. Crie um bucket chamado `products`
3. Configure as políticas de acesso:
   - **SELECT**: Público (anyone can read)
   - **INSERT/UPDATE/DELETE**: Apenas autenticados

### 6. Executar em Desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3000`

## 📁 Estrutura do Projeto

```
NATAL25/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── pedido/
│   │   │       └── route.ts          # API de criação de pedidos
│   │   ├── obrigado/
│   │   │   └── page.tsx              # Página de agradecimento
│   │   ├── esgotado/
│   │   │   └── page.tsx              # Página de produtos esgotados
│   │   ├── layout.tsx                # Layout principal
│   │   ├── page.tsx                  # Landing page
│   │   └── globals.css               # Estilos globais
│   ├── components/
│   │   ├── Header.tsx                # Cabeçalho fixo
│   │   ├── Hero.tsx                  # Seção hero
│   │   ├── ProductCard.tsx           # Card de produto
│   │   ├── ProductModal.tsx          # Modal de detalhes
│   │   ├── OrderForm.tsx             # Formulário de pedido
│   │   └── Footer.tsx                # Rodapé
│   ├── lib/
│   │   └── supabase.ts               # Cliente Supabase
│   └── types/
│       └── database.ts               # Tipos TypeScript
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql    # Schema do banco
│       └── 002_seed_produtos.sql     # Dados iniciais
├── cms-seed/
│   └── produtos-natal.json           # Seed de produtos (JSON)
├── public/
│   └── images/                       # Imagens estáticas
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🎨 Personalização

### Cores e Tema

Edite `tailwind.config.ts`:

```typescript
colors: {
  background: 'rgb(23, 23, 28)',
  primary: {
    gold: '#D4AF37',
    emerald: '#50C878',
  },
  // ...
}
```

### Textos e Configurações

Os textos principais são editáveis via banco de dados na tabela `configuracoes_site`:

- `hero_titulo`: Título principal do hero
- `hero_subtitulo`: Subtítulo do hero
- `data_limite_pedidos`: Data limite para pedidos
- `mensagem_obrigado`: Mensagem na página de agradecimento
- `mensagem_esgotado`: Mensagem quando produtos esgotados
- `email_vendas`: E-mail para receber pedidos
- `telefone_whatsapp`: Telefone para notificações

### Adicionar Produtos

#### Via Banco de Dados

```sql
INSERT INTO produtos (nome, slug, descricao_curta, descricao_longa, preco, tamanho, fotos, destaque, status, ordem, quantidade_estoque)
VALUES (
  'Nome do Produto',
  'slug-do-produto',
  'Descrição curta',
  'Descrição longa detalhada',
  99.90,
  'Tamanho',
  ARRAY['/images/products/slug/1.jpg'],
  true,
  'disponivel',
  1,
  10
);
```

#### Via Painel Admin (Futuro)

O painel administrativo permitirá adicionar produtos via interface visual.

## 📧 Configuração de E-mails

### Usando SendGrid

1. Crie uma conta em [SendGrid](https://sendgrid.com/)
2. Gere uma API Key
3. Adicione a key no `.env.local`
4. Crie a API route em `src/app/api/notifications/email/route.ts`

### Template de E-mail

Os e-mails são enviados em HTML simples. Personalize em:
`src/app/api/notifications/email/route.ts`

## 📱 Integração WhatsApp

Para ativar notificações via WhatsApp:

1. Configure uma API de WhatsApp (Twilio, API360, etc.)
2. Adicione as credenciais no `.env.local`
3. Implemente a rota `src/app/api/notifications/whatsapp/route.ts`

## 🚀 Deploy na Vercel

### 1. Conectar Repositório

```bash
# Instale a CLI da Vercel
npm i -g vercel

# Faça login
vercel login

# Deploy
vercel
```

### 2. Configurar Variáveis de Ambiente

No dashboard da Vercel:
1. Vá em **Settings** → **Environment Variables**
2. Adicione todas as variáveis do `.env.local`

### 3. Deploy Automático

Cada push na branch `main` fará deploy automático.

## 🔒 Segurança

### Row Level Security (RLS)

O banco de dados usa RLS para proteger dados:

- **Produtos**: Leitura pública, escrita apenas autenticados
- **Pedidos**: Criação pública, leitura/edição apenas autenticados
- **Configurações**: Leitura pública, escrita apenas autenticados

### Autenticação Admin

Para acessar o painel admin (futuro):

```bash
# Criar usuário admin via Supabase Dashboard
# Authentication → Users → Add User
```

## 📊 Monitoramento

### Google Analytics

Adicione o script no `src/app/layout.tsx`:

```tsx
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
```

### Meta Pixel

Para rastreamento de conversões no Instagram/Facebook.

## 🧪 Testes

```bash
# Testes unitários (quando implementados)
npm test

# Build de produção
npm run build

# Verificar erros de TypeScript
npm run type-check
```

## 📝 Checklist de Lançamento

- [ ] Configurar variáveis de ambiente de produção
- [ ] Aplicar migrações no Supabase de produção
- [ ] Fazer upload das imagens dos produtos
- [ ] Testar fluxo completo de pedido
- [ ] Configurar domínio customizado
- [ ] Ativar SSL/HTTPS
- [ ] Configurar e-mails transacionais
- [ ] Testar responsividade em dispositivos reais
- [ ] Configurar Google Analytics
- [ ] Testar SEO (meta tags, Open Graph)
- [ ] Configurar backup do banco de dados

## 🐛 Troubleshooting

### Erro: "Cannot find module '@supabase/supabase-js'"

```bash
npm install @supabase/supabase-js
```

### Erro: Imagens não carregam

Verifique:
1. Bucket `products` existe no Supabase Storage
2. Políticas de acesso estão configuradas
3. URLs das imagens estão corretas

### Erro: Pedidos não são salvos

Verifique:
1. Variáveis de ambiente estão corretas
2. Tabela `pedidos` existe no banco
3. RLS permite inserção pública

## 📞 Suporte

Para dúvidas ou problemas:
- **E-mail**: vendas@thinkfit.com.br
- **YouTube**: [@codigofontetv](https://youtube.com/@codigofontetv)
- **Instagram**: [@codigofontetv](https://instagram.com/codigofontetv)

## 📄 Licença

Este projeto é uma demonstração criada por **Código Fonte TV** usando **Cursor AI**.

---

**Desenvolvido com ❤️ por Código Fonte TV**
