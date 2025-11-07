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
      <div className="mb-8">
        <h1 className="font-display text-4xl text-brown-darkest mb-2">
          Configuração da Chef
        </h1>
        <p className="font-body text-brown-medium">
          Gerencie as informações e foto da chef que aparecem na landing page
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nome */}
        <div className="bg-white p-8 shadow-sm">
          <label className="block font-body text-xs uppercase tracking-wider text-brown-darkest mb-3">
            Nome da Chef
          </label>
          <input
            type="text"
            value={config.nome}
            onChange={(e) => setConfig(prev => ({ ...prev, nome: e.target.value }))}
            className="w-full px-4 py-3 border border-beige-medium focus:border-gold-warm focus:outline-none font-body text-sm"
            required
          />
        </div>

        {/* Bio */}
        <div className="bg-white p-8 shadow-sm">
          <label className="block font-body text-xs uppercase tracking-wider text-brown-darkest mb-3">
            Biografia
          </label>
          <textarea
            value={config.bio}
            onChange={(e) => setConfig(prev => ({ ...prev, bio: e.target.value }))}
            rows={4}
            className="w-full px-4 py-3 border border-beige-medium focus:border-gold-warm focus:outline-none font-body text-sm resize-none"
            placeholder="Conte um pouco sobre a chef..."
          />
        </div>

        {/* Foto */}
        <div className="bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-body text-xs uppercase tracking-wider text-brown-darkest">
              Foto da Chef
            </h3>
            {config.foto_url && (
              <span className="font-body text-xs text-brown-medium bg-beige-lightest px-3 py-1">
                Foto adicionada
              </span>
            )}
          </div>
          
          <ImageUpload
            images={config.foto_url ? [config.foto_url] : []}
            onImagesChange={handleImageChange}
            maxImages={1}
          />

          <p className="mt-4 font-body text-xs text-brown-light">
            Recomendado: Foto vertical ou quadrada, mínimo 800x800px
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <motion.button
            type="submit"
            disabled={saving}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-wine to-wine-dark text-white px-8 py-4 font-body text-sm uppercase tracking-[2px] flex items-center gap-3 shadow-lg disabled:opacity-50"
          >
            <Save size={18} />
            {saving ? 'Salvando...' : 'Salvar Configuração'}
          </motion.button>
        </div>
      </form>
    </div>
  )
}
