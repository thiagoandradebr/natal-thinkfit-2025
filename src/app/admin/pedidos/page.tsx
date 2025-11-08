'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, CheckCircle, XCircle, Clock, Phone, Mail, MapPin, Calendar, DollarSign, List, Package, BarChart3, Trash2 } from 'lucide-react'
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
  const [statusFilter, setStatusFilter] = useState<'todos' | 'pendente' | 'pago' | 'cancelado' | 'confirmado'>('todos')
  const [viewMode, setViewMode] = useState<ViewMode>('lista')

  useEffect(() => {
    fetchPedidos()
  }, [])

  const fetchPedidos = async () => {
    try {
      // Buscar apenas campos necessários para melhor performance
      const { data, error } = await supabase
        .from('pedidos_natal')
        .select('id, nome_cliente, telefone_whatsapp, email, total, status_pagamento, metodo_pagamento, endereco_entrega, criado_em, itens, data_entrega, pago')
        .order('criado_em', { ascending: false })

      if (error) {
        console.error('❌ Erro ao buscar pedidos:', error)
        throw error
      }
      
      setPedidos(data || [])
    } catch (error) {
      console.error('❌ Erro ao buscar pedidos:', error)
      alert(`Erro ao carregar pedidos: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, novoStatus: 'pendente' | 'pago' | 'cancelado' | 'confirmado') => {
    try {
      const { error } = await supabase
        .from('pedidos_natal')
        .update({ status_pagamento: novoStatus })
        .eq('id', id)

      if (error) {
        console.error('❌ Erro detalhado ao atualizar status:', error)
        throw error
      }
      
      setPedidos(pedidos.map(p => p.id === id ? { ...p, status_pagamento: novoStatus } : p))
      alert('Status atualizado com sucesso!')
      fetchPedidos() // Recarregar para garantir sincronização
    } catch (error: any) {
      console.error('Erro ao atualizar status:', error)
      const errorMessage = error?.message || error?.details || 'Erro desconhecido'
      const errorHint = error?.hint || ''
      alert(`Erro ao atualizar status:\n\n${errorMessage}${errorHint ? `\n\nDica: ${errorHint}` : ''}\n\nVerifique se a migration foi aplicada no banco de dados.`)
    }
  }

  const marcarComoPago = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pedidos_natal')
        .update({ pago: true })
        .eq('id', id)

      if (error) {
        console.error('❌ Erro detalhado ao marcar como pago:', error)
        throw error
      }
      
      setPedidos(pedidos.map(p => p.id === id ? { ...p, pago: true } : p))
      alert('Pedido marcado como pago!')
      fetchPedidos() // Recarregar para garantir sincronização
    } catch (error: any) {
      console.error('Erro ao marcar como pago:', error)
      const errorMessage = error?.message || error?.details || 'Erro desconhecido'
      const errorHint = error?.hint || ''
      alert(`Erro ao marcar como pago:\n\n${errorMessage}${errorHint ? `\n\nDica: ${errorHint}` : ''}\n\nVerifique se a migration foi aplicada no banco de dados.`)
    }
  }

  const deletarPedido = async (id: string, nomeCliente: string) => {
    // Confirmação antes de deletar
    const confirmacao = window.confirm(
      `Tem certeza que deseja DELETAR o pedido de ${nomeCliente}?\n\nEsta ação é IRREVERSÍVEL e não pode ser desfeita.`
    )

    if (!confirmacao) {
      return
    }

    try {
      const { error } = await supabase
        .from('pedidos_natal')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      // Remover da lista local
      setPedidos(pedidos.filter(p => p.id !== id))
      alert('Pedido deletado com sucesso!')
    } catch (error) {
      console.error('Erro ao deletar pedido:', error)
      alert('Erro ao deletar pedido. Tente novamente.')
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

  const getStatusBadge = (status: string, pago?: boolean) => {
    const styles = {
      pendente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      pago: 'bg-green-100 text-green-800 border-green-300',
      cancelado: 'bg-red-100 text-red-800 border-red-300',
      confirmado: 'bg-blue-100 text-blue-800 border-blue-300',
    }
    
    const icons = {
      pendente: Clock,
      pago: CheckCircle,
      cancelado: XCircle,
      confirmado: CheckCircle,
    }
    
    const labels = {
      pendente: 'Pendente',
      pago: 'Pago',
      cancelado: 'Cancelado',
      confirmado: 'Confirmado',
    }
    
    const Icon = icons[status as keyof typeof icons] || Clock
    
    return (
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-body uppercase tracking-wider ${styles[status as keyof typeof styles] || styles.pendente}`}>
          <Icon size={12} />
          {labels[status as keyof typeof labels] || status}
        </span>
        {pago && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500 text-white text-xs font-body uppercase tracking-wider">
            <DollarSign size={10} />
            PAGO
          </span>
        )}
      </div>
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
      {/* Header Moderno - Otimizado */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between relative"
      >
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-20 h-20 bg-gold-warm/5 rounded-full blur-lg" />
          <h2 className="font-display text-4xl text-brown-darkest font-light mb-2 tracking-tight relative">
            Pedidos
          </h2>
          <p className="font-body text-brown-medium text-sm relative">
            Gerencie todos os pedidos recebidos
          </p>
        </div>
        
        {/* Modos de Visualização Modernos */}
        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg border border-beige-medium/50">
          <motion.button
            onClick={() => setViewMode('lista')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2.5 font-body text-xs uppercase tracking-wider transition-all flex items-center gap-2 rounded-lg ${
              viewMode === 'lista'
                ? 'bg-gradient-to-r from-wine to-wine-dark text-white shadow-md'
                : 'text-brown-medium hover:bg-beige-lightest'
            }`}
          >
            <List size={16} />
            Lista
          </motion.button>
          <motion.button
            onClick={() => setViewMode('por-dia')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2.5 font-body text-xs uppercase tracking-wider transition-all flex items-center gap-2 rounded-lg ${
              viewMode === 'por-dia'
                ? 'bg-gradient-to-r from-wine to-wine-dark text-white shadow-md'
                : 'text-brown-medium hover:bg-beige-lightest'
            }`}
          >
            <Calendar size={16} />
            Por Data
          </motion.button>
          <motion.button
            onClick={() => setViewMode('produtos-dia')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2.5 font-body text-xs uppercase tracking-wider transition-all flex items-center gap-2 rounded-lg ${
              viewMode === 'produtos-dia'
                ? 'bg-gradient-to-r from-wine to-wine-dark text-white shadow-md'
                : 'text-brown-medium hover:bg-beige-lightest'
            }`}
          >
            <BarChart3 size={16} />
            Produtos
          </motion.button>
        </div>
      </motion.div>

      {/* Filtros e Busca Modernos - Otimizados */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3 }}
        className="bg-white/90 rounded-xl p-6 shadow-lg border border-beige-medium/50 space-y-4"
      >
        {/* Busca */}
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-medium group-focus-within:text-gold-warm transition-colors">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Buscar por nome, telefone ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border-2 border-beige-medium rounded-xl focus:border-gold-warm focus:ring-2 focus:ring-gold-warm/20 focus:outline-none font-body text-sm bg-beige-lightest/50 transition-all"
          />
        </div>

        {/* Filtros de Status Modernos */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-body text-xs uppercase tracking-wider text-brown-medium font-semibold">Filtrar:</span>
          {['todos', 'pendente', 'pago', 'cancelado', 'confirmado'].map((status) => (
            <motion.button
              key={status}
              onClick={() => setStatusFilter(status as any)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2.5 font-body text-xs uppercase tracking-wider transition-all rounded-lg ${
                statusFilter === status
                  ? 'bg-gradient-to-r from-wine to-wine-dark text-white shadow-md'
                  : 'bg-beige-lightest text-brown-medium hover:bg-beige-medium hover:shadow-sm'
              }`}
            >
              {status === 'todos' ? 'Todos' : status.charAt(0).toUpperCase() + status.slice(1)}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Visualização: Lista Normal Moderna */}
      {viewMode === 'lista' && (
        <div className="space-y-4">
          {filteredPedidos.map((pedido, index) => (
          <motion.div
            key={pedido.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.02, 0.2), duration: 0.3 }}
            whileHover={{ y: -2, scale: 1.005 }}
            className="bg-white/90 rounded-2xl shadow-lg overflow-hidden border border-beige-medium/50 group hover:shadow-xl transition-all"
          >
            {/* Ribbon */}
            <div className="h-[3px] bg-gradient-to-r from-gold-warm via-gold to-gold-warm" />

            <div className="p-8">
              {/* Header do Pedido Moderno */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="font-display text-2xl text-brown-darkest font-light">
                      {pedido.nome_cliente}
                    </h3>
                    {getStatusBadge(pedido.status_pagamento, pedido.pago)}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-brown-medium">
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-beige-lightest rounded-lg">
                      <Phone size={14} className="text-gold-warm" />
                      <span className="font-medium">{pedido.telefone_whatsapp}</span>
                    </div>
                    {pedido.email && (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-beige-lightest rounded-lg">
                        <Mail size={14} className="text-gold-warm" />
                        <span className="font-medium">{pedido.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-beige-lightest rounded-lg">
                      <Calendar size={14} className="text-gold-warm" />
                      <span className="font-medium">{formatDate(pedido.criado_em)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right ml-6">
                  <div className="font-body text-xs uppercase tracking-wider text-brown-medium mb-2">
                    Total do Pedido
                  </div>
                  <div className="font-display text-3xl text-gold-dark font-semibold">
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
              <div className="flex items-center gap-3 pt-4 border-t border-beige-medium flex-wrap">
                <div className="flex items-center gap-3 flex-wrap flex-1">
                  <span className="font-body text-xs uppercase tracking-wider text-brown-medium">
                    Alterar Status:
                  </span>
                  {/* Botão Marcar como Pago (adiciona flag, não muda status) */}
                  {!pedido.pago && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => marcarComoPago(pedido.id)}
                      className="px-4 py-2 bg-green-600 text-white font-body text-xs uppercase tracking-wider hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <DollarSign size={14} />
                      Marcar como Pago
                    </motion.button>
                  )}
                  {/* Botão Confirmar */}
                  {pedido.status_pagamento !== 'confirmado' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateStatus(pedido.id, 'confirmado')}
                      className="px-4 py-2 bg-blue-600 text-white font-body text-xs uppercase tracking-wider hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <CheckCircle size={14} />
                      Confirmar
                    </motion.button>
                  )}
                  {/* Botão Cancelar */}
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
                  {/* Botão Voltar para Pendente */}
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
                {/* Botão Deletar - Separado e destacado */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => deletarPedido(pedido.id, pedido.nome_cliente)}
                  className="px-4 py-2 bg-red-800 text-white font-body text-xs uppercase tracking-wider hover:bg-red-900 transition-colors flex items-center gap-2 border-2 border-red-700 shadow-md"
                  title="Deletar pedido permanentemente"
                >
                  <Trash2 size={14} />
                  Deletar
                </motion.button>
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
                            {getStatusBadge(pedido.status_pagamento, pedido.pago)}
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

