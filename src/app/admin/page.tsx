'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Package, 
  ShoppingBag, 
  TrendingUp, 
  DollarSign, 
  Bell, 
  Calendar, 
  AlertCircle,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Users
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Pedido } from '@/types/database'

interface Stats {
  totalProdutos: number
  totalPedidos: number
  produtosDisponiveis: number
  valorTotal: number
  pedidosHoje: number
  valorHoje: number
  pedidosOntem: number
  valorOntem: number
  pedidosPendentes: number
  ticketMedio: number
  vendasUltimos7Dias: { data: string; valor: number }[]
  produtosEsgotados: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalProdutos: 0,
    totalPedidos: 0,
    produtosDisponiveis: 0,
    valorTotal: 0,
    pedidosHoje: 0,
    valorHoje: 0,
    pedidosOntem: 0,
    valorOntem: 0,
    pedidosPendentes: 0,
    ticketMedio: 0,
    vendasUltimos7Dias: [],
    produtosEsgotados: 0,
  })
  const [pedidosRecentes, setPedidosRecentes] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastPedidoId, setLastPedidoId] = useState<string | null>(null)
  const [newPedidoAlert, setNewPedidoAlert] = useState<{ show: boolean; message: string }>({ show: false, message: '' })
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [showEstatisticas, setShowEstatisticas] = useState(false)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    let mounted = true
    
    const initPolling = async () => {
      await fetchStats()
      
      if (mounted) {
        setTimeout(() => {
          if (mounted) {
            pollingIntervalRef.current = setInterval(() => {
              fetchStats(true)
            }, 10000)
          }
        }, 3000)
      }
    }

    initPolling()

    return () => {
      mounted = false
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const fetchStats = async (checkNewPedidos = false) => {
    try {
      setRefreshing(true)
      
      const hoje = new Date()
      hoje.setHours(0, 0, 0, 0)
      const hojeInicio = hoje.toISOString()
      const hojeFim = new Date(hoje)
      hojeFim.setHours(23, 59, 59, 999)
      const hojeFimISO = hojeFim.toISOString()

      // Ontem
      const ontem = new Date(hoje)
      ontem.setDate(ontem.getDate() - 1)
      const ontemInicio = ontem.toISOString()
      const ontemFim = new Date(ontem)
      ontemFim.setHours(23, 59, 59, 999)
      const ontemFimISO = ontemFim.toISOString()

      // Últimos 7 dias
      const seteDiasAtras = new Date(hoje)
      seteDiasAtras.setDate(seteDiasAtras.getDate() - 7)
      const seteDiasAtrasISO = seteDiasAtras.toISOString()

      // Paralelizar queries
      const [
        produtosResult,
        pedidosResult,
        pedidosHojeResult,
        pedidosOntemResult,
        pedidosPendentesResult,
        ultimoPedidoResult,
        pedidosRecentesResult,
        vendas7DiasResult,
        produtosEsgotadosResult
      ] = await Promise.all([
        supabase.from('produtos_natal').select('id, status', { count: 'exact' }),
        supabase.from('pedidos_natal').select('id, total, criado_em', { count: 'exact' }).order('criado_em', { ascending: false }),
        supabase.from('pedidos_natal').select('total, criado_em').gte('criado_em', hojeInicio).lte('criado_em', hojeFimISO),
        supabase.from('pedidos_natal').select('total, criado_em').gte('criado_em', ontemInicio).lte('criado_em', ontemFimISO),
        supabase.from('pedidos_natal').select('id').eq('status_pagamento', 'pendente'),
        supabase.from('pedidos_natal').select('id').order('criado_em', { ascending: false }).limit(1).single(),
        supabase.from('pedidos_natal').select('id, nome_cliente, total, status_pagamento, criado_em, pago').order('criado_em', { ascending: false }).limit(5),
        supabase.from('pedidos_natal').select('total, criado_em').gte('criado_em', seteDiasAtrasISO).order('criado_em', { ascending: true }),
        supabase.from('produtos_natal').select('id').eq('status', 'esgotado')
      ])

      const produtos = produtosResult.data || []
      const pedidos = pedidosResult.data || []
      const pedidosHoje = pedidosHojeResult.data || []
      const pedidosOntem = pedidosOntemResult.data || []
      const pedidosPendentes = pedidosPendentesResult.data || []
      const vendas7Dias = vendas7DiasResult.data || []
      const produtosEsgotados = produtosEsgotadosResult.data || []

      // Processar vendas dos últimos 7 dias por dia
      const vendasPorDia: { [key: string]: number } = {}
      vendas7Dias.forEach(pedido => {
        const data = new Date(pedido.criado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
        vendasPorDia[data] = (vendasPorDia[data] || 0) + Number(pedido.total || 0)
      })

      // Preencher últimos 7 dias (mesmo que não tenha vendas)
      const vendasUltimos7Dias = []
      for (let i = 6; i >= 0; i--) {
        const data = new Date(hoje)
        data.setDate(data.getDate() - i)
        const dataFormatada = data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
        vendasUltimos7Dias.push({
          data: dataFormatada,
          valor: vendasPorDia[dataFormatada] || 0
        })
      }

      // Calcular métricas
      const totalProdutos = produtosResult.count ?? produtos.length
      const totalPedidos = pedidosResult.count ?? pedidos.length
      const produtosDisponiveis = produtos.filter(p => p.status === 'disponivel').length
      const valorTotal = pedidos.reduce((sum, p) => sum + (Number(p.total) || 0), 0)
      const pedidosHojeCount = pedidosHoje.length
      const valorHoje = pedidosHoje.reduce((sum, p) => sum + (Number(p.total) || 0), 0)
      const pedidosOntemCount = pedidosOntem.length
      const valorOntem = pedidosOntem.reduce((sum, p) => sum + (Number(p.total) || 0), 0)
      const pedidosPendentesCount = pedidosPendentes.length
      const ticketMedio = totalPedidos > 0 ? valorTotal / totalPedidos : 0

      // Verificar novo pedido
      if (checkNewPedidos && ultimoPedidoResult.data) {
        const novoPedidoId = ultimoPedidoResult.data.id
        if (lastPedidoId && novoPedidoId !== lastPedidoId) {
          triggerNewPedidoAlert()
        }
        setLastPedidoId(novoPedidoId)
      } else if (!lastPedidoId && ultimoPedidoResult.data) {
        setLastPedidoId(ultimoPedidoResult.data.id)
      }

      setStats({
        totalProdutos,
        totalPedidos,
        produtosDisponiveis,
        valorTotal,
        pedidosHoje: pedidosHojeCount,
        valorHoje,
        pedidosOntem: pedidosOntemCount,
        valorOntem,
        pedidosPendentes: pedidosPendentesCount,
        ticketMedio,
        vendasUltimos7Dias,
        produtosEsgotados: produtosEsgotados.length,
      })

      setPedidosRecentes(pedidosRecentesResult.data as Pedido[] || [])
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const triggerNewPedidoAlert = () => {
    setNewPedidoAlert({ show: true, message: '🎉 Novo pedido recebido!' })
    setTimeout(() => {
      setNewPedidoAlert({ show: false, message: '' })
    }, 5000)
    
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const oscillator1 = audioContext.createOscillator()
      const gainNode1 = audioContext.createGain()
      oscillator1.connect(gainNode1)
      gainNode1.connect(audioContext.destination)
      oscillator1.frequency.value = 800
      oscillator1.type = 'sine'
      gainNode1.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
      oscillator1.start(audioContext.currentTime)
      oscillator1.stop(audioContext.currentTime + 0.3)
      
      setTimeout(() => {
        const oscillator2 = audioContext.createOscillator()
        const gainNode2 = audioContext.createGain()
        oscillator2.connect(gainNode2)
        gainNode2.connect(audioContext.destination)
        oscillator2.frequency.value = 1000
        oscillator2.type = 'sine'
        gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime)
        gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        oscillator2.start(audioContext.currentTime)
        oscillator2.stop(audioContext.currentTime + 0.3)
      }, 200)
    } catch (error) {
      console.error('Erro ao tocar som:', error)
    }

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('🎉 Novo Pedido!', {
        body: 'Um novo pedido foi recebido no sistema',
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: 'novo-pedido',
      })
    }
  }

  const getStatusBadge = (status: string, pago?: boolean) => {
    const badges = {
      pendente: 'bg-yellow-100 text-yellow-800',
      confirmado: 'bg-blue-100 text-blue-800',
      pago: 'bg-green-100 text-green-800',
      cancelado: 'bg-red-100 text-red-800',
    }
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800'
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  }

  // Calcular altura máxima do gráfico
  const maxVendas = Math.max(...stats.vendasUltimos7Dias.map(v => v.valor), 1)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wine"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Alerta de Novo Pedido */}
      <AnimatePresence>
        {newPedidoAlert.show && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-24 right-8 z-50 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-4 rounded-xl shadow-2xl border-2 border-white/20 backdrop-blur-sm"
          >
            <div className="flex items-center gap-3">
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 0.5, repeat: 2 }}>
                <Bell size={24} className="text-white" />
              </motion.div>
              <div>
                <p className="font-body font-semibold text-sm">{newPedidoAlert.message}</p>
                <p className="font-body text-xs opacity-90 mt-1">Clique para ver os pedidos</p>
              </div>
              <Link href="/admin/pedidos">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="ml-4 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-xs font-semibold uppercase tracking-wider"
                >
                  Ver
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Compacto */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl text-brown-darkest font-light tracking-tight">
            Dashboard
          </h2>
          <p className="font-body text-xs text-brown-medium mt-1">
            Última atualização: {formatTime(lastUpdate)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-green-500 rounded-full"
            />
            <span className="font-body text-xs text-green-700 uppercase tracking-wider font-semibold">
              Monitorando
            </span>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchStats()}
            disabled={refreshing}
            className="p-2 bg-white border border-beige-medium rounded-lg hover:bg-beige-lightest transition-colors disabled:opacity-50"
            title="Atualizar dados"
          >
            <RefreshCw size={18} className={`text-brown-medium ${refreshing ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>
      </div>

      {/* Cards Principais - Compactos */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Total Pedidos */}
        <Link href="/admin/pedidos">
          <motion.div
            whileHover={{ y: -2, scale: 1.02 }}
            className="bg-gradient-to-br from-wine to-wine-dark p-4 rounded-xl text-white shadow-lg cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <ShoppingBag size={20} className="opacity-80" />
              {stats.pedidosPendentes > 0 && (
                <span className="text-xs bg-yellow-500 px-2 py-0.5 rounded-full font-semibold">
                  {stats.pedidosPendentes}
                </span>
              )}
            </div>
            <p className="text-xs opacity-90 mb-1">Total Pedidos</p>
            <p className="text-2xl font-semibold">{stats.totalPedidos}</p>
          </motion.div>
        </Link>

        {/* Pedidos Hoje */}
        <Link href="/admin/pedidos">
          <motion.div
            whileHover={{ y: -2, scale: 1.02 }}
            className="bg-gradient-to-br from-blue-600 to-blue-700 p-4 rounded-xl text-white shadow-lg cursor-pointer"
          >
            <Calendar size={20} className="opacity-80 mb-2" />
            <p className="text-xs opacity-90 mb-1">Hoje</p>
            <p className="text-2xl font-semibold">{stats.pedidosHoje}</p>
            {stats.pedidosOntem > 0 && (
              <p className="text-xs opacity-75 mt-1">
                {stats.pedidosHoje >= stats.pedidosOntem ? '↑' : '↓'} {Math.abs(stats.pedidosHoje - stats.pedidosOntem)}
              </p>
            )}
          </motion.div>
        </Link>

        {/* Vendas Hoje */}
        <Link href="/admin/pedidos">
          <motion.div
            whileHover={{ y: -2, scale: 1.02 }}
            className="bg-gradient-to-br from-green-600 to-green-700 p-4 rounded-xl text-white shadow-lg cursor-pointer"
          >
            <DollarSign size={20} className="opacity-80 mb-2" />
            <p className="text-xs opacity-90 mb-1">Vendas Hoje</p>
            <p className="text-xl font-semibold">{formatCurrency(stats.valorHoje)}</p>
            {stats.valorOntem > 0 && (
              <p className="text-xs opacity-75 mt-1">
                {stats.valorHoje >= stats.valorOntem ? '↑' : '↓'} {((stats.valorHoje / stats.valorOntem - 1) * 100).toFixed(0)}%
              </p>
            )}
          </motion.div>
        </Link>

        {/* Ticket Médio */}
        <motion.div
          whileHover={{ y: -2, scale: 1.02 }}
          className="bg-gradient-to-br from-gold to-gold-dark p-4 rounded-xl text-white shadow-lg"
        >
          <TrendingUp size={20} className="opacity-80 mb-2" />
          <p className="text-xs opacity-90 mb-1">Ticket Médio</p>
          <p className="text-xl font-semibold">{formatCurrency(stats.ticketMedio)}</p>
        </motion.div>

        {/* Pedidos Pendentes */}
        <Link href="/admin/pedidos?status=pendente">
          <motion.div
            whileHover={{ y: -2, scale: 1.02 }}
            className={`p-4 rounded-xl shadow-lg cursor-pointer ${
              stats.pedidosPendentes > 0
                ? 'bg-gradient-to-br from-yellow-500 to-yellow-600 text-white'
                : 'bg-white border border-beige-medium'
            }`}
          >
            <Clock size={20} className={`mb-2 ${stats.pedidosPendentes > 0 ? 'opacity-80' : 'text-brown-medium'}`} />
            <p className={`text-xs mb-1 ${stats.pedidosPendentes > 0 ? 'opacity-90' : 'text-brown-medium'}`}>
              Pendentes
            </p>
            <p className={`text-2xl font-semibold ${stats.pedidosPendentes > 0 ? '' : 'text-brown-darkest'}`}>
              {stats.pedidosPendentes}
            </p>
          </motion.div>
        </Link>

        {/* Produtos Esgotados */}
        <Link href="/admin/produtos?status=esgotado">
          <motion.div
            whileHover={{ y: -2, scale: 1.02 }}
            className={`p-4 rounded-xl shadow-lg cursor-pointer ${
              stats.produtosEsgotados > 0
                ? 'bg-gradient-to-br from-red-500 to-red-600 text-white'
                : 'bg-white border border-beige-medium'
            }`}
          >
            <AlertCircle size={20} className={`mb-2 ${stats.produtosEsgotados > 0 ? 'opacity-80' : 'text-brown-medium'}`} />
            <p className={`text-xs mb-1 ${stats.produtosEsgotados > 0 ? 'opacity-90' : 'text-brown-medium'}`}>
              Esgotados
            </p>
            <p className={`text-2xl font-semibold ${stats.produtosEsgotados > 0 ? '' : 'text-brown-darkest'}`}>
              {stats.produtosEsgotados}
            </p>
          </motion.div>
        </Link>
      </div>

      {/* Gráfico de Vendas - Últimos 7 Dias */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-beige-medium/50"
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-lg text-brown-darkest font-light">Vendas - Últimos 7 Dias</h3>
            <p className="font-body text-xs text-brown-medium">Evolução diária de vendas</p>
          </div>
        </div>
        <div className="flex items-end justify-between gap-2 h-32">
          {stats.vendasUltimos7Dias.map((venda, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col items-center justify-end h-full">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(venda.valor / maxVendas) * 100}%` }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="w-full bg-gradient-to-t from-wine to-wine-dark rounded-t-lg min-h-[4px]"
                />
              </div>
              <p className="text-xs text-brown-medium font-medium">{venda.data}</p>
              <p className="text-xs text-brown-darkest font-semibold">{formatCurrency(venda.valor)}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Grid: Pedidos Recentes + Estatísticas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pedidos Recentes */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-beige-medium/50"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-lg text-brown-darkest font-light">Pedidos Recentes</h3>
              <p className="font-body text-xs text-brown-medium">Últimos 5 pedidos recebidos</p>
            </div>
            <Link href="/admin/pedidos">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-xs text-wine hover:text-wine-dark font-semibold uppercase tracking-wider"
              >
                Ver todos →
              </motion.button>
            </Link>
          </div>
          <div className="space-y-3">
            {pedidosRecentes.length === 0 ? (
              <p className="text-sm text-brown-medium text-center py-4">Nenhum pedido ainda</p>
            ) : (
              pedidosRecentes.map((pedido) => (
                <Link key={pedido.id} href={`/admin/pedidos#${pedido.id}`}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="p-3 bg-beige-lightest rounded-lg border border-beige-medium/50 hover:border-wine/30 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-body text-sm font-semibold text-brown-darkest">{pedido.nome_cliente}</p>
                        <p className="font-body text-xs text-brown-medium mt-1">
                          {formatCurrency(Number(pedido.total))} • {new Date(pedido.criado_em).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {pedido.pago && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">
                            PAGO
                          </span>
                        )}
                        <span className={`px-2 py-1 text-xs font-semibold rounded ${getStatusBadge(pedido.status_pagamento, pedido.pago)}`}>
                          {pedido.status_pagamento.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))
            )}
          </div>
        </motion.div>

        {/* Estatísticas Detalhadas - Colapsável */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-lg border border-beige-medium/50 overflow-hidden"
        >
          <button
            onClick={() => setShowEstatisticas(!showEstatisticas)}
            className="w-full p-6 flex items-center justify-between hover:bg-beige-lightest/50 transition-colors"
          >
            <div>
              <h3 className="font-display text-lg text-brown-darkest font-light">Estatísticas Detalhadas</h3>
              <p className="font-body text-xs text-brown-medium">Métricas avançadas do sistema</p>
            </div>
            {showEstatisticas ? <ChevronUp size={20} className="text-brown-medium" /> : <ChevronDown size={20} className="text-brown-medium" />}
          </button>
          <AnimatePresence>
            {showEstatisticas && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 space-y-4 border-t border-beige-medium/50 pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-beige-lightest rounded-lg">
                      <p className="text-xs text-brown-medium mb-1">Total de Vendas</p>
                      <p className="text-lg font-semibold text-brown-darkest">{formatCurrency(stats.valorTotal)}</p>
                    </div>
                    <div className="p-3 bg-beige-lightest rounded-lg">
                      <p className="text-xs text-brown-medium mb-1">Vendas Ontem</p>
                      <p className="text-lg font-semibold text-brown-darkest">{formatCurrency(stats.valorOntem)}</p>
                    </div>
                    <div className="p-3 bg-beige-lightest rounded-lg">
                      <p className="text-xs text-brown-medium mb-1">Produtos Disponíveis</p>
                      <p className="text-lg font-semibold text-brown-darkest">{stats.produtosDisponiveis}</p>
                    </div>
                    <div className="p-3 bg-beige-lightest rounded-lg">
                      <p className="text-xs text-brown-medium mb-1">Total Produtos</p>
                      <p className="text-lg font-semibold text-brown-darkest">{stats.totalProdutos}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-beige-medium/30">
                    <p className="text-xs text-brown-medium mb-2">Comparação Hoje vs Ontem</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-brown-darkest">Pedidos</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{stats.pedidosHoje}</span>
                          <span className={`text-xs ${stats.pedidosHoje >= stats.pedidosOntem ? 'text-green-600' : 'text-red-600'}`}>
                            {stats.pedidosHoje >= stats.pedidosOntem ? '↑' : '↓'} {Math.abs(stats.pedidosHoje - stats.pedidosOntem)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-brown-darkest">Vendas</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{formatCurrency(stats.valorHoje)}</span>
                          <span className={`text-xs ${stats.valorHoje >= stats.valorOntem ? 'text-green-600' : 'text-red-600'}`}>
                            {stats.valorHoje >= stats.valorOntem ? '↑' : '↓'} {stats.valorOntem > 0 ? ((stats.valorHoje / stats.valorOntem - 1) * 100).toFixed(1) : 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
            </motion.div>
      </div>

      {/* Ações Rápidas - Compacto */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl p-6 shadow-lg border border-beige-medium/50"
      >
        <h3 className="font-display text-lg text-brown-darkest font-light mb-4">Ações Rápidas</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Link href="/admin/produtos/novo">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-wine to-wine-dark text-white px-4 py-3 font-body text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg rounded-lg hover:shadow-xl transition-all"
              >
              <Package size={18} />
              Novo Produto
              </motion.button>
            </Link>
            <Link href="/admin/produtos">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              className="w-full border-2 border-beige-medium bg-white text-brown-darkest px-4 py-3 font-body text-xs uppercase tracking-wider hover:border-gold-warm hover:bg-gold-warm/5 transition-all rounded-lg shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <Package size={18} />
              Ver Produtos
              </motion.button>
            </Link>
            <Link href="/admin/pedidos">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              className="w-full border-2 border-beige-medium bg-white text-brown-darkest px-4 py-3 font-body text-xs uppercase tracking-wider hover:border-gold-warm hover:bg-gold-warm/5 transition-all rounded-lg shadow-sm hover:shadow-md flex items-center justify-center gap-2"
            >
              <ShoppingBag size={18} />
              Ver Pedidos
              </motion.button>
            </Link>
        </div>
      </motion.div>
    </div>
  )
}
