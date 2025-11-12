'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Star } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'
import ProductVariantManager from '@/components/admin/ProductVariantManager'

export default function EditProdutoPage() {
  const router = useRouter()
  const params = useParams()
  const produtoId = typeof params.id === 'string' ? params.id : ''
  const isNew = produtoId === 'novo'

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    nome: '',
    slug: '',
    descricao_curta: '',
    descricao_longa: '',
    preco: 0,
    tamanho: '',
    fotos: [] as string[],
    destaque: false,
    status: 'disponivel' as 'disponivel' | 'esgotado',
    quantidade_estoque: 0,
  })

  useEffect(() => {
    const fetchProduto = async () => {
      if (!produtoId || isNew) {
        setLoading(false)
        return
      }
    try {
      const { data, error } = await supabase
        .from('produtos_natal')
        .select('*')
          .eq('id', produtoId)
        .single()

      if (error) throw error
      if (data) {
        // Buscar variação padrão para sincronizar preço
        const { data: defaultVariant } = await supabase
          .from('variacoes_produtos_natal')
          .select('preco')
          .eq('produto_id', produtoId)
          .eq('is_default', true)
          .eq('is_active', true)
          .single()

        // Usar preço da variação padrão se existir, senão usar preço do produto
        const preco = defaultVariant?.preco || data.preco || 0

        setFormData({
          nome: data.nome || '',
          slug: data.slug || '',
          descricao_curta: data.descricao_curta || '',
          descricao_longa: data.descricao_longa || '',
          preco: preco,
          tamanho: data.tamanho || '',
          fotos: data.fotos || [],
          destaque: data.destaque || false,
          status: data.status || 'disponivel',
          quantidade_estoque: data.quantidade_estoque || 0,
        })
      }
    } catch (error) {
      console.error('Erro ao buscar produto:', error)
      alert('Erro ao carregar produto')
    } finally {
      setLoading(false)
    }
  }

    fetchProduto()
  }, [produtoId, isNew])

  // Função para gerar slug a partir do nome
  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove acentos
      .replace(/[^a-z0-9]+/g, '-') // Substitui caracteres especiais por hífen
      .replace(/^-+|-+$/g, '') // Remove hífens do início e fim
  }

  // Função para garantir que o slug seja único
  const ensureUniqueSlug = async (slug: string, excludeId?: string): Promise<string> => {
    let uniqueSlug = slug
    let counter = 1

    while (true) {
      const { data, error } = await supabase
        .from('produtos_natal')
        .select('id')
        .eq('slug', uniqueSlug)
        .limit(1)

      if (error) {
        console.error('Erro ao verificar slug:', error)
        break
      }

      // Se não encontrou nenhum produto com esse slug, ou se é o próprio produto
      if (!data || data.length === 0 || (excludeId && data[0]?.id === excludeId)) {
        break
      }

      // Se encontrou um produto com esse slug, adiciona um número
      uniqueSlug = `${slug}-${counter}`
      counter++
    }

    return uniqueSlug
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Garantir que o slug seja único antes de salvar
      const uniqueSlug = await ensureUniqueSlug(
        formData.slug || generateSlug(formData.nome),
        isNew ? undefined : produtoId
      )

      const dataToSave = {
        ...formData,
        slug: uniqueSlug,
        // Se for novo produto, adicionar ordem como último
        ...(isNew && { ordem: 9999 }) // Será reordenado depois se necessário
      }

      if (isNew) {
        const { error } = await supabase
          .from('produtos_natal')
          .insert([dataToSave])
          .select('*')

        if (error) throw error
        alert('Produto criado com sucesso!')
      } else {
        const { error } = await supabase
          .from('produtos_natal')
          .update(dataToSave)
          .eq('id', produtoId)
          .select('*')

        if (error) throw error
        
        // Sincronizar preço com a variação padrão (se existir)
        const { data: defaultVariant, error: variantError } = await supabase
          .from('variacoes_produtos_natal')
          .select('*')
          .eq('produto_id', produtoId)
          .eq('is_default', true)
          .eq('is_active', true)
          .single()

        if (!variantError && defaultVariant) {
          // Se a variação padrão existe e tem preço diferente, atualizar
          if (Math.abs(defaultVariant.preco - formData.preco) > 0.01) {
            await supabase
              .from('variacoes_produtos_natal')
              .update({ preco: formData.preco })
              .eq('id', defaultVariant.id)
          }
        }
        
        alert('Produto atualizado com sucesso!')
      }

      router.push('/admin/produtos')
    } catch (error: any) {
      console.error('Erro ao salvar produto:', error)
      
      // Mensagem de erro mais amigável
      let errorMessage = 'Erro ao salvar produto'
      if (error?.message?.includes('duplicate key')) {
        errorMessage = 'Já existe um produto com este slug. O sistema tentará gerar um slug único automaticamente.'
      } else if (error?.message) {
        errorMessage = `Erro: ${error.message}`
      }
      
      alert(errorMessage)
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value }
      
      // Se o campo alterado for "nome" e o slug estiver vazio ou igual ao slug gerado do nome anterior
      if (field === 'nome' && value) {
        const currentSlug = prev.slug || ''
        const generatedSlug = generateSlug(value)
        
        // Só atualiza o slug se ele estiver vazio ou se for igual ao slug gerado do nome anterior
        // Isso permite que o usuário edite o slug manualmente sem ser sobrescrito
        if (!currentSlug || currentSlug === generateSlug(prev.nome || '')) {
          newData.slug = generatedSlug
        }
      }
      
      return newData
    })
  }

  const handleImagesChange = (newImages: string[]) => {
    setFormData(prev => ({ ...prev, fotos: newImages }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wine"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      {/* Header Moderno */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 relative"
      >
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-gold-warm/5 rounded-full blur-2xl" />
        <Link href="/admin/produtos">
          <motion.button
            whileHover={{ x: -4 }}
            className="flex items-center gap-2 text-brown-medium hover:text-brown-darkest mb-6 font-body text-sm uppercase tracking-wider relative group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Voltar para Produtos
          </motion.button>
        </Link>
        <h2 className="font-display text-4xl text-brown-darkest font-light mb-3 tracking-tight relative">
          {isNew ? 'Novo Produto' : 'Editar Produto'}
        </h2>
        <p className="font-body text-brown-medium text-sm relative">
          Preencha os dados do produto
        </p>
      </motion.div>

      {/* Form Moderno */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Principal Moderno */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-beige-medium/50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-warm/5 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="h-[3px] bg-gradient-to-r from-gold-warm via-gold to-gold-warm mb-8 relative z-10" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {/* Nome */}
            <div className="md:col-span-2">
              <label className="block font-body text-xs uppercase tracking-wider text-brown-darkest mb-3 font-semibold">
                Nome do Produto *
              </label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                className="w-full px-4 py-4 border-2 border-beige-medium rounded-xl focus:border-gold-warm focus:ring-2 focus:ring-gold-warm/20 focus:outline-none font-body text-sm bg-beige-lightest/50 transition-all"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block font-body text-xs uppercase tracking-wider text-brown-darkest mb-3 font-semibold">
                Slug (URL) *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="w-full px-4 py-4 border-2 border-beige-medium rounded-xl focus:border-gold-warm focus:ring-2 focus:ring-gold-warm/20 focus:outline-none font-body text-sm bg-beige-lightest/50 transition-all"
              />
            </div>

            {/* Tamanho */}
            <div>
              <label className="block font-body text-xs uppercase tracking-wider text-brown-darkest mb-3 font-semibold">
                Tamanho *
              </label>
              <input
                type="text"
                required
                value={formData.tamanho}
                onChange={(e) => handleChange('tamanho', e.target.value)}
                placeholder="Ex: 22 cm"
                className="w-full px-4 py-4 border-2 border-beige-medium rounded-xl focus:border-gold-warm focus:ring-2 focus:ring-gold-warm/20 focus:outline-none font-body text-sm bg-beige-lightest/50 transition-all"
              />
            </div>

            {/* Preço */}
            <div>
              <label className="block font-body text-xs uppercase tracking-wider text-brown-darkest mb-3 font-semibold">
                Preço (R$) *
              </label>
              <input
                type="number"
                required
                step="0.01"
                min="0.01"
                value={formData.preco}
                onChange={(e) => handleChange('preco', parseFloat(e.target.value) || 0)}
                placeholder="396.98"
                className="w-full px-4 py-4 border-2 border-beige-medium rounded-xl focus:border-gold-warm focus:ring-2 focus:ring-gold-warm/20 focus:outline-none font-body text-sm bg-beige-lightest/50 transition-all"
              />
              {formData.preco > 0 && (
                <p className="mt-2 text-xs text-brown-medium font-body">
                  Valor formatado: {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(formData.preco)}
                </p>
              )}
            </div>

            {/* Estoque */}
            <div>
              <label className="block font-body text-xs uppercase tracking-wider text-brown-darkest mb-3 font-semibold">
                Quantidade em Estoque
              </label>
              <input
                type="number"
                value={formData.quantidade_estoque}
                onChange={(e) => handleChange('quantidade_estoque', parseInt(e.target.value))}
                className="w-full px-4 py-4 border-2 border-beige-medium rounded-xl focus:border-gold-warm focus:ring-2 focus:ring-gold-warm/20 focus:outline-none font-body text-sm bg-beige-lightest/50 transition-all"
              />
            </div>

            {/* Descrição Curta */}
            <div className="md:col-span-2">
              <label className="block font-body text-xs uppercase tracking-wider text-brown-darkest mb-3 font-semibold">
                Descrição Curta *
              </label>
              <textarea
                required
                rows={3}
                value={formData.descricao_curta}
                onChange={(e) => handleChange('descricao_curta', e.target.value)}
                className="w-full px-4 py-4 border-2 border-beige-medium rounded-xl focus:border-gold-warm focus:ring-2 focus:ring-gold-warm/20 focus:outline-none font-body text-sm resize-none bg-beige-lightest/50 transition-all"
              />
            </div>

            {/* Descrição Longa */}
            <div className="md:col-span-2">
              <label className="block font-body text-xs uppercase tracking-wider text-brown-darkest mb-3 font-semibold">
                Composição (Descrição Longa) *
              </label>
              <textarea
                required
                rows={5}
                value={formData.descricao_longa}
                onChange={(e) => handleChange('descricao_longa', e.target.value)}
                className="w-full px-4 py-4 border-2 border-beige-medium rounded-xl focus:border-gold-warm focus:ring-2 focus:ring-gold-warm/20 focus:outline-none font-body text-sm resize-none bg-beige-lightest/50 transition-all"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block font-body text-xs uppercase tracking-wider text-brown-darkest mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-4 py-3 border border-beige-medium focus:border-gold-warm focus:outline-none font-body text-sm"
              >
                <option value="disponivel">Disponível</option>
                <option value="esgotado">Esgotado</option>
              </select>
            </div>

            {/* Destaque */}
            <div className="flex items-center gap-3 p-4 bg-beige-lightest border-l-4 border-gold-warm">
              <input
                type="checkbox"
                id="destaque"
                checked={formData.destaque}
                onChange={(e) => handleChange('destaque', e.target.checked)}
                className="w-5 h-5 border-2 border-gold-warm rounded accent-gold-warm cursor-pointer"
              />
              <label htmlFor="destaque" className="font-body text-sm text-brown-darkest cursor-pointer flex items-center gap-2">
                <Star size={16} className={formData.destaque ? 'text-gold-warm fill-gold-warm' : 'text-brown-medium'} />
                Produto em Destaque
                {formData.destaque && (
                  <span className="text-[9px] uppercase tracking-wider text-gold-dark bg-gold-warm/20 px-2 py-0.5 rounded-full">
                    Ativo
                  </span>
                )}
              </label>
            </div>
          </div>
        </motion.div>

        {/* Fotos Moderno */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-beige-medium/50"
        >
          <div className="h-[3px] bg-gradient-to-r from-gold-warm via-gold to-gold-warm mb-6" />
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl text-brown-darkest font-light">
              Fotos do Produto
            </h3>
            <span className="font-body text-xs text-brown-medium bg-gold-warm/10 text-gold-dark px-4 py-2 rounded-lg font-semibold">
              {formData.fotos.length} foto{formData.fotos.length !== 1 ? 's' : ''} adicionada{formData.fotos.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <ImageUpload
            images={formData.fotos}
            onImagesChange={handleImagesChange}
            maxImages={4}
          />
        </motion.div>

        {/* Variações do Produto - Apenas para produtos existentes */}
        {!isNew && produtoId && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6"
          >
            <ProductVariantManager produtoId={produtoId} />
          </motion.div>
        )}

        {/* Actions Modernas */}
        <div className="flex items-center gap-4">
          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-wine via-wine-dark to-wine text-white px-8 py-5 font-body text-sm uppercase tracking-wider flex items-center gap-3 shadow-xl rounded-xl hover:shadow-2xl transition-all disabled:opacity-50 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Save size={20} className="relative z-10" />
            <span className="relative z-10 font-semibold">{saving ? 'Salvando...' : 'Salvar Produto'}</span>
          </motion.button>

          <Link href="/admin/produtos">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-5 border-2 border-beige-medium text-brown-darkest font-body text-sm uppercase tracking-wider hover:border-gold-warm hover:bg-gold-warm/5 transition-all rounded-xl shadow-sm hover:shadow-md font-semibold"
            >
              Cancelar
            </motion.button>
          </Link>
        </div>
      </form>
    </div>
  )
}
