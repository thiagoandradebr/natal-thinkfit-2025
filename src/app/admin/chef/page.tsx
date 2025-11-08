'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Upload } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import ImageUpload from '@/components/ImageUpload'

export default function ChefConfigPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [config, setConfig] = useState({
    id: '',
    nome: 'Chef Juliana Andrade',
    foto_url: '',
    bio: ''
  })

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('chef_config')
        .select('*')
        .single()

      if (error) throw error
      
      if (data) {
        setConfig({
          id: data.id,
          nome: data.nome,
          foto_url: data.foto_url || '',
          bio: data.bio || ''
        })
      }
    } catch (error) {
      console.error('Erro ao carregar configuração:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase
        .from('chef_config')
        .update({
          nome: config.nome,
          foto_url: config.foto_url,
          bio: config.bio,
          updated_at: new Date().toISOString()
        })
        .eq('id', config.id)

      if (error) throw error
      alert('Configuração salva com sucesso!')
    } catch (error: any) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleImageChange = (images: string[]) => {
    setConfig(prev => ({ ...prev, foto_url: images[0] || '' }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wine"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 relative"
      >
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-gold-warm/5 rounded-full blur-2xl" />
        <h1 className="font-display text-4xl text-brown-darkest mb-3 tracking-tight relative">
          Configuração da Chef
        </h1>
        <p className="font-body text-brown-medium relative">
          Gerencie as informações e foto da chef que aparecem na landing page
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nome Moderno */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-beige-medium/50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-warm/5 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="h-[3px] bg-gradient-to-r from-gold-warm via-gold to-gold-warm mb-6 relative z-10" />
          <label className="block font-body text-xs uppercase tracking-wider text-brown-darkest mb-4 font-semibold relative z-10">
            Nome da Chef
          </label>
          <input
            type="text"
            value={config.nome}
            onChange={(e) => setConfig(prev => ({ ...prev, nome: e.target.value }))}
            className="w-full px-4 py-4 border-2 border-beige-medium rounded-xl focus:border-gold-warm focus:ring-2 focus:ring-gold-warm/20 focus:outline-none font-body text-sm bg-beige-lightest/50 transition-all relative z-10"
            required
          />
        </motion.div>

        {/* Bio Moderna */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-beige-medium/50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-warm/5 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="h-[3px] bg-gradient-to-r from-gold-warm via-gold to-gold-warm mb-6 relative z-10" />
          <label className="block font-body text-xs uppercase tracking-wider text-brown-darkest mb-4 font-semibold relative z-10">
            Biografia
          </label>
          <textarea
            value={config.bio}
            onChange={(e) => setConfig(prev => ({ ...prev, bio: e.target.value }))}
            rows={4}
            className="w-full px-4 py-4 border-2 border-beige-medium rounded-xl focus:border-gold-warm focus:ring-2 focus:ring-gold-warm/20 focus:outline-none font-body text-sm resize-none bg-beige-lightest/50 transition-all relative z-10"
            placeholder="Conte um pouco sobre a chef..."
          />
        </motion.div>

        {/* Foto Moderna */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-beige-medium/50 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-warm/5 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="h-[3px] bg-gradient-to-r from-gold-warm via-gold to-gold-warm mb-6 relative z-10" />
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h3 className="font-display text-xl text-brown-darkest font-light">
              Foto da Chef
            </h3>
            {config.foto_url && (
              <span className="font-body text-xs text-gold-dark bg-gold-warm/10 px-4 py-2 rounded-lg font-semibold">
                Foto adicionada
              </span>
            )}
          </div>
          
          <div className="relative z-10">
            <ImageUpload
              images={config.foto_url ? [config.foto_url] : []}
              onImagesChange={handleImageChange}
              maxImages={1}
            />
          </div>

          <p className="mt-4 font-body text-xs text-brown-medium relative z-10">
            Recomendado: Foto vertical ou quadrada, mínimo 800x800px
          </p>
        </motion.div>

        {/* Actions Modernas */}
        <div className="flex items-center gap-4">
          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-wine via-wine-dark to-wine text-white px-8 py-5 font-body text-sm uppercase tracking-wider flex items-center gap-3 shadow-xl rounded-xl hover:shadow-2xl transition-all disabled:opacity-50 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Save size={20} className="relative z-10" />
            <span className="relative z-10 font-semibold">{saving ? 'Salvando...' : 'Salvar Configuração'}</span>
          </motion.button>
        </div>
      </form>
    </div>
  )
}
