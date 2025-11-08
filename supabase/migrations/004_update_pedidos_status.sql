-- Adicionar campo pago (flag) e atualizar status para incluir 'confirmado'
-- Primeiro, adicionar o campo pago
ALTER TABLE pedidos_natal 
ADD COLUMN IF NOT EXISTS pago BOOLEAN DEFAULT false;

-- Atualizar o CHECK constraint para incluir 'confirmado'
-- Primeiro, remover o constraint antigo (se existir)
ALTER TABLE pedidos_natal 
DROP CONSTRAINT IF EXISTS pedidos_natal_status_pagamento_check;

-- Adicionar novo constraint com 'confirmado'
ALTER TABLE pedidos_natal 
ADD CONSTRAINT pedidos_natal_status_pagamento_check 
CHECK (status_pagamento IN ('pendente', 'pago', 'cancelado', 'confirmado'));

-- Criar índice para o campo pago
CREATE INDEX IF NOT EXISTS idx_pedidos_natal_pago ON pedidos_natal(pago);

-- Habilitar RLS na tabela pedidos_natal (se ainda não estiver habilitado)
ALTER TABLE pedidos_natal ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Admin pode fazer tudo em pedidos_natal" ON pedidos_natal;
DROP POLICY IF EXISTS "Qualquer um pode criar pedidos_natal" ON pedidos_natal;

-- Política para admin fazer tudo em pedidos_natal
CREATE POLICY "Admin pode fazer tudo em pedidos_natal"
  ON pedidos_natal FOR ALL
  USING (auth.role() = 'authenticated');

-- Política para inserção pública de pedidos_natal
CREATE POLICY "Qualquer um pode criar pedidos_natal"
  ON pedidos_natal FOR INSERT
  WITH CHECK (true);

