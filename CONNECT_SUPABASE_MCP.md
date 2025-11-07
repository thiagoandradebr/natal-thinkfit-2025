# 🔌 Conectar ao Supabase Existente via MCP

Este guia mostra como conectar o projeto ao Supabase já configurado no seu projeto SaaS ThinkFit usando o MCP (Model Context Protocol).

## Pré-requisitos

- ✅ Supabase MCP já configurado no projeto
- ✅ Acesso ao projeto ThinkFit no Supabase
- ✅ Permissões de administrador

## Passo 1: Listar Projetos Disponíveis

Use o MCP para listar os projetos Supabase da sua organização. Você deve ver algo como:

```
- thinkfit-saas (ID: abc123...)
- thinkfit-production (ID: xyz789...)
```

Anote o **Project ID** que você deseja usar.

## Passo 2: Aplicar Migrações SQL

### Migração 1: Schema Inicial

Use o MCP para executar a migração:

**Arquivo**: `supabase/migrations/001_initial_schema.sql`

**Comando MCP**:
```
Apply migration to project [PROJECT_ID]
Migration name: natal_initial_schema
SQL: [conteúdo do arquivo 001_initial_schema.sql]
```

Isso criará:
- ✅ Tabela `produtos`
- ✅ Tabela `pedidos`
- ✅ Tabela `admin_users`
- ✅ Tabela `configuracoes_site`
- ✅ Políticas RLS
- ✅ Triggers

### Migração 2: Seed de Produtos

**Arquivo**: `supabase/migrations/002_seed_produtos.sql`

**Comando MCP**:
```
Apply migration to project [PROJECT_ID]
Migration name: natal_seed_produtos
SQL: [conteúdo do arquivo 002_seed_produtos.sql]
```

Isso inserirá:
- ✅ 6 produtos do cardápio de Natal
- ✅ Configurações padrão do site

## Passo 3: Criar Storage Bucket

Use o MCP ou dashboard do Supabase para criar um bucket:

**Nome**: `products`
**Público**: Sim (para permitir acesso às imagens)

### Configurar Políticas do Bucket

Execute via MCP ou SQL Editor:

```sql
-- Política de leitura pública
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'products' );

-- Política de upload (apenas autenticados)
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'products' 
  AND auth.role() = 'authenticated'
);
```

## Passo 4: Obter Credenciais do Projeto

Use o MCP para obter:

1. **Project URL**
2. **Anon Key** (chave pública)
3. **Service Role Key** (chave privada - mantenha segura!)

## Passo 5: Configurar Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```env
# Supabase (obtido via MCP)
NEXT_PUBLIC_SUPABASE_URL=https://[seu-projeto].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Email
EMAIL_FROM=vendas@thinkfit.com.br
EMAIL_TO=vendas@thinkfit.com.br

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Passo 6: Verificar Instalação

Execute os seguintes comandos SQL via MCP para verificar:

```sql
-- Verificar se as tabelas foram criadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('produtos', 'pedidos', 'configuracoes_site', 'admin_users');

-- Verificar produtos inseridos
SELECT nome, preco, status FROM produtos ORDER BY ordem;

-- Verificar configurações
SELECT chave, valor FROM configuracoes_site;

-- Verificar bucket de storage
SELECT * FROM storage.buckets WHERE name = 'products';
```

**Resultado Esperado**:
- ✅ 4 tabelas encontradas
- ✅ 6 produtos listados
- ✅ 7 configurações listadas
- ✅ 1 bucket encontrado

## Passo 7: Testar Conexão

Execute o projeto em desenvolvimento:

```bash
npm run dev
```

Acesse `http://localhost:3000` e verifique:
- ✅ Produtos aparecem na página
- ✅ Não há erros no console
- ✅ Formulário de pedido funciona

## Passo 8: Upload de Imagens

### Estrutura de Pastas

Crie as seguintes pastas no bucket `products`:

```
products/
├── red-velvet/
├── dark-cacau/
├── vanilla-dream/
├── cake-arvore-natal/
├── brownie-guirlanda/
└── mousse-natalina/
```

### Fazer Upload

Via MCP ou dashboard do Supabase, faça upload das imagens:

- `red-velvet/1.jpg`
- `red-velvet/2.jpg`
- `dark-cacau/1.jpg`
- `dark-cacau/2.jpg`
- ... (e assim por diante)

### Atualizar URLs no Banco

Execute via MCP:

```sql
-- Obter URL base do storage
SELECT 
  'https://' || (SELECT ref FROM auth.users LIMIT 1) || '.supabase.co/storage/v1/object/public/' AS base_url;

-- Atualizar produtos com URLs corretas
UPDATE produtos 
SET fotos = ARRAY[
  'https://[seu-projeto].supabase.co/storage/v1/object/public/products/red-velvet/1.jpg',
  'https://[seu-projeto].supabase.co/storage/v1/object/public/products/red-velvet/2.jpg'
]
WHERE slug = 'red-velvet';

-- Repetir para cada produto...
```

## Comandos MCP Úteis

### Listar Tabelas
```
List tables in project [PROJECT_ID]
```

### Executar Query
```
Execute SQL in project [PROJECT_ID]:
SELECT * FROM produtos;
```

### Listar Migrações
```
List migrations in project [PROJECT_ID]
```

### Gerar TypeScript Types
```
Generate TypeScript types for project [PROJECT_ID]
```

## Troubleshooting

### Erro: "relation produtos does not exist"
**Solução**: Execute a migração `001_initial_schema.sql` via MCP

### Erro: "permission denied for table produtos"
**Solução**: Verifique se as políticas RLS foram criadas corretamente

### Erro: "bucket does not exist"
**Solução**: Crie o bucket `products` via MCP ou dashboard

### Erro: "Invalid API key"
**Solução**: Verifique se copiou as chaves corretas no `.env.local`

## Verificação Final

Execute este checklist:

- [ ] Migrações aplicadas com sucesso
- [ ] Produtos aparecem na tabela
- [ ] Configurações carregadas
- [ ] Bucket `products` criado
- [ ] Políticas RLS ativas
- [ ] Variáveis de ambiente configuradas
- [ ] Projeto roda sem erros (`npm run dev`)
- [ ] Produtos aparecem na landing page
- [ ] Formulário de pedido funciona

## Próximos Passos

1. ✅ Fazer upload das imagens dos produtos
2. ✅ Atualizar URLs das fotos no banco
3. ✅ Testar criação de pedido completo
4. ✅ Configurar e-mails (SendGrid)
5. ✅ Deploy na Vercel

## Recursos Adicionais

- [Documentação do Supabase MCP](https://github.com/supabase/mcp-server-supabase)
- [Guia Completo de Setup](./SUPABASE_SETUP.md)
- [Início Rápido](./QUICK_START.md)

---

**Dúvidas?** Consulte a documentação ou entre em contato via vendas@thinkfit.com.br
