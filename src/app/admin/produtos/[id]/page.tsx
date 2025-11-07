'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Save, Star } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import ImageUpload from '@/components/ImageUpload'

export default function EditProdutoPage() {
  const router = useRouter()
  const params = useParams()
  const isNew = params.id === 'novo'

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
    if (!isNew) {
      fetchProduto()
    }
  }, [params.id])

  const fetchProduto = async () => {
    try {
      const { data, error } = await supabase
        .from('produtos_natal')
        .select('*')
        .eq('id', params.id)
        .single()

      if (error) throw error
      if (data) {
        setFormData({
          nome: data.nome || '',
          slug: data.slug || '',
          descricao_curta: data.descricao_curta || '',
          descricao_longa: data.descricao_longa || '',
          preco: data.preco || 0,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      if (isNew) {
        const { error } = await supabase
          .from('produtos_natal')
          .insert([formData])
          .select('*')

        if (error) throw error
        alert('Produto criado com sucesso!')
      } else {
        const { error } = await supabase
          .from('produtos_natal')
          .update(formData)
          .eq('id', params.id)
          .select('*')

        if (error) throw error
        alert('Produto atualizado com sucesso!')
      }

      router.push('/admin/produtos')
    } catch (error: any) {
      console.error('Erro ao salvar produto:', error)
      alert('Erro ao salvar produto: ' + (error?.message || 'Erro desconhecido'))
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
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
      {/* Header */}
      <div className="mb-8">
        <Link href="/admin/produtos">
          <button className="flex items-center gap-2 text-brown-medium hover:text-brown-darkest mb-4 font-body text-sm uppercase tracking-wider">
            <ArrowLeft size={18} />
            Voltar
          </button>
        </Link>
        <h2 className="font-display text-3xl text-brown-darkest font-light mb-2">
          {isNew ? 'Novo Produto' : 'Editar Produto'}
        </h2>
        <p className="font-body text-brown-medium text-sm">
          Preencha os dados do produto
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card Principal */}
        <div className="bg-white p-8 shadow-sm">
          <div className="h-1 bg-gradient-to-r from-gold-warm via-gold to-gold-warm mb-8" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nome */}
            <div className="md:col-span-2">
              <label className="block font-body text-xs uppercase tracking-wider text-brown-darkest mb-2">
                Nome do Produto *
              </label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                className="w-full px-4 py-3 border border-beige-medium focus:border-gold-warm focus:outline-none font-body text-sm"
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block font-body text-xs uppercase tracking-wider text-brown-darkest mb-2">
                Slug (URL) *
              </label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className="w-full px-4 py-3 border border-beige-medium focus:border-gold-warm focus:outline-none font-body text-sm"
              />
            </div>

            {/* Tamanho */}
            <div>
              <label className="block font-body text-xs uppercase tracking-wider text-brown-darkest mb-2">
                Tamanho *
              </label>
              <input
                type="text"
                required
                value={formData.tamanho}
                onChange={(e) => handleChange('tamanho', e.target.value)}
                placeholder="Ex: 22 cm"
                className="w-full px-4 py-3 border border-beige-medium focus:border-gold-warm focus:outline-none font-body text-sm"
              />
            </div>

            {/* Preço */}
            <div>
              <label className="block font-body text-xs uppercase tracking-wider text-brown-darkest mb-2">
                Preço (R$) *
              </label>
              <input
                type="number"
                required
                step="0.01"
                value={formData.preco}
                onChange={(e) => handleChange('preco', parseFloat(e.target.value))}
                className="w-full px-4 py-3 border border-beige-medium focus:border-gold-warm focus:outline-none font-body text-sm"
              />
            </div>

            {/* Estoque */}
            <div>
              <label className="block font-body text-xs uppercase tracking-wider text-brown-darkest mb-2">
                Quantidade em Estoque
              </label>
              <input
                type="number"
                value={formData.quantidade_estoque}
                onChange={(e) => handleChange('quantidade_estoque', parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-beige-medium focus:border-gold-warm focus:outline-none font-body text-sm"
              />
            </div>

            {/* Descrição Curta */}
            <div className="md:col-span-2">
              <label className="block font-body text-xs uppercase tracking-wider text-brown-darkest mb-2">
                Descrição Curta *
              </label>
              <textarea
                required
                rows={3}
                value={formData.descricao_curta}
                onChange={(e) => handleChange('descricao_curta', e.target.value)}
                className="w-full px-4 py-3 border border-beige-medium focus:border-gold-warm focus:outline-none font-body text-sm resize-none"
              />
            </div>

            {/* Descrição Longa */}
            <div className="md:col-span-2">
              <label className="block font-body text-xs uppercase tracking-wider text-brown-darkest mb-2">
                Composição (Descrição Longa) *
              </label>
              <textarea
                required
                rows={5}
                value={formData.descricao_longa}
                onChange={(e) => handleChange('descricao_longa', e.target.value)}
                className="w-full px-4 py-3 border border-beige-medium focus:border-gold-warm focus:outline-none font-body text-sm resize-none"
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
        </div>

        {/* Fotos */}
        <div className="bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-body text-xs uppercase tracking-wider text-brown-darkest">
              Fotos do Produto
            </h3>
            <span className="font-body text-xs text-brown-medium bg-beige-lightest px-3 py-1">
              {formData.fotos.length} foto{formData.fotos.length !== 1 ? 's' : ''} adicionada{formData.fotos.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <ImageUpload
            images={formData.fotos}
            onImagesChange={handleImagesChange}
            maxImages={4}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-wine to-wine-dark text-white px-8 py-4 font-body text-sm uppercase tracking-[2px] flex items-center gap-3 shadow-lg disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Salvando...' : 'Salvar Produto'}
          </motion.button>

          <Link href="/admin/produtos">
            <button
              type="button"
              className="px-8 py-4 border-2 border-beige-medium text-brown-medium font-body text-sm uppercase tracking-[2px] hover:border-brown-medium hover:text-brown-darkest transition-all"
            >
              Cancelar
            </button>
          </Link>
        </div>
      </form>
    </div>
  )
}
