-- Migration: Sistema de Variações de Produtos
-- Data: 2025-01-10
-- Descrição: Permite que produtos tenham múltiplas variações (tamanhos, tipos) com preços diferentes

-- Tabela de variações de produtos
CREATE TABLE IF NOT EXISTS variacoes_produtos_natal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  produto_id UUID NOT NULL REFERENCES produtos_natal(id) ON DELETE CASCADE,
  nome_variacao VARCHAR(100) NOT NULL,
  descricao VARCHAR(500),
  preco DECIMAL(10,2) NOT NULL CHECK (preco > 0),
  is_default BOOLEAN DEFAULT false,
  ordem_exibicao INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_variacoes_produto_id ON variacoes_produtos_natal(produto_id);
CREATE INDEX idx_variacoes_default ON variacoes_produtos_natal(produto_id, is_default) WHERE is_default = true;
CREATE INDEX idx_variacoes_active ON variacoes_produtos_natal(produto_id, is_active) WHERE is_active = true;
CREATE INDEX idx_variacoes_ordem ON variacoes_produtos_natal(produto_id, ordem_exibicao);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_variacoes_updated_at
  BEFORE UPDATE ON variacoes_produtos_natal
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Função para garantir apenas uma variação padrão por produto
CREATE OR REPLACE FUNCTION ensure_single_default_variation()
RETURNS TRIGGER AS $$
BEGIN
  -- Se está setando como default, remover default das outras
  IF NEW.is_default = true THEN
    UPDATE variacoes_produtos_natal
    SET is_default = false
    WHERE produto_id = NEW.produto_id
      AND id != NEW.id
      AND is_default = true;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para garantir apenas uma default
CREATE TRIGGER trigger_ensure_single_default
  BEFORE INSERT OR UPDATE ON variacoes_produtos_natal
  FOR EACH ROW
  EXECUTE FUNCTION ensure_single_default_variation();

-- Comentários
COMMENT ON TABLE variacoes_produtos_natal IS 'Variações de produtos (tamanhos, tipos) com preços diferentes';
COMMENT ON COLUMN variacoes_produtos_natal.nome_variacao IS 'Nome da variação (ex: Tipo 1, Tamanho P, 15cm)';
COMMENT ON COLUMN variacoes_produtos_natal.descricao IS 'Descrição adicional da variação';
COMMENT ON COLUMN variacoes_produtos_natal.is_default IS 'Define se é a variação padrão do produto';
COMMENT ON COLUMN variacoes_produtos_natal.ordem_exibicao IS 'Ordem de exibição das variações';

-- Habilitar RLS
ALTER TABLE variacoes_produtos_natal ENABLE ROW LEVEL SECURITY;

-- Política: Variações são visíveis publicamente (para leitura)
CREATE POLICY "Variações são visíveis publicamente"
  ON variacoes_produtos_natal FOR SELECT
  USING (true);

-- Política: Admin pode fazer tudo em variações
CREATE POLICY "Admin pode fazer tudo em variações"
  ON variacoes_produtos_natal FOR ALL
  USING (auth.role() = 'authenticated');

