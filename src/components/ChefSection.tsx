'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChefHat, Star, Heart } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ChefConfig {
  nome: string
  foto_url: string | null
  bio: string | null
}

export default function ChefSection() {
  const [chefConfig, setChefConfig] = useState<ChefConfig>({
    nome: 'Chef Juliana Andrade',
    foto_url: null,
    bio: null
  })

  useEffect(() => {
    loadChefConfig()
  }, [])

  const loadChefConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('chef_config')
        .select('nome, foto_url, bio')
        .single()

      if (error) throw error
      if (data) {
        setChefConfig(data)
      }
    } catch (error) {
      console.error('Erro ao carregar config da chef:', error)
    }
  }

  return (
    <section id="chef" className="relative py-20 md:py-24 px-6 bg-forest overflow-hidden">
      {/* Base verde escuro */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a3d0a] via-[#2d5016] to-[#1a2b10]" />
      
      {/* Padrão de pontos sofisticado com máscara radial */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(196, 160, 90, 0.4) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)',
        }}
      />
      
      {/* Padrão diamante/losango mais marcante */}
      <div 
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 50px, rgba(196, 160, 90, 0.25) 50px, rgba(196, 160, 90, 0.25) 100px),
            repeating-linear-gradient(-45deg, transparent, transparent 50px, rgba(196, 160, 90, 0.25) 50px, rgba(196, 160, 90, 0.25) 100px)
          `,
          backgroundSize: '100px 100px'
        }}
      />
      
      {/* Gradientes radiais com blur para profundidade e brilho */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-[#C4A05A]/20 via-[#C4A05A]/10 to-transparent rounded-full blur-[120px]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.3 }}
        className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] bg-gradient-to-tl from-[#C4A05A]/15 via-[#C4A05A]/8 to-transparent rounded-full blur-[100px]"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.6 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[80px]"
        style={{
          background: 'radial-gradient(circle, rgba(196, 160, 90, 0.1) 0%, rgba(196, 160, 90, 0.05) 50%, transparent 100%)'
        }}
      />
      
      {/* Overlay gradiente para profundidade e contraste */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1a3d0a]/95 via-[#2d5016]/90 to-[#1a2b10]/98" />
      
      {/* Linhas geométricas elegantes */}
      <div 
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage: `
            linear-gradient(90deg, transparent 0%, rgba(196, 160, 90, 0.3) 50%, transparent 100%),
            linear-gradient(0deg, transparent 0%, rgba(196, 160, 90, 0.2) 50%, transparent 100%)
          `,
          backgroundSize: '200px 200px, 200px 200px',
          backgroundPosition: '0 0, 0 0'
        }}
      />

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center relative z-10">
        {/* Imagem da Chef - Card Elevado */}
        <motion.div
          initial={{ opacity: 0, x: -50, scale: 0.95 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div 
            className="aspect-[3/4] bg-[#E8DCC8] flex items-center justify-center overflow-hidden rounded-lg"
            style={{
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(196, 160, 90, 0.3), inset 0 0 40px rgba(196, 160, 90, 0.1)',
              border: '3px solid rgba(196, 160, 90, 0.4)'
            }}
          >
            {chefConfig.foto_url ? (
              <img
                src={chefConfig.foto_url}
                alt={chefConfig.nome}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center space-y-4">
                <ChefHat size={64} className="text-gold-warm mx-auto" />
                <p className="font-display text-3xl text-brown-darkest">
                  {chefConfig.nome.split(' ').slice(0, 2).map((word, i) => (
                    <span key={i}>{word}<br/></span>
                  ))}
                </p>
              </div>
            )}
          </div>
          {/* Ornamento decorativo */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 0.2, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="absolute -bottom-8 -right-8 w-56 h-56 border-4 border-gold-warm opacity-20 -z-10 rounded-full"
          />
        </motion.div>

        {/* Conteúdo */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-6"
        >
          {/* Título Principal */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >

            <h3 
              className="font-display text-snow mb-6"
              style={{
                fontSize: '58px',
                fontWeight: 700,
                lineHeight: 1.0,
              }}
            >
              <span className="md:hidden">
                Paixão por<br />
                <span className="text-gold-warm" style={{ fontSize: '61px', fontWeight: 700 }}>confeitaria</span><br />
                saudável
              </span>
              <span className="hidden md:inline" style={{ fontSize: '72px' }}>
                Paixão por<br />
                <span className="text-gold-warm" style={{ fontSize: '76px', fontWeight: 700 }}>confeitaria</span><br />
                saudável
              </span>
            </h3>
            
            {/* Subtítulo com nome da Chef */}
            <div className="mb-6">
              <p className="font-display text-3xl md:text-4xl text-gold-warm font-light italic mb-2">
                {chefConfig.nome}
              </p>
              <div className="h-[2px] w-32 bg-gold-warm opacity-60" />
            </div>
          </motion.div>

          {/* Texto da Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-5 text-[#F5F1E8] font-body text-lg leading-relaxed"
            style={{ fontSize: '18px', lineHeight: 1.8 }}
          >
            {chefConfig.bio ? (
              <p className="whitespace-pre-line">{chefConfig.bio}</p>
            ) : (
              <>
                <p>
                  <span className="text-gold-warm font-semibold">{chefConfig.nome}</span> é especialista em confeitaria saudável e criadora das sobremesas autorais ThinkFit. Com mais de 15 anos de experiência, desenvolveu técnicas exclusivas para criar bolos sem glúten, zero lactose e low sugar sem comprometer sabor ou textura.
                </p>
                <p>
                  Sua filosofia é simples: <span className="italic text-gold-warm">"celebração e saúde podem caminhar juntas"</span>. Cada receita é cuidadosamente elaborada com ingredientes premium, adoçantes naturais e muito amor.
                </p>
                <p className="text-gold-warm font-semibold text-xl">
                  Este Natal, permita-se celebrar sem culpa com as criações exclusivas da Chef Juliana.
                </p>
              </>
            )}
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}

