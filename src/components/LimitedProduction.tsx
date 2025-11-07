'use client'

import { motion } from 'framer-motion'

interface LimitedProductionProps {
  dataLimite?: string
}

export default function LimitedProduction({ dataLimite = '18/12/2025' }: LimitedProductionProps) {
  return (
    <section className="relative bg-[#3E2723] py-10 md:py-12 overflow-hidden">
      {/* Christmas Background Elements */}
      <div className="absolute inset-0">
        {/* Snowflakes */}
        <div className="absolute top-4 left-[10%] text-white/5 text-6xl">❄</div>
        <div className="absolute top-8 right-[15%] text-white/5 text-4xl">❄</div>
        <div className="absolute bottom-6 left-[20%] text-white/5 text-5xl">❄</div>
        <div className="absolute top-12 left-[70%] text-white/5 text-3xl">❄</div>
        <div className="absolute bottom-10 right-[25%] text-white/5 text-4xl">❄</div>
        
        {/* Pine branches */}
        <div className="absolute top-0 left-0 text-[#2D5016]/20 text-8xl transform -rotate-45">🌿</div>
        <div className="absolute top-0 right-0 text-[#2D5016]/20 text-8xl transform rotate-45">🌿</div>
        
        {/* Stars */}
        <div className="absolute top-6 left-[30%] text-gold-warm/10 text-2xl">✨</div>
        <div className="absolute bottom-8 right-[40%] text-gold-warm/10 text-xl">✨</div>
        
        {/* Ornaments */}
        <div className="absolute top-10 right-[10%] text-wine/20 text-3xl">●</div>
        <div className="absolute bottom-12 left-[15%] text-gold-warm/20 text-3xl">●</div>
      </div>
      
      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-4"
        >
          {/* Title */}
          <h2 className="font-display text-4xl md:text-5xl font-light text-white leading-tight">
            Produção Limitada
          </h2>

          {/* Description */}
          <p className="font-body text-sm text-white/60 max-w-xl mx-auto">
            Garanta já — produção artesanal e lotes limitados
          </p>

          {/* Divider */}
          <div className="w-16 h-px bg-gold-warm/30 mx-auto" />

          {/* Date */}
          <div className="inline-block">
            <p className="font-body text-xs uppercase tracking-[2.5px] text-white/40 mb-2">
              Encomendas até
            </p>
            <p className="font-display text-2xl font-light text-gold-warm">
              {dataLimite}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
