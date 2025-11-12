'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ShoppingBag, Star, Sparkles } from 'lucide-react'
import { Produto, VariacaoProduto } from '@/types/database'
import { useCart } from '@/contexts/CartContext'
import { supabase } from '@/lib/supabase'
import ProductVariantSelector from './ProductVariantSelector'

interface ProductModalProps {
  produto: Produto
  onClose: () => void
}

export default function ProductModal({ produto, onClose }: ProductModalProps) {
  const { addToCart } = useCart()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [variants, setVariants] = useState<VariacaoProduto[]>([])
  const [selectedVariant, setSelectedVariant] = useState<VariacaoProduto | null>(null)
  const [loadingVariants, setLoadingVariants] = useState(true)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % produto.fotos.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + produto.fotos.length) % produto.fotos.length)
  }

  // Carregar variações do produto
  useEffect(() => {
    const loadVariants = async () => {
      try {
        const { data, error } = await supabase
          .from('variacoes_produtos_natal')
          .select('*')
          .eq('produto_id', produto.id)
          .eq('is_active', true)
          .order('ordem_exibicao', { ascending: true })
          .order('created_at', { ascending: true })

        if (error) throw error
        
        if (data && data.length > 0) {
          setVariants(data)
          // Selecionar variação padrão ou primeira
          const defaultVariant = data.find(v => v.is_default) || data[0]
          setSelectedVariant(defaultVariant)
        } else {
          // Se não houver variações, criar uma variação virtual usando o preço do produto
          const virtualVariant: VariacaoProduto = {
            id: `virtual-${produto.id}`,
            produto_id: produto.id,
            nome_variacao: produto.tamanho || 'Padrão',
            descricao: produto.descricao_curta || '',
            preco: produto.preco,
            is_default: true,
            ordem_exibicao: 0,
            is_active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
          setVariants([virtualVariant])
          setSelectedVariant(virtualVariant)
        }
      } catch (error) {
        console.error('Erro ao carregar variações:', error)
        // Em caso de erro, criar variação virtual
        const virtualVariant: VariacaoProduto = {
          id: `virtual-${produto.id}`,
          produto_id: produto.id,
          nome_variacao: produto.tamanho || 'Padrão',
          descricao: produto.descricao_curta || '',
          preco: produto.preco,
          is_default: true,
          ordem_exibicao: 0,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        setVariants([virtualVariant])
        setSelectedVariant(virtualVariant)
      } finally {
        setLoadingVariants(false)
      }
    }

    loadVariants()
  }, [produto.id])

  const handleAddToCart = () => {
    // Criar produto com variação para o carrinho
    const produtoComVariacao = {
      ...produto,
      preco: selectedVariant?.preco || produto.preco,
      variacao_selecionada: selectedVariant || undefined
    }
    addToCart(produtoComVariacao)
    onClose()
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Overlay com Blur Sofisticado */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-brown-darkest/90 backdrop-blur-xl"
        />

        {/* Modal Content - Design Luxuoso */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          className="relative bg-white max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        >
          {/* Ribbon Dourado no Topo */}
          <div className="h-1 bg-gradient-to-r from-gold-warm via-gold to-gold-warm" />

          {/* Close Button Sofisticado */}
          <motion.button
            onClick={onClose}
            className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center bg-white border border-beige-medium text-brown-darkest hover:bg-beige-lightest transition-all shadow-lg"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={20} strokeWidth={1.5} />
          </motion.button>

          <div className="grid md:grid-cols-2 gap-0 overflow-y-auto max-h-[90vh]">
            {/* Galeria de Imagens - Lado Esquerdo */}
            <div className="relative bg-beige-lightest p-12">
              <div className="relative aspect-square overflow-hidden bg-[#E8DCC8]">
                <motion.img
                  key={currentImageIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  src={produto.fotos[currentImageIndex] || '/images/placeholder.jpg'}
                  alt={`${produto.nome} - Imagem ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Ornamento decorativo */}
                <div className="absolute top-4 left-4 opacity-30">
                  <Sparkles size={24} className="text-sage" />
                </div>

                {/* Navegação de Imagens */}
                {produto.fotos.length > 1 && (
                  <>
                    <motion.button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 text-brown-darkest p-3 hover:bg-white transition-all shadow-lg backdrop-blur-sm"
                      whileHover={{ scale: 1.1, x: -4 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronLeft size={20} strokeWidth={1.5} />
                    </motion.button>
                    <motion.button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 text-brown-darkest p-3 hover:bg-white transition-all shadow-lg backdrop-blur-sm"
                      whileHover={{ scale: 1.1, x: 4 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronRight size={20} strokeWidth={1.5} />
                    </motion.button>

                    {/* Indicadores Modernos */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                      {produto.fotos.map((_, index) => (
                        <motion.button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`h-1 rounded-full transition-all ${
                            index === currentImageIndex
                              ? 'bg-gold-warm w-8'
                              : 'bg-brown-darkest/30 w-1 hover:bg-brown-darkest/50'
                          }`}
                          whileHover={{ scale: 1.2 }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* Miniaturas Elegantes */}
              {produto.fotos.length > 1 && (
                <div className="flex gap-3 mt-6 overflow-x-auto pb-2">
                  {produto.fotos.map((foto, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 overflow-hidden border-2 transition-all ${
                        index === currentImageIndex
                          ? 'border-gold-warm shadow-lg'
                          : 'border-beige-medium hover:border-gold-warm/50'
                      }`}
                      whileHover={{ scale: 1.05, y: -4 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <img
                        src={foto}
                        alt={`Miniatura ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>

            {/* Informações do Produto - Lado Direito */}
            <div className="flex flex-col p-12 bg-white">
              {/* Badge de Destaque */}
              {produto.destaque && (
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center gap-2 bg-gold-warm text-white px-4 py-2 text-[10px] uppercase tracking-wider font-body mb-6 w-fit shadow-lg"
                >
                  <Star size={12} fill="currentColor" />
                  Produto em Destaque
                </motion.div>
              )}

              {/* Nome e Tamanho */}
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="font-display text-brown-darkest mb-3"
                style={{ fontSize: '36px', fontWeight: 400, letterSpacing: '-0.5px', lineHeight: 1.2 }}
              >
                {produto.nome}
              </motion.h2>
              {!loadingVariants && selectedVariant ? (
                <p className="font-body text-taupe text-sm uppercase tracking-wider mb-6">
                  {selectedVariant.nome_variacao}
                  {selectedVariant.descricao && ` - ${selectedVariant.descricao}`}
                </p>
              ) : (
                <p className="font-body text-taupe text-sm uppercase tracking-wider mb-6">{produto.tamanho}</p>
              )}

              {/* Linha decorativa */}
              <div className="h-[1px] w-16 bg-gold-warm mb-6" />

              {/* Descrição Curta */}
              <p className="font-body text-brown-medium text-base leading-relaxed mb-8">{produto.descricao_curta}</p>

              {/* Descrição Longa */}
              <div className="bg-beige-lightest p-6 mb-8">
                <h3 className="font-body text-brown-darkest text-xs uppercase tracking-[2px] mb-3 font-medium">Composição</h3>
                <p className="font-body text-brown-medium text-sm leading-relaxed">{produto.descricao_longa}</p>
              </div>

              {/* Características - Pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                {['Sem Glúten', 'Zero Lactose', 'Low Sugar'].map((badge, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 border border-sage text-forest text-[9px] uppercase tracking-wider font-body rounded-full"
                  >
                    {badge}
                  </span>
                ))}
              </div>

              {/* Seletor de Variações - Só mostra se houver mais de 1 variação real (não virtual) */}
              {!loadingVariants && variants.length > 1 && !variants.some(v => v.id?.startsWith('virtual-')) && (
                <div className="mb-6">
                  <ProductVariantSelector
                    variants={variants}
                    onSelect={setSelectedVariant}
                    selectedVariantId={selectedVariant?.id}
                    isMobile={false}
                  />
                </div>
              )}

              {/* Preço */}
              <div className="mb-8">
                <div className="font-body text-brown-light text-[10px] uppercase tracking-wider mb-2">Valor</div>
                <span className="font-display text-gold-dark font-medium" style={{ fontSize: '42px', letterSpacing: '-0.5px' }}>
                  {formatPrice(selectedVariant?.preco || produto.preco)}
                </span>
              </div>

              {/* Botão de Ação Sofisticado */}
              {produto.status === 'disponivel' ? (
                <motion.button
                  onClick={handleAddToCart}
                  className="w-full bg-gradient-to-r from-wine to-wine-dark text-white px-8 py-4 font-body text-sm uppercase tracking-[2px] flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ShoppingBag size={18} />
                  Adicionar ao Pedido
                </motion.button>
              ) : (
                <button
                  disabled
                  className="w-full bg-beige-medium text-taupe px-8 py-4 font-body text-sm uppercase tracking-[2px] cursor-not-allowed"
                >
                  Produto Esgotado
                </button>
              )}

              {/* Informações Adicionais */}
              {produto.quantidade_estoque !== undefined && produto.quantidade_estoque > 0 && produto.quantidade_estoque <= 5 && (
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-wine text-xs mt-4 text-center font-body uppercase tracking-wider"
                >
                  ⚠️ Apenas {produto.quantidade_estoque} unidades disponíveis!
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
