// Tipos do banco de dados Supabase
// NOTA: Usando tabelas produtos_natal e pedidos_natal para não conflitar com o SaaS ThinkFit

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
}

export interface ItemPedido {
  produto_id: string
  nome: string
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
  status_pagamento: 'pendente' | 'pago' | 'cancelado'
  metodo_pagamento?: string
  endereco_entrega?: string
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
