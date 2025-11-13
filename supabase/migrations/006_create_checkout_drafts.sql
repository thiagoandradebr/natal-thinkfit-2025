-- Tabela para armazenar rascunhos temporários do checkout
-- Permite recuperar dados do formulário mesmo após recarregar a página
CREATE TABLE IF NOT EXISTS checkout_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) NOT NULL,
  form_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Índice para busca rápida por session_id
CREATE INDEX IF NOT EXISTS idx_checkout_drafts_session_id ON checkout_drafts(session_id);
CREATE INDEX IF NOT EXISTS idx_checkout_drafts_expires_at ON checkout_drafts(expires_at);

-- Índice único para garantir apenas um rascunho por sessão
CREATE UNIQUE INDEX IF NOT EXISTS idx_checkout_drafts_session_unique ON checkout_drafts(session_id);

-- Habilitar RLS
ALTER TABLE checkout_drafts ENABLE ROW LEVEL SECURITY;

-- Política: Qualquer um pode criar/atualizar seu próprio rascunho
CREATE POLICY "Qualquer um pode criar rascunhos"
  ON checkout_drafts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Qualquer um pode atualizar seu rascunho"
  ON checkout_drafts FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Qualquer um pode ler seu rascunho"
  ON checkout_drafts FOR SELECT
  USING (true);

CREATE POLICY "Qualquer um pode deletar seu rascunho"
  ON checkout_drafts FOR DELETE
  USING (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_checkout_drafts_updated_at
  BEFORE UPDATE ON checkout_drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para limpar rascunhos expirados (pode ser executada periodicamente)
CREATE OR REPLACE FUNCTION cleanup_expired_drafts()
RETURNS void AS $$
BEGIN
  DELETE FROM checkout_drafts
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

