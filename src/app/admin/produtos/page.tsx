'use client'

import { useState, useEffect, useMemo } from 'react'
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
      // Buscar apenas campos necessários para a listagem (sem fotos completas)
      const { data, error } = await supabase
        .from('produtos_natal')
        .select('id, nome, slug, descricao_curta, preco, tamanho, status, destaque, created_at, fotos')
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

  // Usar useMemo para evitar recálculo desnecessário
  const filteredProdutos = useMemo(() => {
    if (!searchTerm.trim()) return produtos
    const term = searchTerm.toLowerCase()
    return produtos.filter(produto =>
      produto.nome.toLowerCase().includes(term)
    )
  }, [produtos, searchTerm])

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
            Produtos
          </h2>
          <p className="font-body text-brown-medium text-sm relative">
            Gerencie os produtos do cardápio de Natal
          </p>
        </div>
        <Link href="/admin/produtos/novo">
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-wine via-wine-dark to-wine text-white px-6 py-4 font-body text-sm uppercase tracking-wider flex items-center gap-3 shadow-xl rounded-xl hover:shadow-2xl transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Plus size={20} className="relative z-10" />
            <span className="relative z-10 font-semibold">Novo Produto</span>
          </motion.button>
        </Link>
      </motion.div>

      {/* Search Bar Moderna - Otimizada */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3 }}
        className="bg-white/90 rounded-xl p-6 shadow-lg border border-beige-medium/50"
      >
        <div className="relative group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-medium group-focus-within:text-gold-warm transition-colors">
            <Search size={20} />
          </div>
          <input
            type="text"
            placeholder="Buscar produtos por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border-2 border-beige-medium rounded-xl focus:border-gold-warm focus:ring-2 focus:ring-gold-warm/20 focus:outline-none font-body text-sm bg-beige-lightest/50 transition-all"
          />
        </div>
      </motion.div>

      {/* Products Grid Moderno */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProdutos.map((produto, index) => (
          <motion.div
            key={produto.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: Math.min(index * 0.03, 0.3), duration: 0.3 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-200 border border-beige-medium/50 relative"
          >
            {/* Ribbon dourado */}
            <div className="h-[3px] bg-gradient-to-r from-gold-warm via-gold to-gold-warm" />

            {/* Image com overlay e lazy loading */}
            <div className="relative aspect-square bg-beige-lightest overflow-hidden">
              <img
                src={produto.fotos[0] || '/images/placeholder.jpg'}
                alt={produto.nome}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* Overlay no hover - simplificado */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              
              {/* Badges */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {produto.destaque && (
                  <div className="bg-gradient-to-r from-gold-warm to-gold text-white px-3 py-1.5 text-[10px] uppercase tracking-wider font-body flex items-center gap-1.5 shadow-xl rounded-lg backdrop-blur-sm">
                    <Star size={12} fill="currentColor" />
                    Destaque
                  </div>
                )}
                {produto.status === 'esgotado' && (
                  <div className="bg-red-600/90 backdrop-blur-sm text-white px-3 py-1.5 text-[10px] uppercase tracking-wider font-body shadow-xl rounded-lg">
                    Esgotado
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="font-display text-xl text-brown-darkest flex-1 leading-tight">
                  {produto.nome}
                </h3>
                {produto.destaque && (
                  <div className="flex-shrink-0 p-1.5 bg-gold-warm/10 rounded-lg">
                    <Star size={18} className="text-gold-warm fill-gold-warm" />
                  </div>
                )}
              </div>
              <p className="font-body text-taupe text-xs uppercase tracking-wider mb-3 font-semibold">
                {produto.tamanho}
              </p>
              <p className="font-body text-brown-medium text-sm line-clamp-2 mb-5 leading-relaxed">
                {produto.descricao_curta}
              </p>
              
              <div className="flex items-center justify-between pt-5 border-t border-beige-medium">
                <div>
                  <span className="font-body text-xs uppercase tracking-wider text-brown-medium block mb-1">
                    Preço
                  </span>
                  <span className="font-display text-3xl text-gold-dark font-semibold">
                    {formatPrice(produto.preco)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/produtos/${produto.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-3 text-brown-medium hover:text-wine hover:bg-wine/10 rounded-lg transition-all"
                      title="Editar"
                    >
                      <Edit size={18} />
                    </motion.button>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.15, rotate: -5 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(produto.id)}
                    className="p-3 text-brown-medium hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    title="Excluir"
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-16 text-center shadow-lg border border-beige-medium/50"
        >
          <div className="w-20 h-20 bg-beige-lightest rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={40} className="text-brown-medium" />
          </div>
          <p className="font-body text-lg text-brown-darkest mb-2">
            Nenhum produto encontrado
          </p>
          <p className="font-body text-sm text-brown-medium">
            {searchTerm ? 'Tente buscar com outros termos' : 'Comece adicionando um novo produto'}
          </p>
        </motion.div>
      )}
    </div>
  )
}
