'use client'

import { useState, useEffect, useRef } from 'react'
import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Star, Sparkles, Eye, Check, MilkOff, Droplet } from 'lucide-react'
import { Produto, VariacaoProduto } from '@/types/database'
import { useCart } from '@/contexts/CartContext'
import ProductModal from './ProductModal'
import ProductVariantSelector from './ProductVariantSelector'
import { getDefaultVariant } from '@/lib/variants'
import { useIsMobile } from '@/hooks/useIsMobile'

interface ProductCardProps {
  produto: Produto
  index?: number
  variants?: VariacaoProduto[] // Variações pré-carregadas
}

export default function ProductCard({ produto, index = 0, variants: propsVariants = [] }: ProductCardProps) {
  const { addToCart } = useCart()
  const [showModal, setShowModal] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const isMobile = useIsMobile() // Hook compartilhado
  const cardRef = useRef<HTMLDivElement>(null)

  // Usar variações recebidas via props (já carregadas em lote)
  const variants = propsVariants

  // Selecionar variação padrão - usando useMemo para evitar recálculo
  const defaultVariant = React.useMemo(() => {
    if (variants.length > 0) {
      return getDefaultVariant(variants)
    }
    return null
  }, [variants])

  // Estado para variação selecionada (pode ser alterada pelo usuário)
  const [selectedVariant, setSelectedVariant] = useState<VariacaoProduto | null>(defaultVariant)

  // Atualizar selectedVariant quando defaultVariant mudar
  useEffect(() => {
    if (defaultVariant) {
      setSelectedVariant(defaultVariant)
    }
  }, [defaultVariant?.id]) // Apenas quando o ID mudar

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  // Verificar prefers-reduced-motion - memoizado
  const prefersReducedMotion = React.useMemo(() => {
    return typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false
  }, [])

  // Intersection Observer para efeito de entrada - Otimizado
  useEffect(() => {
    if (prefersReducedMotion) {
      setIsInView(true)
      return
    }

    if (!cardRef.current) return

    // Usar threshold menor e rootMargin para melhor performance
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            // Unobserve imediatamente após detectar para melhor performance
            observer.unobserve(entry.target)
          }
        })
      },
      { 
        threshold: 0.05, // Reduzido de 0.1 para 0.05
        rootMargin: isMobile ? '50px' : '100px' // Pre-carregar antes de aparecer
      }
    )

    observer.observe(cardRef.current)

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current)
      }
    }
  }, [prefersReducedMotion, isMobile])

  // Delay escalonado para entrada - Reduzido em mobile para melhor performance
  const entryDelay = isMobile ? index * 0.05 : index * 0.1

  return (
    <>
      <motion.div
        ref={cardRef}
        data-card-id={produto.id}
        initial={{ opacity: 0, y: isMobile ? 20 : 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: isMobile ? 20 : 30 }}
        transition={{ 
          duration: isMobile ? 0.4 : 0.5, // Reduzir duração em mobile
          delay: entryDelay,
          ease: 'easeOut',
          type: 'tween' // Usar tween para melhor performance
        }}
        onHoverStart={() => !isMobile && setIsHovered(true)}
        onHoverEnd={() => !isMobile && setIsHovered(false)}
        className="bg-white overflow-hidden group relative"
        style={{ 
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: isHovered && !isMobile
            ? '0 24px 48px rgba(0,0,0,0.2)' 
            : '0 4px 12px rgba(0,0,0,0.08)',
          transform: isHovered && !isMobile && !prefersReducedMotion
            ? 'translateY(-8px)'
            : 'translateY(0)',
          transition: isMobile ? 'box-shadow 0.2s ease-out' : 'all 0.3s ease-out',
          willChange: isMobile ? 'auto' : (isHovered ? 'transform, box-shadow' : 'auto')
        }}
      >
        {/* Imagem do Produto com Overlay */}
        <div 
          className="relative w-full overflow-hidden cursor-pointer bg-[#E8DCC8] group/image"
          style={{ aspectRatio: '1/1' }}
          onClick={() => setShowModal(true)}
        >
          <motion.img
            src={produto.fotos[0] || '/images/placeholder.jpg'}
            alt={produto.nome}
            className="w-full h-full object-cover"
            style={{ 
              filter: 'grayscale(5%)',
              transition: isMobile ? 'none' : 'transform 0.4s ease',
              willChange: isMobile ? 'auto' : (isHovered ? 'transform' : 'auto')
            }}
            animate={!isMobile ? { 
              scale: isHovered ? 1.08 : 1 
            } : {}}
            loading="lazy"
            decoding="async"
          />
          
          {/* Badge "DESTAQUE" no canto superior esquerdo */}
          {produto.destaque && (
            <div 
              className="absolute z-10"
              style={{
                top: '16px',
                left: '16px'
              }}
            >
              <div 
                className="text-white uppercase font-body flex items-center gap-1.5 shadow-lg"
                style={{
                  background: '#C9A961',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '1px'
                }}
              >
                <Star size={12} fill="currentColor" />
                DESTAQUE
              </div>
            </div>
          )}

          {/* Overlay escuro no hover - Desabilitado em mobile */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'rgba(0, 0, 0, 0.2)'
              }}
            />
          )}
          
          {/* Ícone de olho centralizado no hover - Desabilitado em mobile */}
          {!isMobile && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1 : 0.8
              }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
            >
              <Eye size={48} className="text-white" strokeWidth={1.5} />
            </motion.div>
          )}
          
          {/* Badge de Esgotado */}
          {produto.status === 'esgotado' && (
            <div className="absolute inset-0 bg-white/95 flex items-center justify-center backdrop-blur-sm z-20">
              <span className="text-brown-darkest text-[11px] tracking-[0.15em] uppercase font-body font-medium">
                ESGOTADO
              </span>
            </div>
          )}
        </div>

        {/* Conteúdo com padding - Otimizado para mobile */}
        <div style={{ padding: isMobile ? '20px' : '24px' }}>
          {/* Tamanho/Tipo (label pequeno) - Sem animação em mobile */}
          <motion.p 
            initial={{ opacity: isMobile ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={isMobile ? {} : { delay: 0.1, duration: 0.3 }}
            className="font-body"
            style={{ 
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: '#999999',
              fontWeight: 500,
              marginBottom: '8px'
            }}
          >
            {produto.tamanho}
          </motion.p>

          {/* Nome do Produto (título) - Animação simplificada em mobile */}
          <motion.h3 
            initial={{ opacity: isMobile ? 1 : 0, y: isMobile ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={isMobile ? {} : { delay: 0.15, duration: 0.3 }}
            className="font-display transition-colors cursor-pointer"
            style={{ 
              fontFamily: 'Georgia, "Playfair Display", serif',
              fontSize: isMobile ? '22px' : '26px',
              fontWeight: 600,
              color: '#2d2d2d',
              lineHeight: 1.3,
              marginBottom: '12px'
            }}
            onMouseEnter={(e) => !isMobile && (e.currentTarget.style.color = '#C9A961')}
            onMouseLeave={(e) => !isMobile && (e.currentTarget.style.color = '#2d2d2d')}
            onClick={() => setShowModal(true)}
          >
            {produto.nome}
          </motion.h3>

          {/* Linha decorativa */}
          <div 
            style={{
              width: '40px',
              height: '2px',
              background: 'linear-gradient(to right, #C9A961, transparent)',
              margin: '12px 0'
            }}
          />

          {/* Descrição */}
          <p 
            className="font-body line-clamp-2"
            style={{ 
              fontSize: isMobile ? '14px' : '15px',
              lineHeight: 1.6,
              color: '#666666',
              marginBottom: '16px',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {produto.descricao_curta}
          </p>

          {/* Badges de Diferenciais Luxuosas e Minimalistas */}
          <div 
            className="flex flex-nowrap"
            style={{ 
              gap: '6px',
              marginBottom: '24px'
            }}
          >
            {['Sem Glúten', 'Zero Lactose', 'Low Sugar'].map((badge, i) => {
              const tagConfig = {
                'Sem Glúten': {
                  icon: Check,
                  label: 'SEM GLÚTEN'
                },
                'Zero Lactose': {
                  icon: MilkOff,
                  label: 'ZERO LACTOSE'
                },
                'Low Sugar': {
                  icon: Droplet,
                  label: 'LOW SUGAR'
                }
              }
              
              const config = tagConfig[badge as keyof typeof tagConfig]
              const IconComponent = config.icon
              
              return (
                <span
                  key={i}
                  className="inline-flex items-center transition-all cursor-default flex-shrink-0"
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(201,169,97,0.3)',
                    background: 'linear-gradient(135deg, rgba(201,169,97,0.03), rgba(201,169,97,0.08))',
                    fontSize: '9px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontWeight: 600,
                    color: '#8B7355',
                    transition: 'all 0.2s ease',
                    boxShadow: 'none',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.borderColor = 'rgba(201,169,97,0.6)'
                    e.currentTarget.style.color = '#C9A961'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(201,169,97,0.15)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.borderColor = 'rgba(201,169,97,0.3)'
                    e.currentTarget.style.color = '#8B7355'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <IconComponent 
                    size={10} 
                    style={{ 
                      marginRight: '4px',
                      color: 'inherit',
                      flexShrink: 0
                    }} 
                  />
                  {config.label}
                </span>
              )
            })}
          </div>

          {/* Seletor de Variações - Só mostra se houver mais de 1 variação real (não virtual) */}
          {variants.length > 1 && !variants.some(v => v.id?.startsWith('virtual-')) && (
            <div className="mt-3 pt-3 border-t border-beige-medium">
              <ProductVariantSelector
                variants={variants}
                onSelect={setSelectedVariant}
                selectedVariantId={selectedVariant?.id}
                isMobile={isMobile}
              />
            </div>
          )}

          {/* Quando há apenas uma variação virtual, garantir que está selecionada */}
          {variants.length === 1 && variants[0]?.id?.startsWith('virtual-') && !selectedVariant && (
            <div className="mt-3 pt-3 border-t border-beige-medium">
              <div className="text-sm text-brown-medium">
                {variants[0].nome_variacao}
              </div>
            </div>
          )}

          {/* Preço e CTA em linha */}
          <div className="flex items-end justify-between pt-4 border-t border-beige-medium">
            <div>
              {selectedVariant ? (
                <>
                  <div className="font-body text-[10px] text-brown-light mb-1 uppercase tracking-wider">
                    {selectedVariant.nome_variacao}
                  </div>
                  <span 
                    className="font-display font-medium text-gold-dark"
                    style={{ fontSize: isMobile ? '28px' : '32px', letterSpacing: '-0.5px' }}
                  >
                    {formatPrice(selectedVariant.preco)}
                  </span>
                </>
              ) : (
                <>
                  <div className="font-body text-[10px] text-brown-light mb-1 uppercase tracking-wider">
                    A partir de
                  </div>
                  <span 
                    className="font-display font-medium text-gold-dark"
                    style={{ fontSize: isMobile ? '28px' : '32px', letterSpacing: '-0.5px' }}
                  >
                    {formatPrice(produto.preco)}
                  </span>
                </>
              )}
            </div>

            {/* Botão Compacto - Otimizado para touch */}
            {produto.status === 'disponivel' ? (
              <motion.button
                whileHover={!isMobile ? { scale: 1.05 } : {}}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // Criar produto com variação para o carrinho
                  // Se não houver variação selecionada, usa o preço do produto diretamente
                  // Se houver variação virtual, usa ela (que já contém o preço do produto)
                  const produtoComVariacao = {
                    ...produto,
                    preco: selectedVariant?.preco || produto.preco, // Sempre usa o preço do produto como base
                    variacao_selecionada: selectedVariant || undefined
                  }
                  addToCart(produtoComVariacao)
                }}
                className="bg-wine text-white px-6 py-3 font-body text-xs uppercase tracking-wider hover:bg-wine-dark flex items-center gap-2 transition-colors touch-manipulation"
                style={{ 
                  transition: 'all 0.3s ease',
                  minHeight: isMobile ? '44px' : 'auto', // Tamanho mínimo para touch
                  minWidth: isMobile ? '44px' : 'auto'
                }}
              >
                <ShoppingBag size={16} />
                Adicionar
              </motion.button>
            ) : (
              <button
                disabled
                className="bg-beige-medium text-taupe px-6 py-3 font-body text-xs uppercase tracking-wider cursor-not-allowed touch-manipulation"
                style={{
                  minHeight: isMobile ? '44px' : 'auto',
                  minWidth: isMobile ? '44px' : 'auto'
                }}
              >
                Esgotado
              </button>
            )}
          </div>

          {/* Link Ver Detalhes */}
          <button
            onClick={() => setShowModal(true)}
            className="w-full mt-4 text-center font-body text-xs uppercase tracking-wider text-taupe hover:text-brown-medium transition-colors pt-2"
            style={{ transition: 'all 0.3s ease' }}
          >
            Ver Detalhes →
          </button>
        </div>
      </motion.div>

      {/* Modal de Detalhes */}
      <AnimatePresence>
        {showModal && (
          <ProductModal
            key={`modal-${produto.id}`}
            produto={produto}
            variants={variants}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
