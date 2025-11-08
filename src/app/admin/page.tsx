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
      // Buscar produtos
      const { data: produtos, error: produtosError } = await supabase
        .from('produtos_natal')
        .select('*')

      if (produtosError) {
        console.error('Erro ao buscar produtos:', produtosError)
      }

      // Buscar pedidos
      const { data: pedidos, error: pedidosError } = await supabase
        .from('pedidos_natal')
        .select('*')

      if (pedidosError) {
        console.error('Erro ao buscar pedidos:', pedidosError)
      }

      const produtosDisponiveis = produtos?.filter(p => p.status === 'disponivel').length || 0
      const valorTotal = pedidos?.reduce((sum, p) => sum + (p.total || 0), 0) || 0

      setStats({
        totalProdutos: produtos?.length || 0,
        totalPedidos: pedidos?.length || 0,
        produtosDisponiveis,
        valorTotal,
      })
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      // Mesmo com erro, definir valores padrão para não travar a página
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
      {/* Header */}
      <div>
        <h2 className="font-display text-3xl text-brown-darkest font-light mb-2">
          Dashboard
        </h2>
        <p className="font-body text-brown-medium text-sm">
          Visão geral do sistema - Natal 2025
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <Link key={index} href={card.link}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              className={`bg-gradient-to-br ${card.color} p-6 text-white shadow-lg cursor-pointer group`}
            >
              <div className="flex items-start justify-between mb-4">
                <card.icon size={32} className="opacity-80 group-hover:opacity-100 transition-opacity" />
                <div className="w-2 h-2 bg-white rounded-full opacity-50"></div>
              </div>
              <div className="space-y-2">
                <p className="font-body text-xs uppercase tracking-wider opacity-90">
                  {card.title}
                </p>
                <p className="font-display text-3xl font-medium">
                  {card.value}
                </p>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-8 shadow-sm">
        <div className="h-1 bg-gradient-to-r from-gold-warm via-gold to-gold-warm mb-6" />
        
        <h3 className="font-body text-xs uppercase tracking-wider text-brown-darkest mb-6">
          Ações Rápidas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/produtos/novo">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-wine to-wine-dark text-white px-6 py-4 font-body text-xs uppercase tracking-[2px] flex items-center justify-center gap-2 shadow-lg"
            >
              <Package size={18} />
              Novo Produto
            </motion.button>
          </Link>

          <Link href="/admin/produtos">
            <button className="w-full border-2 border-beige-medium text-brown-medium px-6 py-4 font-body text-xs uppercase tracking-[2px] hover:border-brown-medium hover:text-brown-darkest transition-all">
              Ver Produtos
            </button>
          </Link>

          <Link href="/admin/pedidos">
            <button className="w-full border-2 border-beige-medium text-brown-medium px-6 py-4 font-body text-xs uppercase tracking-[2px] hover:border-brown-medium hover:text-brown-darkest transition-all">
              Ver Pedidos
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
