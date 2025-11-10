-- Migration: Migrar produtos existentes para variações
-- Data: 2025-01-10
-- Descrição: Cria uma variação padrão para cada produto existente que não possui variações

-- Criar variações padrão para produtos que não possuem variações
INSERT INTO variacoes_produtos_natal (
  produto_id,
  nome_variacao,
  descricao,
  preco,
  is_default,
  ordem_exibicao,
  is_active
)
SELECT 
  p.id as produto_id,
  COALESCE(p.tamanho, 'Tamanho Padrão') as nome_variacao,
  NULL as descricao,
  p.preco as preco,
  true as is_default,
  0 as ordem_exibicao,
  true as is_active
FROM produtos_natal p
WHERE NOT EXISTS (
  SELECT 1 
  FROM variacoes_produtos_natal v 
  WHERE v.produto_id = p.id AND v.is_active = true
)
AND p.status = 'disponivel';

-- Comentário sobre a migração
COMMENT ON TABLE variacoes_produtos_natal IS 'Variações criadas automaticamente para produtos existentes durante a migração';

