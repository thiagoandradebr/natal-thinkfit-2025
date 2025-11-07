-- Criar bucket para fotos dos produtos
INSERT INTO storage.buckets (id, name, public)
VALUES ('natal-produtos', 'natal-produtos', true)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir upload de imagens (público pode fazer upload)
CREATE POLICY "Permitir upload público de imagens"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'natal-produtos');

-- Política para permitir leitura pública de imagens
CREATE POLICY "Permitir leitura pública de imagens"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'natal-produtos');

-- Política para permitir delete de imagens
CREATE POLICY "Permitir delete de imagens"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'natal-produtos');

-- Política para permitir update de imagens
CREATE POLICY "Permitir update de imagens"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'natal-produtos');
