'use client'

import { useState, useEffect } from 'react'
import { Instagram, MessageCircle, Heart, Gift, Sparkles, Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

export default function Footer() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navigationLinks = [
    { label: 'Cardápio', href: '#cardapio', id: 'cardapio', isExternal: false },
    { label: 'Diferenciais', href: '#diferenciais', id: 'diferenciais', isExternal: false },
    { label: 'FAQ', href: '#faq', id: 'faq', isExternal: false },
    { label: 'Administrativo', href: '/admin', id: '', isExternal: true }
  ]

  const socialLinks = [
    { 
      icon: Instagram, 
      label: 'ThinkFIT', 
      sublabel: 'Instagram',
      href: 'https://www.instagram.com/thinkfitbrasil'
    },
    { 
      icon: Instagram, 
      label: 'Chef Ju Andrade', 
      sublabel: 'Instagram',
      href: 'https://www.instagram.com/chefjuandrade'
    },
    { 
      icon: MessageCircle, 
      label: 'Contato', 
      sublabel: 'WhatsApp',
      href: 'https://wa.me/5521996818601'
    }
  ]

  return (
    <footer className="relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #2D5016 0%, #3A6B1F 50%, #2D5016 100%)',
      color: '#F8F6F3'
    }}>
      
      {/* Borda superior dourada */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#C9A961] to-transparent" />
      
      {/* Elementos decorativos - Estrelas nos cantos com tema natalino */}
      <motion.div 
        className="absolute top-8 right-12 opacity-10 pointer-events-none"
        animate={{ 
          rotate: [0, 360],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{ 
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        <Sparkles className="w-32 h-32 text-[#C9A961]" strokeWidth={0.5} />
      </motion.div>
      
      {/* Estrela centralizada na parte inferior esquerda */}
      <motion.div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 md:left-[25%] md:translate-x-0 opacity-8 pointer-events-none"
        animate={{ 
          rotate: [0, -360],
          opacity: [0.08, 0.12, 0.08]
        }}
        transition={{ 
          duration: 25,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        <Star className="w-24 h-24 text-[#C9A961]" fill="currentColor" strokeWidth={0.5} />
      </motion.div>

      {/* Elementos decorativos flutuantes sutis */}
      {Array.from({ length: 8 }).map((_, i) => {
        const left = `${(i * 23) % 100}%`
        const top = `${(i * 31) % 100}%`
        const size = [6, 8, 10][i % 3]
        return (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{
              left,
              top,
              opacity: 0.06,
              width: `${size}px`,
              height: `${size}px`,
              color: i % 2 === 0 ? '#C9A961' : '#8B9D83'
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.06, 0.1, 0.06],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 4 + (i % 3),
              delay: i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          >
            <Star size={size} fill="currentColor" />
          </motion.div>
        )
      })}
      
      {/* Conteúdo Principal */}
      <div className="max-w-6xl mx-auto px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          
          {/* COLUNA 1: Branding */}
          <div className="space-y-5">
              {/* Logo */}
            <div className="relative">
                {logoUrl ? (
                    <img 
                      src={logoUrl} 
                      alt="ThinkFit" 
                  className="h-28 w-auto object-contain mb-4"
                  style={{ filter: 'brightness(1.1)' }}
                />
              ) : (
                <h3 className="font-bold text-6xl mb-4 tracking-tight" style={{ 
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  color: '#F8F6F3',
                  textShadow: '0 2px 8px rgba(201, 169, 97, 0.3)',
                  fontWeight: 800
                }}>
                  THINKFIT
                </h3>
                )}
              </div>

            {/* Botão NATAL 2025 */}
            <button 
              onClick={() => scrollToSection('cardapio')}
              className="mt-6 px-6 py-2.5 border-2 rounded-lg text-sm transition-all duration-200 flex items-center gap-2 hover:scale-105"
              style={{ 
                fontFamily: 'system-ui, -apple-system, sans-serif',
                borderColor: '#C9A961',
                color: '#C9A961',
                backgroundColor: 'rgba(201, 169, 97, 0.1)',
                fontWeight: 700
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#D4AF37'
                e.currentTarget.style.color = '#D4AF37'
                e.currentTarget.style.backgroundColor = 'rgba(201, 169, 97, 0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#C9A961'
                e.currentTarget.style.color = '#C9A961'
                e.currentTarget.style.backgroundColor = 'rgba(201, 169, 97, 0.1)'
              }}
            >
              <Gift className="w-4 h-4" strokeWidth={2} />
              NATAL 2025
            </button>
          </div>

          {/* COLUNA 2: Navegação */}
          <div className="space-y-5">
            <div>
              <h3 className="text-xs uppercase mb-4" style={{ 
                fontFamily: 'system-ui, -apple-system, sans-serif',
                color: '#C9A961',
                letterSpacing: '1px',
                fontWeight: 800
              }}>
                NAVEGAÇÃO
              </h3>
            </div>
            
            <nav className="space-y-3">
              {navigationLinks.map((item) => (
                item.isExternal ? (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block text-sm cursor-pointer transition-colors duration-200"
                    style={{ 
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      color: '#F8F6F3',
                      fontWeight: 600
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#C9A961'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#F8F6F3'}
                  >
                    {item.label}
                  </a>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection(item.id)
                    }}
                    className="block text-sm cursor-pointer transition-colors duration-200"
                    style={{ 
                      fontFamily: 'system-ui, -apple-system, sans-serif',
                      color: '#F8F6F3',
                      fontWeight: 600
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#C9A961'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#F8F6F3'}
                  >
                    {item.label}
                  </a>
                )
              ))}
            </nav>
          </div>

          {/* COLUNA 3: Conecte-se */}
          <div className="space-y-5">
            <div>
              <h3 className="text-xs uppercase mb-4" style={{ 
                fontFamily: 'system-ui, -apple-system, sans-serif',
                color: '#C9A961',
                letterSpacing: '1px',
                fontWeight: 800
              }}>
                CONECTE-SE
              </h3>
            </div>
            
            <div className="space-y-3">
              {socialLinks.map((social, idx) => {
                const Icon = social.icon
                return (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 cursor-pointer group transition-all duration-200"
                  >
                    <div className="flex-shrink-0 p-2 rounded-full transition-all duration-200" style={{
                      backgroundColor: 'rgba(201, 169, 97, 0.1)',
                      border: '1px solid rgba(201, 169, 97, 0.3)'
                    }}>
                      <Icon className="w-5 h-5 transition-colors duration-200" style={{ color: '#C9A961' }} strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm transition-colors duration-200" style={{ 
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        color: '#F8F6F3',
                        fontWeight: 700
                      }}>
                        {social.label}
                      </span>
                      <span className="text-xs transition-colors duration-200" style={{ 
                        fontFamily: 'system-ui, -apple-system, sans-serif',
                        color: '#F8F6F3',
                        opacity: 0.7,
                        fontWeight: 600
                      }}>
                        {social.sublabel}
                      </span>
                    </div>
                  </a>
                )
              })}
                </div>
          </div>
          
          </div>
        </div>

      {/* Bottom Bar - Copyright */}
      <div className="border-t" style={{ borderColor: 'rgba(201, 169, 97, 0.2)' }}>
        <div className="max-w-6xl mx-auto px-8 py-5">
          <div className="flex flex-col md:flex-row justify-center items-center gap-3 text-xs" style={{ 
            color: '#F8F6F3',
            opacity: 0.8
          }}>
            <p style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              © 2025 ThinkFit. Todos os direitos reservados.
            </p>
            <span className="hidden md:inline" style={{ color: '#C9A961' }}>•</span>
            <p className="flex items-center gap-1.5" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontWeight: 600 }}>
              Feito com{' '}
              <Heart className="w-3 h-3 fill-red-500 text-red-500" strokeWidth={1.5} /> 
              {' '}para um Natal especial
            </p>
          </div>
        </div>
      </div>
      
    </footer>
  )
}
