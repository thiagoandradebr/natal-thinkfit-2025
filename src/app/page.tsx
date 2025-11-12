'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Leaf, Award, Clock, Shield, Plus, Minus, Star } from 'lucide-react'
import Link from 'next/link'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import ProductCard from '@/components/ProductCard'
import Footer from '@/components/Footer'
import ChristmasOrnaments from '@/components/ChristmasOrnaments'
import ChefSection from '@/components/ChefSection'
import LimitedProduction from '@/components/LimitedProduction'
import { supabase } from '@/lib/supabase'
import { Produto } from '@/types/database'
import { getLastSection } from '@/lib/storage'

// Hook para detectar mobile
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}

// Componente FAQ Item com Tema Natalino
function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.6, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="relative group"
    >
      {/* Card com tema natalino */}
      <div 
        className="relative bg-white rounded-lg overflow-hidden border-2 transition-all duration-300"
        style={{
          borderColor: isOpen ? '#C9A961' : '#E0DED9',
          boxShadow: isOpen 
            ? '0 8px 24px rgba(201, 169, 97, 0.2)' 
            : '0 2px 8px rgba(0, 0, 0, 0.05)',
          padding: '24px'
        }}
      >
        {/* Borda dourada superior quando aberto */}
        {isOpen && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 left-0 h-1 bg-gradient-to-r from-gold-warm via-gold to-gold-warm"
          />
        )}

        {/* Decoração natalina no canto */}
        <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
          <Star size={16} className="text-gold-warm" fill="currentColor" />
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between cursor-pointer group/button"
        >
          <h3 
            className="font-display text-[#3E2723] text-left pr-8 group-hover/button:text-gold-dark transition-colors flex-1"
            style={{ fontSize: '18px', fontWeight: 600, lineHeight: 1.4 }}
          >
            {question}
          </h3>
          <div className="flex-shrink-0 flex items-center gap-3">
            {/* Ícone de estrela decorativo */}
            <Star 
              size={16} 
              className={`text-gold-warm transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-30'}`}
              fill={isOpen ? 'currentColor' : 'none'}
            />
            {/* Ícone de expandir/colapsar */}
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="w-8 h-8 rounded-full bg-gold-warm/10 flex items-center justify-center group-hover/button:bg-gold-warm/20 transition-colors"
            >
              {isOpen ? (
                <Minus 
                  className="text-gold-warm transition-transform duration-300" 
                  size={18} 
                  strokeWidth={2}
                />
              ) : (
                <Plus 
                  className="text-gold-warm transition-transform duration-300" 
                  size={18} 
                  strokeWidth={2}
                />
              )}
            </motion.div>
          </div>
        </button>
        
        <motion.div
          initial={false}
          animate={{
            height: isOpen ? 'auto' : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <div 
            className="pt-6 mt-4 border-t border-gold-warm/20"
            style={{ paddingTop: '20px' }}
          >
            <p 
              className="font-body font-light text-[#6D4C41] leading-relaxed"
              style={{ 
                fontSize: '15px', 
                lineHeight: '1.8'
              }}
            >
              {answer}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default function Home() {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(true)
  const [configuracoes, setConfiguracoes] = useState<any>({})
  const isMobile = useIsMobile()

  useEffect(() => {
    loadData()
  }, [])

  // Tratar navegação com hash (ex: /#cardapio)
  useEffect(() => {
    const handleHashNavigation = () => {
      const hash = window.location.hash.replace('#', '')
      if (hash) {
        // Aguardar um pouco para garantir que o DOM está pronto
        setTimeout(() => {
          const element = document.getElementById(hash)
          if (element) {
            // Altura dinâmica do header (110px quando não scrolled, 100px quando scrolled)
            const headerHeight = window.scrollY > 50 ? 100 : 110
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
            const offsetPosition = elementPosition - headerHeight

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            })
          }
        }, 300)
      }
    }

    // Executar quando a página carregar
    if (!loading) {
      handleHashNavigation()
    }

    // Também escutar mudanças no hash
    window.addEventListener('hashchange', handleHashNavigation)
    return () => window.removeEventListener('hashchange', handleHashNavigation)
  }, [loading])

  const loadData = async () => {
    try {
      // Carregar produtos (tabela produtos_natal)
      const { data: produtosData, error: produtosError } = await supabase
        .from('produtos_natal')
        .select('*')
        .order('ordem', { ascending: true })

      if (produtosError) throw produtosError
      setProdutos(produtosData || [])

      // Carregar configurações
      const { data: configData, error: configError } = await supabase
        .from('configuracoes_site')
        .select('*')

      if (configError) throw configError
      
      const configMap = configData?.reduce((acc: any, item: any) => {
        acc[item.chave] = item.valor
        return acc
      }, {})
      
      setConfiguracoes(configMap || {})
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-gold mx-auto mb-4"></div>
          <p className="text-gray-300">Carregando...</p>
        </div>
      </div>
    )
  }

  // Buscar todos os produtos em destaque para o Hero
  const produtosDestaque = produtos.filter(p => p.destaque)
  // Se não houver produtos em destaque, usar os 3 primeiros
  const produtosParaHero = produtosDestaque.length > 0 ? produtosDestaque : produtos.slice(0, 3)

  return (
    <main className="min-h-screen relative">
      {/* Ornamentos Natalinos Animados - Desabilitado em mobile para performance */}
      {!isMobile && <ChristmasOrnaments />}
      
      <Header />
      <Hero 
        titulo={configuracoes.hero_titulo}
        subtitulo={configuracoes.hero_subtitulo}
        produtosDestaque={produtosParaHero}
      />
      
      {/* Seção da Chef */}
      <ChefSection />

      {/* Seção Cardápio - Layout Revista de Luxo */}
      <section 
        id="cardapio" 
        className="relative overflow-hidden"
        style={{ 
          backgroundColor: '#F8F6F3',
          paddingTop: isMobile ? '80px' : '120px', 
          paddingBottom: isMobile ? '32px' : '48px',
          position: 'relative' // Adicionado para framer-motion
        }}
      >
        {/* Background Pattern SVG de Estrelas */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: 0.03 }}
        >
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="stars-pattern" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
                {/* Estrelas pequenas distribuídas */}
                {Array.from({ length: 50 }).map((_, i) => {
                  const x = (i * 37) % 200
                  const y = (i * 73) % 200
                  const size = [8, 12, 16][i % 3]
                  const color = i % 2 === 0 ? '#C9A961' : '#2d5016'
                  return (
                    <circle key={i} cx={x} cy={y} r={size / 2} fill={color} />
                  )
                })}
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#stars-pattern)" />
          </svg>
        </div>

        {/* Elementos Decorativos Flutuantes - Reduzidos em mobile */}
        {(() => {
          const prefersReducedMotion = typeof window !== 'undefined' 
            ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
            : false
          
          // Reduzir elementos em mobile: 35 -> 12
          const decorCount = isMobile ? 12 : 35
          
          return Array.from({ length: decorCount }).map((_, i) => {
            const left = `${(i * 47) % 100}%`
            const top = `${(i * 31) % 100}%`
            const opacity = 0.05 + (i % 3) * 0.03
            const delay = i * 0.2
            const duration = 4 + (i % 3) * 1
            const size = [8, 12, 16][i % 3]
            const shape = i % 3 === 0 ? 'star' : i % 3 === 1 ? 'circle' : 'snowflake'
            
            return (
              <motion.div
                key={i}
                className="absolute pointer-events-none"
                style={{
                  left,
                  top,
                  opacity,
                  zIndex: -1,
                  width: `${size}px`,
                  height: `${size}px`,
                  color: i % 2 === 0 ? '#C9A961' : '#2d5016'
                }}
                animate={prefersReducedMotion ? {} : {
                  y: [0, -20, 0],
                  opacity: [opacity, opacity * 1.5, opacity],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration,
                  delay,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                {shape === 'star' && (
                  <Star size={size} fill="currentColor" />
                )}
                {shape === 'circle' && (
                  <div 
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      borderRadius: '50%',
                      background: 'currentColor'
                    }}
                  />
                )}
                {shape === 'snowflake' && (
                  <div 
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      background: 'currentColor',
                      clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                    }}
                  />
                )}
              </motion.div>
            )
          })
        })()}

        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 relative z-10" style={{ maxWidth: '1400px' }}>
          {/* Título e Subtítulo - Design Destacado */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center relative py-4 sm:py-6 md:py-8"
          >
            {/* Decorações de fundo sutis */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-gold-warm/30 to-transparent"></div>
            <div className="absolute top-4 left-1/2 -translate-x-1/2 text-gold-warm/20 text-2xl">✨</div>
            
            {/* Badge "Produção Limitada" */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block mb-6 sm:mb-8"
            >
              <span className="inline-block px-4 sm:px-6 py-2 sm:py-2.5 bg-wine/10 border border-wine/30 text-wine text-xs sm:text-sm font-body uppercase tracking-[2px] font-semibold rounded-full">
                Produção Limitada
              </span>
            </motion.div>

            {/* Título Principal com Gradiente */}
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display font-light text-[#3E2723] mb-4 sm:mb-6 relative"
              style={{ 
                fontSize: isMobile ? 'clamp(36px, 8vw, 48px)' : 'clamp(56px, 6vw, 72px)',
                lineHeight: '1.1',
                letterSpacing: '-0.02em'
              }}
            >
              <span className="relative inline-block">
                <span className="absolute -inset-2 bg-gradient-to-r from-gold-warm/5 via-transparent to-gold-warm/5 blur-xl"></span>
                <span className="relative">Cardápio de Natal 2025</span>
              </span>
            </motion.h2>

            {/* Linha decorativa */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex items-center justify-center gap-3 mb-6 sm:mb-8"
            >
              <div className="h-px w-12 sm:w-16 bg-gold-warm/40"></div>
              <Star size={16} className="text-gold-warm/60" />
              <div className="h-px w-12 sm:w-16 bg-gold-warm/40"></div>
            </motion.div>

            {/* Subtítulo com destaque */}
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="font-body font-medium text-[#6D4C41] max-w-2xl mx-auto leading-relaxed whitespace-nowrap"
              style={{ 
                fontSize: isMobile ? 'clamp(15px, 3vw, 18px)' : 'clamp(18px, 2vw, 22px)',
                letterSpacing: '0.3px',
                marginBottom: isMobile ? '32px' : '48px',
                padding: isMobile ? '0 16px' : '0'
              }}
            >
              <span className="text-gold-warm font-semibold">Sobremesas autorais</span> da{' '}
              <span className="text-wine font-semibold">Chef Juliana Andrade</span>
              <span className="text-brown-medium"> — produção limitada</span>
            </motion.p>

            {/* Decoração inferior */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-px bg-gradient-to-r from-transparent via-gold-warm/20 to-transparent"></div>
          </motion.div>

          {/* Grid de Produtos - Otimizado para mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            style={{
              gap: isMobile ? '24px' : '40px',
              rowGap: isMobile ? '32px' : '60px'
            }}
          >
            {produtos.map((produto, index) => (
              <ProductCard key={produto.id} produto={produto} index={index} />
            ))}
          </div>

          {produtos.length === 0 && (
            <p className="text-center text-gray-400 py-12">
              Nenhum produto disponível no momento.
            </p>
          )}
        </div>
      </section>

      {/* Seção Diferenciais - Moderno e Fluido */}
      <section id="diferenciais" className="relative bg-gradient-to-b from-off-white to-beige-lightest overflow-hidden" style={{ padding: isMobile ? '32px 0 60px 0' : '48px 0 120px 0', position: 'relative' }}>
        {/* Ornamento decorativo de fundo */}
        <div className="absolute top-20 right-0 w-96 h-96 border border-sage opacity-5 rounded-full" />
        <div className="absolute bottom-20 left-0 w-64 h-64 border border-gold-warm opacity-5 rounded-full" />

        {/* Elementos Decorativos Flutuantes Natalinos - Reduzido para melhor performance */}
        {(() => {
          const prefersReducedMotion = typeof window !== 'undefined' 
            ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
            : false
          
          // Reduzir elementos em mobile: 20 -> 8
          const decorCount = isMobile ? 8 : 20
          
          return Array.from({ length: decorCount }).map((_, i) => {
            const left = `${(i * 53) % 100}%`
            const top = `${(i * 37) % 100}%`
            const opacity = 0.12 + (i % 3) * 0.05
            const delay = i * 0.25
            const duration = 5 + (i % 3) * 1.5
            const size = [10, 14, 18][i % 3]
            const shape = i % 3 === 0 ? 'star' : i % 3 === 1 ? 'circle' : 'snowflake'
            
            return (
              <motion.div
                key={`diferenciais-${i}`}
                className="absolute pointer-events-none"
                style={{
                  left,
                  top,
                  opacity,
                  zIndex: 0,
                  width: `${size}px`,
                  height: `${size}px`,
                  color: i % 2 === 0 ? '#C9A961' : '#2d5016'
                }}
                animate={prefersReducedMotion ? {} : {
                  y: [0, -25, 0],
                  opacity: [opacity, opacity * 1.3, opacity],
                  rotate: [0, 180, 360]
                }}
                transition={{
                  duration,
                  delay,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
              >
                {shape === 'star' && (
                  <Star size={size} fill="currentColor" />
                )}
                {shape === 'circle' && (
                  <div 
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      borderRadius: '50%',
                      background: 'currentColor'
                    }}
                  />
                )}
                {shape === 'snowflake' && (
                  <div 
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      background: 'currentColor',
                      clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                    }}
                  />
                )}
              </motion.div>
            )
          })
        })()}

        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 relative z-10" style={{ maxWidth: '1400px' }}>
          {/* Título com ornamentos */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
            style={{ marginBottom: isMobile ? '40px' : '96px' }}
          >
            {/* Ornamento superior */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-[1px] w-16 bg-gold-warm" />
              <Star size={20} className="text-gold-warm" />
              <div className="h-[1px] w-16 bg-gold-warm" />
            </div>

            <h2 className="font-display font-light text-brown-darkest mb-4" style={{ fontSize: isMobile ? '28px' : '48px', letterSpacing: '-0.5px' }}>
              Por Que Escolher ThinkFit?
            </h2>
            
            <p className="font-body text-brown-medium max-w-2xl mx-auto" style={{ fontSize: isMobile ? '14px' : '16px', padding: isMobile ? '0 16px' : '0' }}>
              Celebre o Natal com sobremesas que unem <span className="text-gold-dark font-medium">sabor excepcional</span> e <span className="text-gold-dark font-medium">saúde</span>
            </p>
          </motion.div>

          {/* Grid 4 Colunas - Responsivo para mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {/* Benefício 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8 }}
              whileHover={{ y: -8 }}
              className="text-center group"
            >
              <div className="relative inline-block mb-8">
                {/* Background circular */}
                <div className="w-24 h-24 bg-beige-light rounded-full flex items-center justify-center mx-auto border border-sage/20 group-hover:border-sage/40 transition-all duration-500">
                  <Leaf className="text-sage group-hover:text-forest transition-colors duration-500" size={36} strokeWidth={1.5} />
                </div>
                {/* Ornamento decorativo */}
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-gold-warm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              <h3 className="font-body font-medium text-brown-darkest uppercase mb-4 tracking-[1.8px] text-[15px]">
                100% Natural
              </h3>
              
              <p className="font-body font-light text-brown-medium mx-auto leading-relaxed text-sm max-w-[280px]">
                Sem glúten, zero lactose e low sugar. Adoçados com stevia, eritritol e açúcar de coco.
              </p>
            </motion.div>

            {/* Benefício 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              whileHover={{ y: -8 }}
              className="text-center group"
            >
              <div className="relative inline-block mb-8">
                <div className="w-24 h-24 bg-beige-light rounded-full flex items-center justify-center mx-auto border border-gold-warm/20 group-hover:border-gold-warm/40 transition-all duration-500">
                  <Award className="text-gold-warm group-hover:text-gold-dark transition-colors duration-500" size={36} strokeWidth={1.5} />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-gold-warm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              <h3 className="font-body font-medium text-brown-darkest uppercase mb-4 tracking-[1.8px] text-[15px]">
                Chef Especializada
              </h3>
              
              <p className="font-body font-light text-brown-medium mx-auto leading-relaxed text-sm max-w-[280px]">
                Criações autorais da Chef Juliana Andrade, especialista em confeitaria saudável.
              </p>
            </motion.div>

            {/* Benefício 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              whileHover={{ y: -8 }}
              className="text-center group"
            >
              <div className="relative inline-block mb-8">
                <div className="w-24 h-24 bg-beige-light rounded-full flex items-center justify-center mx-auto border border-sage/20 group-hover:border-sage/40 transition-all duration-500">
                  <Clock className="text-sage group-hover:text-forest transition-colors duration-500" size={36} strokeWidth={1.5} />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-gold-warm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              <h3 className="font-body font-medium text-brown-darkest uppercase mb-4 tracking-[1.8px] text-[15px]">
                Edição Limitada
              </h3>
              
              <p className="font-body font-light text-brown-medium mx-auto leading-relaxed text-sm max-w-[280px]">
                Produção artesanal em lotes limitados. Garanta o seu antes que esgote!
              </p>
            </motion.div>

            {/* Benefício 4 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              whileHover={{ y: -8 }}
              className="text-center group"
            >
              <div className="relative inline-block mb-8">
                <div className="w-24 h-24 bg-beige-light rounded-full flex items-center justify-center mx-auto border border-gold-warm/20 group-hover:border-gold-warm/40 transition-all duration-500">
                  <Shield className="text-gold-warm group-hover:text-gold-dark transition-colors duration-500" size={36} strokeWidth={1.5} />
                </div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-[1px] bg-gold-warm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              
              <h3 className="font-body font-medium text-brown-darkest uppercase mb-4 tracking-[1.8px] text-[15px]">
                Qualidade Garantida
              </h3>
              
              <p className="font-body font-light text-brown-medium mx-auto leading-relaxed text-sm max-w-[280px]">
                Ingredientes premium e processos rigorosos para garantir sabor e saúde.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Produção Limitada - Novo Design */}
      <LimitedProduction 
        dataLimite={configuracoes.data_limite_pedidos ? new Date(configuracoes.data_limite_pedidos).toLocaleDateString('pt-BR') : '18/12/2025'}
      />


      {/* FAQ - Tema Natalino com Destaque */}
      <section 
        id="faq" 
        className="relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(to bottom, #FAFAF8, #F5F1E8)',
          padding: isMobile ? '60px 0' : '120px 0',
          position: 'relative' // Adicionado para framer-motion
        }}
      >
        {/* Decorações Natalinas de Fundo */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Estrelas flutuantes - Reduzido para melhor performance em mobile */}
          {Array.from({ length: isMobile ? 6 : 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${(i * 73) % 100}%`,
                top: `${(i * 47) % 100}%`,
                opacity: 0.08,
                zIndex: 0
              }}
              animate={{
                y: [0, -15, 0],
                opacity: [0.08, 0.15, 0.08],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 4 + (i % 3),
                delay: i * 0.4,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              <Star size={20 + (i % 3) * 8} className="text-gold-warm" fill="currentColor" />
            </motion.div>
          ))}
          
          {/* Flocos de neve - Reduzido para melhor performance em mobile */}
          {Array.from({ length: isMobile ? 4 : 8 }).map((_, i) => (
            <motion.div
              key={`snow-${i}`}
              className="absolute text-white/5"
              style={{
                left: `${(i * 61) % 100}%`,
                top: `${(i * 39) % 100}%`,
                fontSize: `${24 + (i % 3) * 8}px`,
                zIndex: 0
              }}
              animate={{
                y: [0, 20, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration: 5 + (i % 2),
                delay: i * 0.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              ❄
            </motion.div>
          ))}
        </div>

        <div className="container mx-auto px-4 sm:px-6 md:px-12 lg:px-20 relative z-10" style={{ maxWidth: '900px' }}>
          {/* Header com Tema Natalino */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
            style={{ marginBottom: isMobile ? '32px' : '64px' }}
          >
            {/* Badge decorativo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 mb-6"
              style={{
                background: 'rgba(201, 169, 97, 0.1)',
                padding: '8px 20px',
                border: '1.5px solid rgba(201, 169, 97, 0.3)',
                borderRadius: '25px'
              }}
            >
              <Star size={14} className="text-gold-warm" fill="currentColor" />
              <span 
                className="font-body uppercase tracking-[2px] text-gold-warm font-semibold"
                style={{ fontSize: '11px', letterSpacing: '2px' }}
              >
                DÚVIDAS FREQUENTES
              </span>
              <Star size={14} className="text-gold-warm" fill="currentColor" />
            </motion.div>

            {/* Título Principal */}
            <h2 
              className="font-display font-light text-[#3E2723] mb-4 relative"
              style={{ fontSize: isMobile ? '28px' : '48px', lineHeight: 1.2 }}
            >
              <span className="relative inline-block">
                Perguntas Frequentes
                {/* Linha decorativa dourada */}
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="absolute -bottom-2 left-0 h-[3px] bg-gradient-to-r from-transparent via-gold-warm to-transparent"
                />
              </span>
            </h2>

            {/* Subtítulo */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="font-body text-[#8D6E63] mt-4"
              style={{ fontSize: isMobile ? '14px' : '16px', padding: isMobile ? '0 16px' : '0' }}
            >
              Tire suas dúvidas sobre nossos produtos e processo de encomenda
            </motion.p>
          </motion.div>

          {/* Accordion Items com Espaçamento */}
          <div className="space-y-4">
            {[
              {
                q: 'Os produtos são realmente sem glúten e sem lactose?',
                a: 'Sim! Todos os nossos produtos são 100% sem glúten e zero lactose, perfeitos para quem tem restrições alimentares.',
              },
              {
                q: 'Como funciona a entrega?',
                a: 'Após a confirmação do pedido entraremos em contato por WhatsApp para combinar a melhor forma de entrega ou retirada. Teremos entregas nos dias 24/12 e 30/12.',
              },
              {
                q: 'Qual a forma de pagamento?',
                a: 'Aceitamos Pix e Link de pagamento para cartão de crédito.',
              },
              {
                q: 'Posso fazer encomendas personalizadas?',
                a: 'Entre em contato conosco pelo WhatsApp para discutir personalizações. Estamos aqui para tornar seu Natal ainda mais especial!',
              },
            ].map((faq, index) => (
              <FAQItem key={index} question={faq.q} answer={faq.a} index={index} />
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Link Escondido para Administração */}
      <Link 
        href="/admin"
        className="fixed bottom-4 right-4 z-50 opacity-0 hover:opacity-100 transition-opacity duration-300 group"
        style={{ 
          opacity: 0.05,
          fontSize: '10px',
          color: '#8D6E63',
          textDecoration: 'none',
          padding: '4px 8px',
          borderRadius: '4px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(4px)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1'
          e.currentTarget.style.backgroundColor = 'rgba(201, 169, 97, 0.2)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '0.05'
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'
        }}
      >
        Admin
      </Link>
    </main>
  )
}
