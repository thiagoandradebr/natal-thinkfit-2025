'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Check, X, GripVertical } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { VariacaoProduto } from '@/types/database'

interface ProductVariantManagerProps {
  produtoId: string
}

export default function ProductVariantManager({ produtoId }: ProductVariantManagerProps) {
  const [variants, setVariants] = useState<VariacaoProduto[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    nome_variacao: '',
    descricao: '',
    preco: '',
    is_default: false,
    ordem_exibicao: 0
  })

  useEffect(() => {
    if (produtoId) {
      loadVariants()
    }
  }, [produtoId])

  const loadVariants = async () => {
    try {
      const { data, error } = await supabase
        .from('variacoes_produtos_natal')
        .select('*')
        .eq('produto_id', produtoId)
        .eq('is_active', true)
        .order('ordem_exibicao', { ascending: true })
        .order('created_at', { ascending: true })

      if (error) throw error
      setVariants(data || [])
    } catch (error) {
      console.error('Erro ao carregar variações:', error)
      alert('Erro ao carregar variações')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }

    try {
      // Validações
      if (!formData.nome_variacao.trim()) {
        alert('Nome da variação é obrigatório')
        return
      }

      const preco = parseFloat(formData.preco)
      if (!preco || preco <= 0) {
        alert('Preço deve ser maior que zero')
        return
      }

      // Se está setando como default, remover default das outras
      if (formData.is_default) {
        const { error: unsetError } = await supabase
          .from('variacoes_produtos_natal')
          .update({ is_default: false })
          .eq('produto_id', produtoId)
          .neq('id', editingId || '')

        if (unsetError) throw unsetError
      }

      if (editingId) {
        // Atualizar
        const { data, error } = await supabase
          .from('variacoes_produtos_natal')
          .update({
            nome_variacao: formData.nome_variacao.trim(),
            descricao: formData.descricao.trim() || null,
            preco: preco,
            is_default: formData.is_default,
            ordem_exibicao: formData.ordem_exibicao,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId)
          .select()
          .single()

        if (error) {
          console.error('Erro detalhado ao atualizar variação:', error)
          throw error
        }
        
        alert('Variação atualizada com sucesso!')
      } else {
        // Criar
        // Buscar última ordem
        const maxOrdem = variants.length > 0 
          ? Math.max(...variants.map(v => v.ordem_exibicao)) 
          : -1

        const { data, error } = await supabase
          .from('variacoes_produtos_natal')
          .insert({
            produto_id: produtoId,
            nome_variacao: formData.nome_variacao.trim(),
            descricao: formData.descricao.trim() || null,
            preco: preco,
            is_default: formData.is_default,
            ordem_exibicao: maxOrdem + 1,
            is_active: true
          })
          .select()
          .single()

        if (error) {
          console.error('Erro detalhado ao criar variação:', error)
          throw error
        }
        
        alert('Variação criada com sucesso!')
      }

      await loadVariants()
      resetForm()
    } catch (error: any) {
      console.error('Erro ao salvar variação:', error)
      console.error('Detalhes do erro:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      
      let errorMessage = 'Erro ao salvar variação'
      if (error.message) {
        errorMessage += `: ${error.message}`
      }
      if (error.code) {
        errorMessage += ` (Código: ${error.code})`
      }
      if (error.hint) {
        errorMessage += `\nDica: ${error.hint}`
      }
      
      alert(errorMessage)
    }
  }

  const handleEdit = (variant: VariacaoProduto) => {
    setEditingId(variant.id)
    setFormData({
      nome_variacao: variant.nome_variacao,
      descricao: variant.descricao || '',
      preco: variant.preco.toString(),
      is_default: variant.is_default,
      ordem_exibicao: variant.ordem_exibicao
    })
    setIsAdding(true)
  }

  const handleDelete = async (variantId: string) => {
    if (!confirm('Tem certeza que deseja deletar esta variação?')) return

    // Verificar se é a única variação
    if (variants.length <= 1) {
      alert('Não é possível deletar a única variação do produto')
      return
    }

    try {
      const variant = variants.find(v => v.id === variantId)
      if (!variant) return

      // Se for default, setar outra como default
      if (variant.is_default) {
        const otherVariant = variants.find(v => v.id !== variantId)
        if (otherVariant) {
          await supabase
            .from('variacoes_produtos_natal')
            .update({ is_default: true })
            .eq('id', otherVariant.id)
        }
      }

      // Soft delete
      const { error } = await supabase
        .from('variacoes_produtos_natal')
        .update({ is_active: false })
        .eq('id', variantId)

      if (error) throw error
      alert('Variação deletada com sucesso!')
      await loadVariants()
    } catch (error: any) {
      console.error('Erro ao deletar variação:', error)
      alert(`Erro ao deletar variação: ${error.message || 'Erro desconhecido'}`)
    }
  }

  const resetForm = () => {
    setFormData({
      nome_variacao: '',
      descricao: '',
      preco: '',
      is_default: false,
      ordem_exibicao: 0
    })
    setIsAdding(false)
    setEditingId(null)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-wine"></div>
      </div>
    )
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-beige-medium/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xl text-brown-darkest font-light">
          Variações do Produto
        </h3>
        {!isAdding && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-wine text-white rounded-lg hover:bg-wine-dark transition-colors font-body text-sm uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" />
            Adicionar Variação
          </motion.button>
        )}
      </div>

      {/* Formulário de Adicionar/Editar */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-6 bg-beige-lightest/50 rounded-xl border border-beige-medium"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-xs uppercase tracking-wider text-brown-darkest mb-2 font-semibold">
                Nome da Variação *
              </label>
              <input
                type="text"
                value={formData.nome_variacao}
                onChange={(e) => setFormData({ ...formData, nome_variacao: e.target.value })}
                placeholder="Ex: Tipo 1, Tamanho P, 15cm"
                className="w-full px-4 py-3 border-2 border-beige-medium rounded-xl focus:border-gold-warm focus:ring-2 focus:ring-gold-warm/20 focus:outline-none font-body text-sm bg-white transition-all"
                required
              />
            </div>

            <div>
              <label className="block font-body text-xs uppercase tracking-wider text-brown-darkest mb-2 font-semibold">
                Preço (R$) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formData.preco}
                onChange={(e) => setFormData({ ...formData, preco: e.target.value })}
                placeholder="320.00"
                className="w-full px-4 py-3 border-2 border-beige-medium rounded-xl focus:border-gold-warm focus:ring-2 focus:ring-gold-warm/20 focus:outline-none font-body text-sm bg-white transition-all"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-body text-xs uppercase tracking-wider text-brown-darkest mb-2 font-semibold">
                Descrição
              </label>
              <input
                type="text"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                placeholder="Ex: 20cm - Serve 15 pessoas"
                className="w-full px-4 py-3 border-2 border-beige-medium rounded-xl focus:border-gold-warm focus:ring-2 focus:ring-gold-warm/20 focus:outline-none font-body text-sm bg-white transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_default}
                  onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                  className="w-5 h-5 border-2 border-gold-warm rounded accent-gold-warm cursor-pointer"
                />
                <span className="font-body text-sm text-brown-darkest">Definir como variação padrão</span>
              </label>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <motion.button
              type="button"
              onClick={handleSubmit}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3 bg-wine text-white rounded-lg hover:bg-wine-dark transition-colors font-body text-sm uppercase tracking-wider"
            >
              <Check className="w-4 h-4" />
              {editingId ? 'Atualizar' : 'Adicionar'}
            </motion.button>
            <motion.button
              type="button"
              onClick={resetForm}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-3 bg-beige-medium text-brown-darkest rounded-lg hover:bg-beige-dark transition-colors font-body text-sm uppercase tracking-wider"
            >
              <X className="w-4 h-4" />
              Cancelar
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Lista de Variações */}
      <div className="space-y-3">
        {variants.length === 0 ? (
          <p className="text-center text-brown-medium py-8 font-body">
            Nenhuma variação cadastrada. Adicione a primeira variação acima.
          </p>
        ) : (
          variants.map((variant) => (
            <motion.div
              key={variant.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between p-4 bg-beige-lightest/50 rounded-lg border border-beige-medium hover:border-gold-warm/50 transition-colors"
            >
              <div className="flex items-center gap-4 flex-1">
                <GripVertical className="w-5 h-5 text-brown-medium" />

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-body font-semibold text-brown-darkest">{variant.nome_variacao}</h4>
                    {variant.is_default && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-gold-warm text-white rounded uppercase tracking-wider">
                        Padrão
                      </span>
                    )}
                  </div>
                  {variant.descricao && (
                    <p className="text-sm text-brown-medium mt-1">{variant.descricao}</p>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-gold-dark">
                    {formatPrice(variant.preco)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 ml-4">
                <motion.button
                  onClick={() => handleEdit(variant)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-brown-medium hover:text-gold-warm hover:bg-gold-warm/10 rounded-lg transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(variant.id)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 text-brown-medium hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  disabled={variants.length === 1}
                  title={variants.length === 1 ? 'Não é possível deletar a única variação' : 'Deletar variação'}
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

