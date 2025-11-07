# 🗄️ Configuração do Supabase

Este guia explica como configurar o banco de dados Supabase para o projeto Natal ThinkFit 2025.

## Opção 1: Usando Supabase MCP (Recomendado)

Se você já tem o Supabase MCP configurado no seu projeto SaaS ThinkFit, siga estes passos:

### 1. Listar Projetos Disponíveis

```bash
# Via MCP, liste os projetos Supabase disponíveis
# Isso mostrará todos os projetos da sua organização
```

### 2. Aplicar Migrações

Use o MCP para aplicar as migrações SQL:

**Migração 1: Schema Inicial**
```sql
-- Copie e execute o conteúdo de: supabase/migrations/001_initial_schema.sql
```

**Migração 2: Seed de Produtos**
```sql
-- Copie e execute o conteúdo de: supabase/migrations/002_seed_produtos.sql
```

### 3. Configurar Storage

1. Crie um bucket chamado `products`
2. Configure as políticas:
   - **SELECT**: Público (anyone can read)
   - **INSERT/UPDATE/DELETE**: Apenas autenticados

### 4. Obter Credenciais

Execute via MCP:
```bash
# Obter URL do projeto
# Obter chaves de API (anon key e service role key)
```

Adicione as credenciais no `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key
```

## Opção 2: Manual via Dashboard

### 1. Criar Projeto

1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Escolha:
   - **Name**: natal-thinkfit-2025
   - **Database Password**: (escolha uma senha forte)
   - **Region**: Brazil (sa-east-1) ou mais próximo
4. Aguarde a criação (2-3 minutos)

### 2. Aplicar Schema

1. No dashboard, vá em **SQL Editor**
2. Clique em **New Query**
3. Copie e cole o conteúdo de `supabase/migrations/001_initial_schema.sql`
4. Clique em **Run**
5. Repita para `supabase/migrations/002_seed_produtos.sql`

### 3. Configurar Storage

1. Vá em **Storage** no menu lateral
2. Clique em **New Bucket**
3. Configure:
   - **Name**: products
   - **Public bucket**: ✅ Sim
4. Clique em **Create Bucket**

#### Configurar Políticas de Storage

Vá em **Policies** do bucket `products` e adicione:

**Política de Leitura (SELECT)**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'products' );
```

**Política de Upload (INSERT) - Apenas Autenticados**
```sql
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'products' 
  AND auth.role() = 'authenticated'
);
```

**Política de Atualização (UPDATE) - Apenas Autenticados**
```sql
CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'products' 
  AND auth.role() = 'authenticated'
);
```

**Política de Exclusão (DELETE) - Apenas Autenticados**
```sql
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'products' 
  AND auth.role() = 'authenticated'
);
```

### 4. Obter Credenciais

1. Vá em **Settings** → **API**
2. Copie:
   - **Project URL**
   - **anon public** (API Key)
   - **service_role** (API Key - mantenha em segredo!)

Adicione no `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=sua-service-role-key-aqui
```

## Estrutura do Banco de Dados

### Tabelas Criadas

1. **produtos** - Produtos do cardápio
2. **pedidos** - Pedidos dos clientes
3. **admin_users** - Usuários administrativos
4. **configuracoes_site** - Configurações editáveis

### Dados Iniciais

Após executar as migrações, você terá:

- ✅ 6 produtos do cardápio de Natal
- ✅ Configurações padrão do site
- ✅ Row Level Security (RLS) configurado
- ✅ Triggers para updated_at automático

## Upload de Imagens dos Produtos

### Estrutura de Pastas no Storage

```
products/
├── red-velvet/
│   ├── 1.jpg
│   └── 2.jpg
├── dark-cacau/
│   ├── 1.jpg
│   └── 2.jpg
├── vanilla-dream/
│   ├── 1.jpg
│   └── 2.jpg
├── cake-arvore-natal/
│   ├── 1.jpg
│   └── 2.jpg
├── brownie-guirlanda/
│   ├── 1.jpg
│   └── 2.jpg
└── mousse-natalina/
    ├── 1.jpg
    └── 2.jpg
```

### Como Fazer Upload

#### Via Dashboard:
1. Vá em **Storage** → **products**
2. Crie as pastas para cada produto
3. Faça upload das imagens

#### Via Código (Futuro Painel Admin):
```typescript
const { data, error } = await supabase.storage
  .from('products')
  .upload('red-velvet/1.jpg', file)
```

### URLs das Imagens

Após upload, as URLs serão:
```
https://seu-projeto.supabase.co/storage/v1/object/public/products/red-velvet/1.jpg
```

Atualize a tabela `produtos` com as URLs corretas:
```sql
UPDATE produtos 
SET fotos = ARRAY[
  'https://seu-projeto.supabase.co/storage/v1/object/public/products/red-velvet/1.jpg',
  'https://seu-projeto.supabase.co/storage/v1/object/public/products/red-velvet/2.jpg'
]
WHERE slug = 'red-velvet';
```

## Verificação

Execute estas queries para verificar se tudo está correto:

```sql
-- Verificar produtos
SELECT nome, preco, status FROM produtos ORDER BY ordem;

-- Verificar configurações
SELECT chave, valor FROM configuracoes_site;

-- Verificar políticas RLS
SELECT tablename, policyname FROM pg_policies 
WHERE schemaname = 'public';

-- Verificar storage bucket
SELECT * FROM storage.buckets WHERE name = 'products';
```

## Troubleshooting

### Erro: "relation produtos does not exist"
- Execute a migração `001_initial_schema.sql`

### Erro: "bucket does not exist"
- Crie o bucket `products` no Storage

### Erro: "permission denied"
- Verifique se as políticas RLS estão configuradas
- Verifique se está usando a chave correta (anon vs service_role)

### Imagens não carregam
- Verifique se o bucket é público
- Verifique se as políticas de SELECT estão configuradas
- Verifique se as URLs estão corretas na tabela

## Backup

### Exportar Dados

```sql
-- Exportar produtos
COPY produtos TO '/tmp/produtos.csv' CSV HEADER;

-- Exportar pedidos
COPY pedidos TO '/tmp/pedidos.csv' CSV HEADER;
```

### Restaurar Dados

```sql
-- Importar produtos
COPY produtos FROM '/tmp/produtos.csv' CSV HEADER;
```

## Próximos Passos

1. ✅ Banco de dados configurado
2. ✅ Storage configurado
3. ⬜ Fazer upload das imagens dos produtos
4. ⬜ Testar criação de pedidos
5. ⬜ Configurar autenticação para painel admin
6. ⬜ Deploy na Vercel

---

**Dúvidas?** Consulte a [documentação do Supabase](https://supabase.com/docs)
