'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, CheckCircle, XCircle, Clock, Phone, Mail, MapPin, Calendar, DollarSign, List, Package, BarChart3 } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Pedido } from '@/types/database'

type ViewMode = 'lista' | 'por-dia' | 'produtos-dia'

interface ProdutoQuantidade {
  nome: string
  quantidade: number
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendente' | 'pago' | 'cancelado'>('todos')
  const [viewMode, setViewMode] = useState<ViewMode>('lista')

  useEffect(() => {
    fetchPedidos()
  }, [])

  const fetchPedidos = async () => {
    try {
      console.log('🔍 Buscando pedidos...')
      const { data, error } = await supabase
        .from('pedidos_natal')
        .select('*')
        .order('criado_em', { ascending: false })

      if (error) {
        console.error('❌ Erro ao buscar pedidos:', error)
        console.error('📋 Detalhes do erro:', JSON.stringify(error, null, 2))
        throw error
      }
      
      console.log('✅ Pedidos encontrados:', data?.length || 0)
      console.log('📦 Dados:', data)
      setPedidos(data || [])
    } catch (error) {
      console.error('❌ Erro ao buscar pedidos:', error)
      alert(`Erro ao carregar pedidos: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, novoStatus: 'pendente' | 'pago' | 'cancelado') => {
    try {
      const { error } = await supabase
        .from('pedidos_natal')
        .update({ status_pagamento: novoStatus })
        .eq('id', id)

      if (error) throw error
      
      setPedidos(pedidos.map(p => p.id === id ? { ...p, status_pagamento: novoStatus } : p))
      alert('Status atualizado com sucesso!')
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      alert('Erro ao atualizar status')
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const filteredPedidos = pedidos.filter(pedido => {
    const matchesSearch = 
      pedido.nome_cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pedido.telefone_whatsapp.includes(searchTerm) ||
      pedido.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'todos' || pedido.status_pagamento === statusFilter
    
    return matchesSearch && matchesStatus
  })

  // Agrupar pedidos por data de entrega
  const pedidosPorDia = useMemo(() => {
    const grupos: { [key: string]: Pedido[] } = {}
    
    filteredPedidos.forEach(pedido => {
      const dataEntrega = (pedido as any).data_entrega || 'Sem data'
      if (!grupos[dataEntrega]) {
        grupos[dataEntrega] = []
      }
      grupos[dataEntrega].push(pedido)
    })
    
    return Object.entries(grupos)
      .map(([data, pedidos]) => ({
        data,
        pedidos,
        total: pedidos.reduce((sum, p) => sum + Number(p.total), 0)
      }))
      .sort((a, b) => {
        // Ordenar: 24/12 primeiro, depois 30/12, depois "Sem data"
        if (a.data === '24/12') return -1
        if (b.data === '24/12') return 1
        if (a.data === '30/12') return -1
        if (b.data === '30/12') return 1
        return a.data.localeCompare(b.data)
      })
  }, [filteredPedidos])

  // Quantificar produtos por data de entrega
  const produtosPorDia = useMemo(() => {
    const grupos: { [key: string]: { [key: string]: number } } = {}
    
    filteredPedidos.forEach(pedido => {
      const dataEntrega = (pedido as any).data_entrega || 'Sem data'
      if (!grupos[dataEntrega]) {
        grupos[dataEntrega] = {}
      }
      
      pedido.itens.forEach(item => {
        if (!grupos[dataEntrega][item.nome]) {
          grupos[dataEntrega][item.nome] = 0
        }
        grupos[dataEntrega][item.nome] += item.quantidade
      })
    })
    
    return Object.entries(grupos).map(([data, produtos]) => {
      const produtosArray: ProdutoQuantidade[] = Object.entries(produtos)
        .map(([nome, quantidade]) => ({ nome, quantidade }))
        .sort((a, b) => b.quantidade - a.quantidade) // Ordenar por quantidade (maior primeiro)
      
      return {
        data,
        produtos: produtosArray,
        totalProdutos: produtosArray.reduce((sum, p) => sum + p.quantidade, 0)
      }
    }).sort((a, b) => {
      // Ordenar: 24/12 primeiro, depois 30/12, depois "Sem data"
      if (a.data === '24/12') return -1
      if (b.data === '24/12') return 1
      if (a.data === '30/12') return -1
      if (b.data === '30/12') return 1
      return a.data.localeCompare(b.data)
    })
  }, [filteredPedidos])

  const getStatusBadge = (status: string) => {
    const styles = {
      pendente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      pago: 'bg-green-100 text-green-800 border-green-300',
      cancelado: 'bg-red-100 text-red-800 border-red-300',
    }
    
    const icons = {
      pendente: Clock,
      pago: CheckCircle,
      cancelado: XCircle,
    }
    
    const labels = {
      pendente: 'Pendente',
      pago: 'Pago',
      cancelado: 'Cancelado',
    }
    
    const Icon = icons[status as keyof typeof icons] || Clock
    
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-body uppercase tracking-wider ${styles[status as keyof typeof styles] || styles.pendente}`}>
        <Icon size={12} />
        {labels[status as keyof typeof labels] || status}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wine"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl text-brown-darkest font-light mb-2">
            Pedidos
          </h2>
          <p className="font-body text-brown-medium text-sm">
            Gerencie todos os pedidos recebidos
          </p>
        </div>
        
        {/* Modos de Visualização */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('lista')}
            className={`px-4 py-2 font-body text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              viewMode === 'lista'
                ? 'bg-wine text-white'
                : 'bg-beige-lightest text-brown-medium hover:bg-beige-medium'
            }`}
          >
            <List size={16} />
            Lista
          </button>
          <button
            onClick={() => setViewMode('por-dia')}
            className={`px-4 py-2 font-body text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              viewMode === 'por-dia'
                ? 'bg-wine text-white'
                : 'bg-beige-lightest text-brown-medium hover:bg-beige-medium'
            }`}
          >
            <Calendar size={16} />
            Por Data Entrega
          </button>
          <button
            onClick={() => setViewMode('produtos-dia')}
            className={`px-4 py-2 font-body text-xs uppercase tracking-wider transition-all flex items-center gap-2 ${
              viewMode === 'produtos-dia'
                ? 'bg-wine text-white'
                : 'bg-beige-lightest text-brown-medium hover:bg-beige-medium'
            }`}
          >
            <BarChart3 size={16} />
            Produtos/Data Entrega
          </button>
        </div>
      </div>

      {/* Filtros e Busca */}
      <div className="bg-white p-6 shadow-sm space-y-4">
        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-medium" size={20} />
          <input
            type="text"
            placeholder="Buscar por nome, telefone ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-beige-medium focus:border-gold-warm focus:outline-none font-body text-sm"
          />
        </div>

        {/* Filtros de Status */}
        <div className="flex items-center gap-3">
          <span className="font-body text-xs uppercase tracking-wider text-brown-medium">Filtrar por status:</span>
          {['todos', 'pendente', 'pago', 'cancelado'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status as any)}
              className={`px-4 py-2 font-body text-xs uppercase tracking-wider transition-all ${
                statusFilter === status
                  ? 'bg-wine text-white'
                  : 'bg-beige-lightest text-brown-medium hover:bg-beige-medium'
              }`}
            >
              {status === 'todos' ? 'Todos' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Visualização: Lista Normal */}
      {viewMode === 'lista' && (
        <div className="space-y-4">
          {filteredPedidos.map((pedido, index) => (
          <motion.div
            key={pedido.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white shadow-sm overflow-hidden"
          >
            {/* Ribbon */}
            <div className="h-1 bg-gradient-to-r from-gold-warm via-gold to-gold-warm" />

            <div className="p-6">
              {/* Header do Pedido */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-display text-xl text-brown-darkest">
                      {pedido.nome_cliente}
                    </h3>
                    {getStatusBadge(pedido.status_pagamento)}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-brown-medium">
                    <div className="flex items-center gap-2">
                      <Phone size={14} />
                      <span>{pedido.telefone_whatsapp}</span>
                    </div>
                    {pedido.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={14} />
                        <span>{pedido.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar size={14} />
                      <span>{formatDate(pedido.criado_em)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-body text-xs uppercase tracking-wider text-brown-light mb-1">
                    Total
                  </div>
                  <div className="font-display text-2xl text-gold-dark font-medium">
                    {formatPrice(pedido.total)}
                  </div>
                </div>
              </div>

              {/* Endereço e Data de Entrega */}
              <div className="mb-4 space-y-3">
                {pedido.endereco_entrega && (
                  <div className="p-3 bg-beige-lightest border-l-4 border-gold-warm">
                    <div className="flex items-start gap-2">
                      <MapPin size={16} className="text-gold-warm mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-body text-xs uppercase tracking-wider text-brown-medium mb-1">
                          Endereço de Entrega
                        </div>
                        <p className="font-body text-sm text-brown-darkest">
                          {pedido.endereco_entrega}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {(pedido as any).data_entrega && (
                  <div className="p-3 bg-beige-lightest border-l-4 border-sage">
                    <div className="flex items-start gap-2">
                      <Calendar size={16} className="text-sage mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-body text-xs uppercase tracking-wider text-brown-medium mb-1">
                          Data de Entrega
                        </div>
                        <p className="font-body text-sm text-brown-darkest font-medium">
                          {(pedido as any).data_entrega}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Itens do Pedido */}
              <div className="mb-4">
                <div className="font-body text-xs uppercase tracking-wider text-brown-medium mb-2">
                  Itens do Pedido
                </div>
                <div className="space-y-2">
                  {pedido.itens.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-beige-lightest">
                      <div className="flex-1">
                        <span className="font-body text-sm text-brown-darkest">{item.nome}</span>
                        <span className="font-body text-xs text-brown-medium ml-2">
                          x{item.quantidade}
                        </span>
                      </div>
                      <span className="font-body text-sm text-brown-darkest font-medium">
                        {formatPrice(item.preco * item.quantidade)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Forma de Pagamento */}
              {pedido.metodo_pagamento && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-sm text-brown-medium">
                    <DollarSign size={14} />
                    <span className="font-body uppercase tracking-wider">
                      Forma de Pagamento: {pedido.metodo_pagamento === 'pix' ? 'PIX' : 'Link Cartão'}
                    </span>
                  </div>
                </div>
              )}

              {/* Ações */}
              <div className="flex items-center gap-3 pt-4 border-t border-beige-medium">
                <span className="font-body text-xs uppercase tracking-wider text-brown-medium">
                  Alterar Status:
                </span>
                {pedido.status_pagamento !== 'pago' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateStatus(pedido.id, 'pago')}
                    className="px-4 py-2 bg-green-600 text-white font-body text-xs uppercase tracking-wider hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle size={14} />
                    Marcar como Pago
                  </motion.button>
                )}
                {pedido.status_pagamento !== 'cancelado' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateStatus(pedido.id, 'cancelado')}
                    className="px-4 py-2 bg-red-600 text-white font-body text-xs uppercase tracking-wider hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <XCircle size={14} />
                    Cancelar
                  </motion.button>
                )}
                {pedido.status_pagamento !== 'pendente' && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateStatus(pedido.id, 'pendente')}
                    className="px-4 py-2 bg-yellow-600 text-white font-body text-xs uppercase tracking-wider hover:bg-yellow-700 transition-colors flex items-center gap-2"
                  >
                    <Clock size={14} />
                    Voltar para Pendente
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
          ))}
        </div>
      )}

      {/* Visualização: Pedidos por Dia */}
      {viewMode === 'por-dia' && (
        <div className="space-y-6">
          {pedidosPorDia.map((grupo, index) => (
            <motion.div
              key={grupo.data}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white shadow-sm overflow-hidden"
            >
              <div className="h-1 bg-gradient-to-r from-gold-warm via-gold to-gold-warm" />
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-display text-2xl text-brown-darkest mb-2 flex items-center gap-3">
                      <Calendar size={24} className="text-gold-warm" />
                      Data de Entrega: {grupo.data}
                    </h3>
                    <p className="font-body text-sm text-brown-medium">
                      {grupo.pedidos.length} {grupo.pedidos.length === 1 ? 'pedido' : 'pedidos'} para esta data
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-body text-xs uppercase tracking-wider text-brown-light mb-1">
                      Total
                    </div>
                    <div className="font-display text-3xl text-gold-dark font-medium">
                      {formatPrice(grupo.total)}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  {grupo.pedidos.map((pedido) => (
                    <div key={pedido.id} className="p-4 bg-beige-lightest border-l-4 border-gold-warm">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-body font-medium text-brown-darkest">
                              {pedido.nome_cliente}
                            </span>
                            {getStatusBadge(pedido.status_pagamento)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-brown-medium">
                            <span>{pedido.telefone_whatsapp}</span>
                            <span>{formatDate(pedido.criado_em)}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-display text-xl text-gold-dark font-medium">
                            {formatPrice(pedido.total)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Visualização: Produtos Quantificados por Dia */}
      {viewMode === 'produtos-dia' && (
        <div className="space-y-6">
          {produtosPorDia.map((grupo, index) => (
            <motion.div
              key={grupo.data}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white shadow-sm overflow-hidden"
            >
              <div className="h-1 bg-gradient-to-r from-sage via-gold-warm to-sage" />
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-display text-2xl text-brown-darkest mb-2 flex items-center gap-3">
                      <Calendar size={24} className="text-gold-warm" />
                      Data de Entrega: {grupo.data}
                    </h3>
                    <p className="font-body text-sm text-brown-medium">
                      Total de {grupo.totalProdutos} {grupo.totalProdutos === 1 ? 'produto' : 'produtos'} para esta data
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {grupo.produtos.map((produto, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-beige-lightest to-beige-light border-l-4 border-gold-warm hover:shadow-md transition-all"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-12 h-12 bg-gold-warm/20 rounded-full flex items-center justify-center">
                          <Package size={20} className="text-gold-warm" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-body font-medium text-brown-darkest text-lg">
                            {produto.nome}
                          </h4>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-display text-2xl text-gold-dark font-semibold">
                          {produto.quantidade} {produto.quantidade === 1 ? 'unidade' : 'unidades'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Mensagem quando não há dados */}
      {((viewMode === 'lista' && filteredPedidos.length === 0) ||
        (viewMode === 'por-dia' && pedidosPorDia.length === 0) ||
        (viewMode === 'produtos-dia' && produtosPorDia.length === 0)) && (
        <div className="bg-white p-12 text-center">
          <p className="font-body text-brown-medium">
            Nenhum pedido encontrado
          </p>
        </div>
      )}
    </div>
  )
}

