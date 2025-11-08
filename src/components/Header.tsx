'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'
import ThinkFitLogo from './ThinkFitLogo'
import { supabase } from '@/lib/supabase'
import { useCart } from '@/contexts/CartContext'
import { saveLastSection } from '@/lib/storage'

export default function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const { getItemCount, getTotal } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const { scrollY } = useScroll({ layoutEffect: false }) // Otimização: não usar layoutEffect
  const headerOpacity = useTransform(scrollY, [0, 100], [0.95, 1])
  const cartItemCount = getItemCount()
  const cartTotal = getTotal()
  const isHomePage = pathname === '/'

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  useEffect(() => {
    loadLogo()
  }, [])

  const loadLogo = async () => {
    try {
      const { data, error } = await supabase
        .from('configuracoes_site')
        .select('valor')
        .eq('chave', 'logo_url')
        .maybeSingle()

      if (error) {
        console.error('Erro ao carregar logo:', error)
        return
      }
      
      if (data?.valor) {
        setLogoUrl(data.valor)
      }
    } catch (error) {
      console.error('Erro ao carregar logo:', error)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    saveLastSection(id)
    
    // Se não estiver na página principal, navegar para lá com o hash
    if (!isHomePage) {
      router.push(`/#${id}`)
      return
    }

    // Se estiver na página principal, fazer scroll suave
    const element = document.getElementById(id)
    if (element) {
      const headerHeight = isScrolled ? 100 : 110 // Altura do header fixo (dinâmica)
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - headerHeight

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    } else {
      // Se o elemento não existir ainda, tentar navegar com hash
      router.push(`/#${id}`)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1000,
        height: isScrolled ? '100px' : '120px'
      }}
    >
      <motion.header
        style={{ 
          width: '100%',
          height: '100%',
          opacity: headerOpacity,
          backdropFilter: isScrolled ? 'blur(25px)' : 'blur(10px)',
          boxShadow: isScrolled 
            ? '0 4px 16px rgba(0, 0, 0, 0.12)' 
            : '0 2px 12px rgba(0, 0, 0, 0.08)'
        }}
        className={`transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/98 border-b-2 border-gold-warm/20' 
            : 'bg-gradient-to-b from-white via-[#FAF8F3] to-white border-b border-gold-warm/15'
        }`}
      >
      <div className="container mx-auto px-6 md:px-12 lg:px-20 h-full flex items-center justify-between py-4" style={{ maxWidth: '1400px' }}>
        {/* Logo ThinkFit */}
        <motion.div 
          className="flex items-center gap-5"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            {logoUrl ? (
              <img 
                src={logoUrl} 
                alt="ThinkFit" 
                className={`object-contain transition-all duration-300 ${isScrolled ? 'h-16' : 'h-19'}`}
                style={{ height: isScrolled ? '64px' : '76px' }}
              />
            ) : (
              <ThinkFitLogo className={`transition-all duration-300 ${isScrolled ? 'h-16' : 'h-19'}`} />
            )}
          </div>
          <div className={`transition-all duration-300 ${isScrolled ? 'h-12' : 'h-14'} w-[1px] bg-gradient-to-b from-transparent via-gold-warm/50 to-transparent`} />
          <div className="flex flex-col gap-0.5">
            <span className={`font-body text-brown-darkest uppercase tracking-[2.5px] leading-tight font-semibold transition-all duration-300 ${isScrolled ? 'text-[12px]' : 'text-[13px]'}`}>
              Natal
            </span>
            <span className={`font-body text-gold-warm uppercase tracking-[2.5px] leading-tight font-bold transition-all duration-300 ${isScrolled ? 'text-[12px]' : 'text-[14px]'}`}>
              2025
            </span>
          </div>
        </motion.div>

        {/* Navigation com Indicador Ativo */}
        <nav className="hidden md:flex items-center gap-10">
          {['cardapio', 'diferenciais', 'faq'].map((section) => (
            <motion.button
              key={section}
              onClick={() => scrollToSection(section)}
              className="relative font-body text-[#3E2723] uppercase hover:text-gold-warm transition-all duration-300 font-semibold text-sm tracking-[2px] group px-3 py-2"
              whileHover={{ y: -3, scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {section === 'cardapio' ? 'Cardápio' : section === 'diferenciais' ? 'Diferenciais' : 'FAQ'}
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[3px] bg-gradient-to-r from-gold-warm to-sage group-hover:w-full transition-all duration-300 rounded-full" />
              <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-gold-warm group-hover:w-full transition-all duration-300" />
              <span className="absolute inset-0 bg-gold-warm/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          ))}
        </nav>

        {/* Carrinho e CTA */}
        <div className="flex items-center gap-4">
          {cartItemCount > 0 && (
            <motion.button
              onClick={() => router.push('/checkout')}
              className="relative bg-white border-2 text-wine hover:bg-wine hover:text-white hover:border-wine transition-all group shadow-md hover:shadow-xl"
              style={{ 
                borderRadius: '4px', 
                padding: '12px 18px',
                borderColor: '#C4A05A'
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ShoppingCart size={22} />
                  <span className="absolute -top-2 -right-2 bg-gold-warm text-white rounded-full w-6 h-6 flex items-center justify-center font-body text-xs font-bold shadow-lg">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="font-body text-[10px] uppercase tracking-wider opacity-70 group-hover:opacity-100 transition-opacity">
                    Total
                  </span>
                  <span className="font-display text-base font-semibold text-gold-dark group-hover:text-white transition-colors">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
              </div>
            </motion.button>
          )}
        </div>
      </div>
      </motion.header>
    </div>
  )
}
