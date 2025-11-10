// Tipos do banco de dados Supabase
// NOTA: Usando tabelas produtos_natal e pedidos_natal para não conflitar com o SaaS ThinkFit

export interface VariacaoProduto {
  id: string
  produto_id: string
  nome_variacao: string
  descricao?: string
  preco: number
  is_default: boolean
  ordem_exibicao: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Produto {
  id: string
  nome: string
  slug: string
  descricao_curta: string
  descricao_longa: string
  preco: number
  tamanho: string
  fotos: string[]
  destaque: boolean
  status: 'disponivel' | 'esgotado'
  ordem: number
  quantidade_estoque?: number
  created_at: string
  updated_at: string
  variacoes?: VariacaoProduto[] // Variações do produto (opcional, carregado separadamente)
}

export interface ItemPedido {
  produto_id: string
  variacao_id?: string // ID da variação selecionada (opcional para compatibilidade)
  nome: string
  variacao_nome?: string // Nome da variação (snapshot)
  variacao_descricao?: string // Descrição da variação (snapshot)
  preco: number
  quantidade: number
  observacao?: string
}

export interface Pedido {
  id: string
  nome_cliente: string
  telefone_whatsapp: string
  email: string
  itens: ItemPedido[]
  total: number
  status_pagamento: 'pendente' | 'pago' | 'cancelado' | 'confirmado'
  metodo_pagamento?: string
  endereco_entrega?: string
  pago?: boolean // Flag para indicar se foi pago (independente do status)
  criado_em: string
  atualizado_em: string
}

export interface AdminUser {
  id: string
  email: string
  nome: string
  role: string
}

export interface ConfiguracaoSite {
  id: string
  chave: string
  valor: string
  tipo: 'texto' | 'data' | 'numero' | 'json'
  descricao?: string
  updated_at: string
}
