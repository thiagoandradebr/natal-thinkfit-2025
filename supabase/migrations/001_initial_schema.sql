-- Tabela de produtos do cardápio de Natal
CREATE TABLE IF NOT EXISTS produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  descricao_curta TEXT NOT NULL,
  descricao_longa TEXT NOT NULL,
  preco DECIMAL(10, 2) NOT NULL,
  tamanho VARCHAR(100) NOT NULL,
  fotos TEXT[] DEFAULT '{}',
  destaque BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'esgotado')),
  ordem INTEGER DEFAULT 0,
  quantidade_estoque INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_produtos_slug ON produtos(slug);
CREATE INDEX idx_produtos_status ON produtos(status);
CREATE INDEX idx_produtos_ordem ON produtos(ordem);

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome_cliente VARCHAR(255) NOT NULL,
  telefone_whatsapp VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  itens JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status_pagamento VARCHAR(20) DEFAULT 'pendente' CHECK (status_pagamento IN ('pendente', 'pago', 'cancelado')),
  metodo_pagamento VARCHAR(100),
  endereco_entrega TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  atualizado_em TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para pedidos
CREATE INDEX idx_pedidos_status ON pedidos(status_pagamento);
CREATE INDEX idx_pedidos_criado_em ON pedidos(criado_em DESC);
CREATE INDEX idx_pedidos_email ON pedidos(email);

-- Tabela de usuários admin
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  nome VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configurações do site
CREATE TABLE IF NOT EXISTS configuracoes_site (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chave VARCHAR(100) UNIQUE NOT NULL,
  valor TEXT NOT NULL,
  tipo VARCHAR(20) DEFAULT 'texto' CHECK (tipo IN ('texto', 'data', 'numero', 'json')),
  descricao TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_produtos_updated_at
  BEFORE UPDATE ON produtos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pedidos_updated_at
  BEFORE UPDATE ON pedidos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_configuracoes_updated_at
  BEFORE UPDATE ON configuracoes_site
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Inserir configurações padrão do site
INSERT INTO configuracoes_site (chave, valor, tipo, descricao) VALUES
  ('data_limite_pedidos', '2025-12-20', 'data', 'Data limite para aceitar pedidos'),
  ('telefone_whatsapp', '5511999999999', 'texto', 'Telefone WhatsApp para notificações'),
  ('email_vendas', 'vendas@thinkfit.com.br', 'texto', 'Email para receber pedidos'),
  ('hero_titulo', 'Um Natal saudável e sofisticado — sobremesas autorais ThinkFit.', 'texto', 'Título principal do hero'),
  ('hero_subtitulo', 'Bolos sem glúten, zero lactose e low sugar — encomendas limitadas.', 'texto', 'Subtítulo do hero'),
  ('mensagem_obrigado', 'Assim que o pagamento for confirmado, envie um e-mail para vendas@thinkfit.com.br com o comprovante e informações de entrega.', 'texto', 'Mensagem na página de agradecimento'),
  ('mensagem_esgotado', 'Infelizmente todos os produtos do Cardápio de Natal 2025 estão esgotados. Obrigado pelo interesse!', 'texto', 'Mensagem quando produtos esgotados')
ON CONFLICT (chave) DO NOTHING;

-- Habilitar Row Level Security (RLS)
ALTER TABLE produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes_site ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público para produtos (leitura)
CREATE POLICY "Produtos são visíveis publicamente"
  ON produtos FOR SELECT
  USING (true);

-- Políticas de acesso para admin (todas operações)
CREATE POLICY "Admin pode fazer tudo em produtos"
  ON produtos FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin pode fazer tudo em pedidos"
  ON pedidos FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admin pode fazer tudo em configurações"
  ON configuracoes_site FOR ALL
  USING (auth.role() = 'authenticated');

-- Políticas para inserção de pedidos (público pode criar)
CREATE POLICY "Qualquer um pode criar pedidos"
  ON pedidos FOR INSERT
  WITH CHECK (true);

-- Políticas de leitura para configurações (público pode ler)
CREATE POLICY "Configurações são visíveis publicamente"
  ON configuracoes_site FOR SELECT
  USING (true);
