# Configuração do Supabase Storage

## 📦 Setup do Bucket de Imagens

### Opção 1: Via Dashboard do Supabase (Recomendado)

1. **Acesse o Dashboard do Supabase**
   - Vá para: https://supabase.com/dashboard
   - Selecione seu projeto

2. **Criar o Bucket**
   - No menu lateral, clique em **Storage**
   - Clique em **New bucket**
   - Nome do bucket: `natal-produtos`
   - Marque a opção **Public bucket** ✅
   - Clique em **Create bucket**

3. **Configurar Políticas (RLS)**
   - Clique no bucket `natal-produtos`
   - Vá para a aba **Policies**
   - Clique em **New policy**
   - Selecione **For full customization**
   
   **Política 1: Upload (INSERT)**
   ```sql
   CREATE POLICY "Permitir upload público"
   ON storage.objects FOR INSERT
   TO public
   WITH CHECK (bucket_id = 'natal-produtos');
   ```

   **Política 2: Leitura (SELECT)**
   ```sql
   CREATE POLICY "Permitir leitura pública"
   ON storage.objects FOR SELECT
   TO public
   USING (bucket_id = 'natal-produtos');
   ```

   **Política 3: Delete (DELETE)**
   ```sql
   CREATE POLICY "Permitir delete"
   ON storage.objects FOR DELETE
   TO public
   USING (bucket_id = 'natal-produtos');
   ```

   **Política 4: Update (UPDATE)**
   ```sql
   CREATE POLICY "Permitir update"
   ON storage.objects FOR UPDATE
   TO public
   USING (bucket_id = 'natal-produtos');
   ```

### Opção 2: Via SQL Editor

1. Acesse o **SQL Editor** no dashboard do Supabase
2. Execute o script: `supabase/migrations/003_create_storage_bucket.sql`

### Opção 3: Via CLI do Supabase

```bash
# Se você tem o Supabase CLI instalado
supabase migration up
```

## 🔒 Segurança (Produção)

Para produção, você pode querer restringir o acesso:

```sql
-- Permitir upload apenas para usuários autenticados
CREATE POLICY "Upload apenas autenticado"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'natal-produtos');

-- Leitura pública continua permitida
CREATE POLICY "Leitura pública"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'natal-produtos');

-- Delete apenas para o dono do arquivo
CREATE POLICY "Delete apenas dono"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'natal-produtos' 
  AND auth.uid() = owner
);
```

## 📝 Configurações Adicionais

### Limites de Upload

No dashboard do Supabase:
- Storage > Settings
- **File size limit**: 5 MB (já configurado no componente)
- **Allowed MIME types**: image/jpeg, image/png, image/webp

### Otimização de Imagens

Considere usar transformações do Supabase:

```typescript
// Redimensionar imagem ao buscar
const { data } = supabase.storage
  .from('natal-produtos')
  .getPublicUrl('path/to/image.jpg', {
    transform: {
      width: 800,
      height: 800,
      resize: 'cover'
    }
  })
```

## ✅ Verificação

Teste o upload:
1. Acesse `/admin/produtos/novo`
2. Tente fazer upload de uma imagem
3. Verifique se a imagem aparece no Storage do Supabase
4. Verifique se a URL pública funciona

## 🐛 Troubleshooting

### Erro: "new row violates row-level security policy"
- Verifique se as políticas RLS foram criadas corretamente
- Certifique-se que o bucket está marcado como público

### Erro: "The resource already exists"
- O bucket já foi criado, apenas configure as políticas

### Imagens não aparecem
- Verifique se o bucket está marcado como **Public**
- Teste a URL pública diretamente no navegador
- Verifique o console do navegador para erros CORS

## 📚 Documentação

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [Storage Policies](https://supabase.com/docs/guides/storage/security/access-control)
