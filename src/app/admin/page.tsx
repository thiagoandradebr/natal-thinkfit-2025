'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Package, ShoppingBag, TrendingUp, DollarSign } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProdutos: 0,
    totalPedidos: 0,
    produtosDisponiveis: 0,
    valorTotal: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Paralelizar queries e buscar apenas campos necessários
      const [produtosResult, pedidosResult] = await Promise.all([
        supabase
          .from('produtos_natal')
          .select('id, status', { count: 'exact' }),
        supabase
          .from('pedidos_natal')
          .select('total', { count: 'exact' })
      ])

      const produtos = produtosResult.data || []
      const pedidos = pedidosResult.data || []

      // Usar count quando disponível para melhor performance
      const totalProdutos = produtosResult.count ?? produtos.length
      const totalPedidos = pedidosResult.count ?? pedidos.length
      const produtosDisponiveis = produtos.filter(p => p.status === 'disponivel').length
      const valorTotal = pedidos.reduce((sum, p) => sum + (Number(p.total) || 0), 0)

      setStats({
        totalProdutos,
        totalPedidos,
        produtosDisponiveis,
        valorTotal,
      })
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      setStats({
        totalProdutos: 0,
        totalPedidos: 0,
        produtosDisponiveis: 0,
        valorTotal: 0,
      })
    } finally {
      setLoading(false)
    }
  }

  const cards = [
    {
      title: 'Total de Produtos',
      value: stats.totalProdutos,
      icon: Package,
      color: 'from-wine to-wine-dark',
      link: '/admin/produtos',
    },
    {
      title: 'Produtos Disponíveis',
      value: stats.produtosDisponiveis,
      icon: TrendingUp,
      color: 'from-forest to-forest-dark',
      link: '/admin/produtos',
    },
    {
      title: 'Total de Pedidos',
      value: stats.totalPedidos,
      icon: ShoppingBag,
      color: 'from-gold to-gold-dark',
      link: '/admin/pedidos',
    },
    {
      title: 'Valor Total',
      value: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(stats.valorTotal),
      icon: DollarSign,
      color: 'from-sage to-forest',
      link: '/admin/pedidos',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wine"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header com gradiente sutil - otimizado */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative"
      >
        <div className="absolute -top-4 -left-4 w-24 h-24 bg-gold-warm/5 rounded-full blur-xl" />
        <h2 className="font-display text-4xl text-brown-darkest font-light mb-3 tracking-tight relative">
          Dashboard
        </h2>
        <p className="font-body text-brown-medium text-sm relative">
          Visão geral do sistema - Natal 2025
        </p>
      </motion.div>

      {/* Stats Cards - Design Moderno */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <Link key={index} href={card.link}>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.05, 0.2), duration: 0.3 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`relative bg-gradient-to-br ${card.color} p-8 text-white rounded-2xl shadow-xl cursor-pointer group overflow-hidden`}
            >
              {/* Efeito de brilho no hover - simplificado */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Padrão decorativo - reduzido */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl group-hover:bg-white/30 transition-all">
                    <card.icon size={28} className="opacity-90 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="w-2 h-2 bg-white rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="space-y-2">
                  <p className="font-body text-xs uppercase tracking-wider opacity-90 font-medium">
                    {card.title}
                  </p>
                  <p className="font-display text-4xl font-semibold leading-tight">
                    {card.value}
                  </p>
                </div>
              </div>
              
              {/* Indicador de hover */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Quick Actions - Design Moderno - Otimizado */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="bg-white/90 rounded-2xl p-8 shadow-xl border border-beige-medium/50 relative overflow-hidden"
      >
        {/* Background decorativo - reduzido */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-gold-warm/5 rounded-full blur-2xl -mr-24 -mt-24" />
        
        <div className="relative z-10">
          <div className="h-[2px] bg-gradient-to-r from-transparent via-gold-warm to-transparent mb-8" />
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-display text-2xl text-brown-darkest font-light mb-2">
                Ações Rápidas
              </h3>
              <p className="font-body text-sm text-brown-medium">
                Acesso rápido às principais funcionalidades
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/admin/produtos/novo">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-wine via-wine-dark to-wine text-white px-6 py-5 font-body text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-lg rounded-xl hover:shadow-2xl transition-all group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <Package size={20} className="relative z-10" />
                <span className="relative z-10 font-semibold">Novo Produto</span>
              </motion.button>
            </Link>

            <Link href="/admin/produtos">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full border-2 border-beige-medium bg-white text-brown-darkest px-6 py-5 font-body text-sm uppercase tracking-wider hover:border-gold-warm hover:bg-gold-warm/5 transition-all rounded-xl shadow-sm hover:shadow-md group"
              >
                <div className="flex items-center justify-center gap-3">
                  <Package size={20} className="text-brown-medium group-hover:text-gold-warm transition-colors" />
                  <span className="font-semibold">Ver Produtos</span>
                </div>
              </motion.button>
            </Link>

            <Link href="/admin/pedidos">
              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full border-2 border-beige-medium bg-white text-brown-darkest px-6 py-5 font-body text-sm uppercase tracking-wider hover:border-gold-warm hover:bg-gold-warm/5 transition-all rounded-xl shadow-sm hover:shadow-md group"
              >
                <div className="flex items-center justify-center gap-3">
                  <ShoppingBag size={20} className="text-brown-medium group-hover:text-gold-warm transition-colors" />
                  <span className="font-semibold">Ver Pedidos</span>
                </div>
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
