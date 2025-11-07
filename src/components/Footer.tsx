'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Youtube, Instagram, Mail, Sparkles, TreePine, ChevronRight } from 'lucide-react'
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

  return (
    <footer className="relative bg-[#1A0F08] overflow-hidden">
      {/* Subtle Snow Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10px`,
            }}
            animate={{
              y: ['0vh', '110vh'],
              opacity: [0, 0.1, 0.1, 0],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Top Border Gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Main Content */}
        <div className="grid md:grid-cols-12 gap-12 mb-16">
          {/* Brand Section - Larger */}
          <div className="md:col-span-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              {/* Logo */}
              <div className="mb-6">
                {logoUrl ? (
                  <div className="mb-4">
                    <img 
                      src={logoUrl} 
                      alt="ThinkFit" 
                      className="h-12 object-contain mb-3"
                    />
                    <div className="inline-block px-3 py-1 bg-[#D4AF37]/10 rounded-xl">
                      <span className="font-body text-xs uppercase tracking-[3px] text-[#D4AF37] font-semibold">
                        NATAL 2025
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <Sparkles className="text-[#D4AF37]" size={24} />
                      <h3 className="font-display text-4xl text-[#D4AF37] font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>
                        ThinkFit
                      </h3>
                    </div>
                    <div className="inline-block px-3 py-1 bg-[#D4AF37]/10 rounded-xl">
                      <span className="font-body text-xs uppercase tracking-[3px] text-[#D4AF37] font-semibold">
                        NATAL 2025
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="font-body text-[15px] text-[#D4C5B0] leading-[1.7] mb-8 max-w-[280px]">
                Sobremesas artesanais para um Natal especial. Zero açúcar, máximo sabor.
              </p>

              {/* Social Icons */}
              <div className="mt-12">
                <h4 className="font-body text-xs uppercase tracking-[2px] text-[#D4AF37] mb-4">
                  SIGA-NOS
                </h4>
                <div className="flex gap-4">
                  {[
                    { icon: Youtube, href: 'https://youtube.com/@codigofontetv', label: 'YouTube' },
                    { icon: Instagram, href: 'https://instagram.com/codigofontetv', label: 'Instagram' },
                    { icon: Mail, href: 'mailto:vendas@thinkfit.com.br', label: 'Email' }
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      target={social.icon !== Mail ? '_blank' : undefined}
                      rel={social.icon !== Mail ? 'noopener noreferrer' : undefined}
                      aria-label={social.label}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-11 h-11 flex items-center justify-center border-2 border-[#F5E6D3]/20 rounded-full bg-[#F5E6D3]/5 hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 hover:shadow-[0_4px_16px_rgba(212,175,55,0.2)] transition-all duration-300 group"
                    >
                      <social.icon size={18} className="text-[#F5E6D3] group-hover:text-[#D4AF37] transition-colors" strokeWidth={1.5} />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h4 className="font-body text-xs uppercase tracking-[2px] text-[#D4AF37] mb-6">
                NAVEGAÇÃO
              </h4>
              <ul className="space-y-[14px]">
                {[
                  { label: 'Cardápio', id: 'cardapio' },
                  { label: 'Diferenciais', id: 'diferenciais' }
                ].map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="font-body text-[15px] text-[#F5E6D3] hover:text-[#D4AF37] hover:underline hover:underline-offset-4 hover:decoration-[#D4AF37] hover:decoration-2 transition-all duration-300"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
              
              <h4 className="font-body text-xs uppercase tracking-[2px] text-[#D4AF37] mb-6 mt-8">
                SUPORTE
              </h4>
              <ul className="space-y-[14px]">
                {[
                  { label: 'FAQ', id: 'faq' },
                  { label: 'Fazer Pedido', id: 'pedido' }
                ].map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => scrollToSection(link.id)}
                      className="font-body text-[15px] text-[#F5E6D3] hover:text-[#D4AF37] hover:underline hover:underline-offset-4 hover:decoration-[#D4AF37] hover:decoration-2 transition-all duration-300"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* CTA Box Premium */}
              <motion.div 
                className="max-w-[320px] p-8 bg-gradient-to-br from-[#2D1810] to-[#1A0F08] border-2 border-[#D4AF37]/30 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex flex-col items-center text-center">
                  <TreePine size={48} className="text-[#D4AF37] mb-4" />
                  <p className="font-body text-[15px] text-[#D4C5B0] leading-[1.6] mb-6">
                    Encomende agora e celebre um Natal saudável e sofisticado
                  </p>
                  <motion.button
                    onClick={() => scrollToSection('pedido')}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-[14px] px-8 bg-[#D4AF37] hover:bg-[#FFD700] text-[#1A0F08] font-body text-[15px] font-semibold uppercase tracking-[1px] rounded-lg border-2 border-transparent shadow-[0_4px_16px_rgba(212,175,55,0.3)] transition-all duration-300"
                  >
                    FAZER PEDIDO
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="pt-8 border-t border-white/5"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-body text-[13px] text-[#D4C5B0]/60">
              © 2025 ThinkFit. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-2 font-body text-[13px] text-[#D4C5B0]">
              <span className="hover:text-[#D4AF37] transition-colors cursor-pointer">Conceito</span>
              <span className="text-[#D4C5B0]/40">•</span>
              <span className="hover:text-[#D4AF37] transition-colors cursor-pointer">Código Fonte TV</span>
              <span className="text-[#D4C5B0]/40">•</span>
              <span className="hover:text-[#D4AF37] transition-colors cursor-pointer">Ferramenta</span>
              <span className="text-[#D4C5B0]/40">•</span>
              <span className="hover:text-[#D4AF37] transition-colors cursor-pointer">Cursor</span>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
