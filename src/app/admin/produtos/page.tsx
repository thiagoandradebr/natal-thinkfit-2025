'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Search, Star } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Produto } from '@/types/database'
import Link from 'next/link'

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchProdutos()
  }, [])

  const fetchProdutos = async () => {
    try {
      const { data, error } = await supabase
        .from('produtos_natal')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProdutos(data || [])
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) return

    try {
      const { error } = await supabase
        .from('produtos_natal')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setProdutos(produtos.filter(p => p.id !== id))
      alert('Produto excluído com sucesso!')
    } catch (error) {
      console.error('Erro ao excluir produto:', error)
      alert('Erro ao excluir produto')
    }
  }

  const filteredProdutos = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
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
            Produtos
          </h2>
          <p className="font-body text-brown-medium text-sm">
            Gerencie os produtos do cardápio de Natal
          </p>
        </div>
        <Link href="/admin/produtos/novo">
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-wine to-wine-dark text-white px-6 py-3 font-body text-xs uppercase tracking-[2px] flex items-center gap-2 shadow-lg"
          >
            <Plus size={18} />
            Novo Produto
          </motion.button>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-medium" size={20} />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-beige-medium focus:border-gold-warm focus:outline-none font-body text-sm"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProdutos.map((produto, index) => (
          <motion.div
            key={produto.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-300"
          >
            {/* Ribbon */}
            <div className="h-1 bg-gradient-to-r from-gold-warm via-gold to-gold-warm" />

            {/* Image */}
            <div className="relative aspect-square bg-beige-lightest overflow-hidden">
              <img
                src={produto.fotos[0] || '/images/placeholder.jpg'}
                alt={produto.nome}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {produto.destaque && (
                <div className="absolute top-3 right-3 bg-gold-warm text-white px-3 py-1 text-[9px] uppercase tracking-wider font-body flex items-center gap-1 shadow-lg">
                  <Star size={10} fill="currentColor" />
                  Destaque
                </div>
              )}
              {produto.status === 'esgotado' && (
                <div className="absolute inset-0 bg-brown-darkest/80 flex items-center justify-center">
                  <span className="text-white font-body text-xs uppercase tracking-wider">
                    Esgotado
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-display text-xl text-brown-darkest flex-1">
                  {produto.nome}
                </h3>
                {produto.destaque && (
                  <div className="flex-shrink-0">
                    <Star size={20} className="text-gold-warm fill-gold-warm" />
                  </div>
                )}
              </div>
              <p className="font-body text-taupe text-xs uppercase tracking-wider mb-3">
                {produto.tamanho}
              </p>
              <p className="font-body text-brown-medium text-sm line-clamp-2 mb-4">
                {produto.descricao_curta}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-beige-medium">
                <span className="font-display text-2xl text-gold-dark font-medium">
                  {formatPrice(produto.preco)}
                </span>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/produtos/${produto.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-brown-medium hover:text-wine hover:bg-beige-lightest transition-all"
                    >
                      <Edit size={18} />
                    </motion.button>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(produto.id)}
                    className="p-2 text-brown-medium hover:text-wine hover:bg-beige-lightest transition-all"
                  >
                    <Trash2 size={18} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProdutos.length === 0 && (
        <div className="bg-white p-12 text-center">
          <p className="font-body text-brown-medium">
            Nenhum produto encontrado
          </p>
        </div>
      )}
    </div>
  )
}
