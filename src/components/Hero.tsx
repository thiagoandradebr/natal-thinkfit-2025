'use client'

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Star, Sparkles } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import { Produto } from '@/types/database'
import { TextColor } from '@/components/ui/text-color'

interface HeroProps {
  titulo?: string
  subtitulo?: string
  produtosDestaque?: Produto[]
}

export default function Hero({ 
  titulo = "Um Natal saudável e sofisticado",
  subtitulo = "Sobremesas autorais da Chef Juliana Andrade — bolos sem glúten, zero lactose e low sugar para uma celebração memorável.",
  produtosDestaque = []
}: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const produtoAtual = produtosDestaque[currentIndex] || null

  // Alternar automaticamente entre produtos a cada 5 segundos
  useEffect(() => {
    if (produtosDestaque.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % produtosDestaque.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [produtosDestaque.length])
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const scrollToCardapio = () => {
    const element = document.getElementById('cardapio')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToPedido = () => {
    const element = document.getElementById('pedido')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section ref={ref} className="relative min-h-screen pt-32 pb-20 px-6 overflow-hidden">
      {/* Background decorativo com parallax sutil */}
      <motion.div 
        style={{ y }}
        className="absolute top-0 right-0 w-1/2 h-full opacity-5 pointer-events-none"
      >
        <div className="absolute top-20 right-20 w-64 h-64 border border-sage rounded-full"></div>
        <div className="absolute top-40 right-40 w-96 h-96 border border-gold-warm rounded-full"></div>
      </motion.div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Lado esquerdo - Conteúdo */}
        <motion.div 
          style={{ opacity }}
          className="space-y-8"
        >
          {/* Título gigante com gradientes animados */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <TextColor words={['Um', 'Natal', 'saudável e', 'sofisticado']} />
          </motion.div>

          {/* Ornamento decorativo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex items-center gap-4 opacity-60"
          >
            <div className="h-[1px] w-12 bg-gold-warm"></div>
            <Star size={16} className="text-gold-warm" />
            <div className="h-[1px] w-12 bg-gold-warm"></div>
          </motion.div>

          {/* Subtítulo */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="font-body text-xl font-semibold text-gold-warm leading-tight whitespace-nowrap"
          >
            Bolos sem glúten, zero lactose e low sugar
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <button
              onClick={scrollToPedido}
              className="btn-primary bg-wine text-white px-10 py-4 font-body text-sm uppercase tracking-[2px] flex items-center justify-center gap-3 hover:bg-wine-dark group"
            >
              <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
              Monte Seu Pedido
            </button>
            <button
              onClick={scrollToCardapio}
              className="bg-forest text-white px-10 py-4 font-body text-sm uppercase tracking-[2px] hover:bg-forest-dark transition-all"
            >
              Ver Cardápio Completo
            </button>
          </motion.div>

        </motion.div>

        {/* Lado direito - Card de produto em destaque */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative"
        >
          <div className="relative">
            {/* Card principal com ribbon */}
            <div className="card-ribbon relative bg-white p-8 shadow-2xl">
              {/* Imagem do produto em destaque com transição */}
              <div className="aspect-square bg-[#E8DCC8] flex items-center justify-center mb-6 overflow-hidden relative group">
                <AnimatePresence mode="wait">
                  {produtoAtual && produtoAtual.fotos && produtoAtual.fotos[0] ? (
                    <motion.img
                      key={produtoAtual.id}
                      src={produtoAtual.fotos[0]}
                      alt={produtoAtual.nome}
                      className="w-full h-full object-cover absolute inset-0"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    />
                  ) : (
                    <motion.div
                      key="placeholder"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center space-y-3"
                    >
                      <Star size={48} className="text-gold-warm mx-auto" />
                      <p className="font-display text-2xl text-brown-darkest">
                        {produtoAtual?.nome || 'Red Velvet'}
                      </p>
                      <p className="font-body text-sm text-brown-light">Produto em Destaque</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Info rápida com transição */}
              <div className="flex items-center justify-between">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={produtoAtual?.id || 'default'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="font-body text-xs uppercase tracking-wider text-brown-light mb-1">A partir de</div>
                    <div className="font-display text-4xl font-medium text-gold-dark">
                      {produtoAtual ? 
                        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produtoAtual.preco) 
                        : 'R$ 417'
                      }
                    </div>
                  </motion.div>
                </AnimatePresence>
                <button 
                  onClick={scrollToPedido}
                  className="bg-forest text-white p-4 hover:bg-forest-dark transition-all hover:scale-110"
                >
                  <ShoppingBag size={20} />
                </button>
              </div>

              {/* Indicadores de navegação */}
              {produtosDestaque.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  {produtosDestaque.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-1 rounded-full transition-all ${
                        index === currentIndex
                          ? 'bg-gold-warm w-8'
                          : 'bg-beige-medium w-1 hover:bg-gold-warm/50'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Badge flutuante */}
            <div className="absolute -top-4 -right-4 bg-gold-warm text-white px-6 py-3 shadow-xl">
              <div className="font-body text-xs uppercase tracking-wider">Mais Vendido</div>
            </div>

            {/* Ornamento decorativo */}
            <div className="absolute -bottom-8 -left-8 w-32 h-32 border-2 border-sage opacity-30 -z-10"></div>
          </div>
        </motion.div>
      </div>

    </section>
  )
}
