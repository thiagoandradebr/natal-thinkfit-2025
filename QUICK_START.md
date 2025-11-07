# 🚀 Guia de Início Rápido

## Passo 1: Instalar Dependências

```bash
cd /Users/thiagoandrade/CascadeProjects/NATAL25
npm install
```

## Passo 2: Configurar Supabase

### Opção A: Usar Supabase Existente (Recomendado)

Se você já tem um projeto Supabase configurado via MCP:

1. Execute as migrações SQL do arquivo `supabase/migrations/001_initial_schema.sql`
2. Execute o seed de dados do arquivo `supabase/migrations/002_seed_produtos.sql`
3. Crie um bucket `products` no Storage
4. Obtenha as credenciais do projeto

### Opção B: Criar Novo Projeto

Siga o guia completo em `SUPABASE_SETUP.md`

## Passo 3: Configurar Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione suas credenciais:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui

EMAIL_FROM=vendas@thinkfit.com.br
EMAIL_TO=vendas@thinkfit.com.br

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Passo 4: Executar em Desenvolvimento

```bash
npm run dev
```

Acesse: **http://localhost:3000**

## Passo 5: Testar o Fluxo

1. ✅ Navegue pela landing page
2. ✅ Clique em um produto para ver detalhes
3. ✅ Adicione produtos ao carrinho
4. ✅ Preencha o formulário de pedido
5. ✅ Envie o pedido
6. ✅ Verifique a página de agradecimento

## Passo 6: Verificar Banco de Dados

No dashboard do Supabase, vá em **Table Editor** → **pedidos** e verifique se o pedido foi criado.

## Estrutura de Pastas Importante

```
NATAL25/
├── src/
│   ├── app/
│   │   ├── page.tsx              ← Landing page principal
│   │   ├── obrigado/page.tsx     ← Página de agradecimento
│   │   ├── esgotado/page.tsx     ← Página de esgotado
│   │   └── api/
│   │       ├── pedido/route.ts   ← API de pedidos
│   │       └── notifications/    ← APIs de notificação
│   ├── components/               ← Componentes React
│   ├── lib/supabase.ts          ← Cliente Supabase
│   └── types/database.ts        ← Tipos TypeScript
├── supabase/migrations/         ← Migrações SQL
├── cms-seed/                    ← Dados iniciais JSON
└── public/images/               ← Imagens estáticas
```

## Próximos Passos

### 1. Adicionar Imagens dos Produtos

Faça upload das imagens no Supabase Storage:

```
products/
├── red-velvet/1.jpg
├── red-velvet/2.jpg
├── dark-cacau/1.jpg
├── dark-cacau/2.jpg
...
```

### 2. Atualizar URLs das Imagens

Execute no SQL Editor do Supabase:

```sql
UPDATE produtos 
SET fotos = ARRAY[
  'https://seu-projeto.supabase.co/storage/v1/object/public/products/red-velvet/1.jpg',
  'https://seu-projeto.supabase.co/storage/v1/object/public/products/red-velvet/2.jpg'
]
WHERE slug = 'red-velvet';
```

### 3. Personalizar Configurações

Edite as configurações do site diretamente no banco:

```sql
UPDATE configuracoes_site 
SET valor = 'Seu novo título aqui'
WHERE chave = 'hero_titulo';

UPDATE configuracoes_site 
SET valor = '2025-12-20'
WHERE chave = 'data_limite_pedidos';
```

### 4. Configurar E-mails (Opcional)

Para enviar e-mails reais:

1. Crie uma conta no [SendGrid](https://sendgrid.com/)
2. Gere uma API Key
3. Adicione no `.env.local`:
   ```env
   SENDGRID_API_KEY=sua_api_key_aqui
   ```
4. Descomente o código de envio em `src/app/api/notifications/email/route.ts`

### 5. Deploy na Vercel

```bash
# Instalar CLI da Vercel
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel
```

Não esqueça de adicionar as variáveis de ambiente no dashboard da Vercel!

## Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção local
npm start

# Verificar erros TypeScript
npx tsc --noEmit

# Limpar cache
rm -rf .next node_modules
npm install
```

## Troubleshooting Rápido

### Erro: "Cannot find module"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro: Supabase connection
- Verifique se as variáveis de ambiente estão corretas
- Verifique se o projeto Supabase está ativo

### Página em branco
- Abra o console do navegador (F12)
- Verifique erros no terminal onde rodou `npm run dev`

### Imagens não aparecem
- Verifique se o bucket `products` existe
- Verifique se as URLs estão corretas
- Verifique se o bucket é público

## Recursos Adicionais

- 📖 [README Completo](./README.md)
- 🗄️ [Guia de Setup do Supabase](./SUPABASE_SETUP.md)
- 🎨 [Documentação do Tailwind](https://tailwindcss.com/docs)
- ⚡ [Documentação do Next.js](https://nextjs.org/docs)
- 🔥 [Documentação do Supabase](https://supabase.com/docs)

## Suporte

Dúvidas? Entre em contato:
- 📧 vendas@thinkfit.com.br
- 🎥 [Código Fonte TV no YouTube](https://youtube.com/@codigofontetv)

---

**Bom desenvolvimento! 🎄**
