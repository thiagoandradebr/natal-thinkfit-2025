'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, Upload, Image as ImageIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import ImageUpload from '@/components/ImageUpload'

export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [config, setConfig] = useState({
    id: '',
    hero_titulo: '',
    hero_subtitulo: '',
    data_limite_pedidos: '',
    logo_url: '',
    telefone_whatsapp: ''
  })

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('configuracoes_site')
        .select('*')

      if (error) throw error
      
      if (data && data.length > 0) {
        // Converter array de chave-valor para objeto
        const configObj: any = { id: data[0].id }
        data.forEach((item: any) => {
          if (item.chave === 'hero_titulo') configObj.hero_titulo = item.valor || ''
          if (item.chave === 'hero_subtitulo') configObj.hero_subtitulo = item.valor || ''
          if (item.chave === 'data_limite_pedidos') configObj.data_limite_pedidos = item.valor || ''
          if (item.chave === 'logo_url') configObj.logo_url = item.valor || ''
          if (item.chave === 'telefone_whatsapp') configObj.telefone_whatsapp = item.valor || ''
        })
        
        setConfig({
          id: configObj.id,
          hero_titulo: configObj.hero_titulo || '',
          hero_subtitulo: configObj.hero_subtitulo || '',
          data_limite_pedidos: configObj.data_limite_pedidos || '',
          logo_url: configObj.logo_url || '',
          telefone_whatsapp: configObj.telefone_whatsapp || ''
        })
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      // Atualizar ou inserir cada configuração
      const configs = [
        { chave: 'hero_titulo', valor: config.hero_titulo },
        { chave: 'hero_subtitulo', valor: config.hero_subtitulo },
        { chave: 'data_limite_pedidos', valor: config.data_limite_pedidos },
        { chave: 'logo_url', valor: config.logo_url },
        { chave: 'telefone_whatsapp', valor: config.telefone_whatsapp }
      ]

      for (const cfg of configs) {
        // Verificar se já existe
        const { data: existing, error: checkError } = await supabase
          .from('configuracoes_site')
          .select('id')
          .eq('chave', cfg.chave)
          .maybeSingle()

        if (checkError && checkError.code !== 'PGRST116') {
          console.error(`Erro ao verificar ${cfg.chave}:`, checkError)
          throw checkError
        }

        if (existing) {
          // Atualizar
          const { error: updateError } = await supabase
            .from('configuracoes_site')
            .update({
              valor: cfg.valor || '',
              updated_at: new Date().toISOString()
            })
            .eq('chave', cfg.chave)

          if (updateError) {
            console.error(`Erro ao atualizar ${cfg.chave}:`, updateError)
            throw updateError
          }
        } else {
          // Inserir
          const { error: insertError } = await supabase
            .from('configuracoes_site')
            .insert({
              chave: cfg.chave,
              valor: cfg.valor || '',
              tipo: 'texto',
              updated_at: new Date().toISOString()
            })

          if (insertError) {
            console.error(`Erro ao inserir ${cfg.chave}:`, insertError)
            throw insertError
          }
        }
      }

      alert('Configurações salvas com sucesso!')
    } catch (error: any) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const handleLogoChange = (images: string[]) => {
    setConfig(prev => ({ ...prev, logo_url: images[0] || '' }))
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
          Configurações do Site
        </h1>
        <p className="font-body text-brown-medium">
          Gerencie as configurações gerais da landing page
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo */}
        <div className="bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-body text-xs uppercase tracking-wider text-brown-darkest mb-2">
                Logo do Site
              </h3>
              <p className="font-body text-xs text-brown-light">
                Logo que aparecerá no header e footer
              </p>
            </div>
            {config.logo_url && (
              <span className="font-body text-xs text-brown-medium bg-beige-lightest px-3 py-1">
                Logo adicionada
              </span>
            )}
          </div>
          
          <ImageUpload
            images={config.logo_url ? [config.logo_url] : []}
            onImagesChange={handleLogoChange}
            maxImages={1}
          />

          {config.logo_url && (
            <div className="mt-6 p-4 bg-beige-lightest border-l-4 border-gold-warm">
              <p className="font-body text-xs text-brown-medium mb-2">Preview da Logo:</p>
              <div className="bg-white p-4 inline-block">
                <img 
                  src={config.logo_url} 
                  alt="Logo Preview" 
                  className="h-12 object-contain"
                />
              </div>
            </div>
          )}

          <p className="mt-4 font-body text-xs text-brown-light">
            Recomendado: PNG transparente, altura mínima 200px
          </p>
        </div>

        {/* Hero Título */}
        <div className="bg-white p-8 shadow-sm">
          <label className="block font-body text-xs uppercase tracking-wider text-brown-darkest mb-3">
            Título do Hero
          </label>
          <input
            type="text"
            value={config.hero_titulo}
            onChange={(e) => setConfig(prev => ({ ...prev, hero_titulo: e.target.value }))}
            className="w-full px-4 py-3 border border-beige-medium focus:border-gold-warm focus:outline-none font-body text-sm"
            placeholder="Um Natal saudável e sofisticado"
          />
        </div>

        {/* Hero Subtítulo */}
        <div className="bg-white p-8 shadow-sm">
          <label className="block font-body text-xs uppercase tracking-wider text-brown-darkest mb-3">
            Subtítulo do Hero
          </label>
          <textarea
            value={config.hero_subtitulo}
            onChange={(e) => setConfig(prev => ({ ...prev, hero_subtitulo: e.target.value }))}
            rows={3}
            className="w-full px-4 py-3 border border-beige-medium focus:border-gold-warm focus:outline-none font-body text-sm resize-none"
            placeholder="Sobremesas autorais da Chef Juliana Andrade..."
          />
        </div>

        {/* Data Limite */}
        <div className="bg-white p-8 shadow-sm">
          <label className="block font-body text-xs uppercase tracking-wider text-brown-darkest mb-3">
            Data Limite de Pedidos
          </label>
          <input
            type="date"
            value={config.data_limite_pedidos}
            onChange={(e) => setConfig(prev => ({ ...prev, data_limite_pedidos: e.target.value }))}
            className="w-full px-4 py-3 border border-beige-medium focus:border-gold-warm focus:outline-none font-body text-sm"
          />
        </div>

        {/* Telefone WhatsApp */}
        <div className="bg-white p-8 shadow-sm">
          <label className="block font-body text-xs uppercase tracking-wider text-brown-darkest mb-3">
            Telefone WhatsApp para Notificações
          </label>
          <input
            type="tel"
            value={config.telefone_whatsapp}
            onChange={(e) => setConfig(prev => ({ ...prev, telefone_whatsapp: e.target.value }))}
            className="w-full px-4 py-3 border border-beige-medium focus:border-gold-warm focus:outline-none font-body text-sm"
            placeholder="5511999999999 (com código do país e DDD)"
          />
          <p className="mt-2 font-body text-xs text-brown-light">
            Formato: código do país + DDD + número (ex: 5511999999999). Após finalizar pedido, será aberto WhatsApp Web com mensagem pré-preenchida.
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
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </motion.button>
        </div>
      </form>
    </div>
  )
}
