'use client'

import { useState, useEffect } from 'react'
import { Instagram, MessageCircle, Heart, Gift, Sparkles } from 'lucide-react'
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
    <footer className="relative bg-white text-[#1A1A1A] overflow-hidden">
      
      {/* Elementos decorativos - Estrelas nos cantos */}
      <div className="absolute top-8 right-12 opacity-20 pointer-events-none">
        <Sparkles className="w-32 h-32 text-[#1A1A1A]" strokeWidth={0.5} />
      </div>
      
      {/* Estrela centralizada na parte inferior esquerda */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 md:left-[25%] md:translate-x-0 opacity-15 pointer-events-none">
        <Sparkles className="w-24 h-24 text-[#1A1A1A]" strokeWidth={0.5} />
      </div>
      
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
                />
              ) : (
                <h3 className="font-bold text-6xl text-[#1A1A1A] mb-4 tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                  THINKFIT
                </h3>
              )}
            </div>
            
            {/* Botão NATAL 2025 */}
            <button 
              onClick={() => scrollToSection('cardapio')}
              className="mt-6 px-6 py-2.5 border-2 border-[#E0E0E0] rounded-lg font-bold text-sm text-[#1A1A1A] hover:border-[#1A1A1A] transition-all duration-200 flex items-center gap-2"
              style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
            >
              <Gift className="w-4 h-4" strokeWidth={2} />
              NATAL 2025
            </button>
          </div>
          
          {/* COLUNA 2: Navegação */}
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-bold text-[#1A1A1A] uppercase mb-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                NAVEGAÇÃO
              </h3>
            </div>
            
            <nav className="space-y-3">
              {navigationLinks.map((item) => (
                item.isExternal ? (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block text-sm text-[#1A1A1A] hover:text-[#1A1A1A] cursor-pointer"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
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
                    className="block text-sm text-[#1A1A1A] hover:text-[#1A1A1A] cursor-pointer"
                    style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
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
              <h3 className="text-xs font-bold text-[#1A1A1A] uppercase mb-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
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
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div className="flex-shrink-0">
                      <Icon className="w-5 h-5 text-[#1A1A1A]" strokeWidth={1.5} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#1A1A1A]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {social.label}
                      </span>
                      <span className="text-xs text-[#1A1A1A] opacity-70" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
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
      <div className="border-t border-[#E0E0E0]">
        <div className="max-w-6xl mx-auto px-8 py-5">
          <div className="flex flex-col md:flex-row justify-center items-center gap-3 text-xs text-[#1A1A1A] opacity-70">
            <p style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
              © 2025 ThinkFit. Todos os direitos reservados.
            </p>
            <span className="hidden md:inline">•</span>
            <p className="flex items-center gap-1.5" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
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
