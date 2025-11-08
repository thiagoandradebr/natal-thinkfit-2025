'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Loader2, Database, Image as ImageIcon } from 'lucide-react'
import { setupStorageBucket, checkStorageBucket } from '@/lib/setup-storage'

export default function SetupPage() {
  const [checking, setChecking] = useState(false)
  const [creating, setCreating] = useState(false)
  const [status, setStatus] = useState<{
    bucketExists: boolean | null
    message: string
    type: 'success' | 'error' | 'info'
  }>({
    bucketExists: null,
    message: 'Clique em "Verificar" para checar a configuração do Storage',
    type: 'info'
  })

  const handleCheck = async () => {
    setChecking(true)
    try {
      const result = await checkStorageBucket()
      
      if (result.exists) {
        setStatus({
          bucketExists: true,
          message: '✅ Bucket "natal-produtos" está configurado corretamente!',
          type: 'success'
        })
      } else {
        setStatus({
          bucketExists: false,
          message: '❌ Bucket "natal-produtos" não encontrado. Clique em "Criar Bucket" para configurar.',
          type: 'error'
        })
      }
    } catch (error) {
      setStatus({
        bucketExists: false,
        message: '❌ Erro ao verificar bucket. Verifique suas credenciais do Supabase.',
        type: 'error'
      })
    } finally {
      setChecking(false)
    }
  }

  const handleCreate = async () => {
    setCreating(true)
    try {
      const result = await setupStorageBucket()
      
      if (result.success) {
        setStatus({
          bucketExists: true,
          message: '✅ Bucket criado com sucesso! Você já pode fazer upload de imagens.',
          type: 'success'
        })
      } else {
        const errorMessage = result.error && typeof result.error === 'object' && 'message' in result.error 
          ? (result.error as any).message 
          : 'Erro desconhecido'
        setStatus({
          bucketExists: false,
          message: `❌ Erro ao criar bucket: ${errorMessage}`,
          type: 'error'
        })
      }
    } catch (error: any) {
      setStatus({
        bucketExists: false,
        message: `❌ Erro ao criar bucket: ${error?.message || 'Erro desconhecido'}`,
        type: 'error'
      })
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="max-w-4xl">
      {/* Header Moderno */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 relative"
      >
        <div className="absolute -top-4 -left-4 w-32 h-32 bg-gold-warm/5 rounded-full blur-2xl" />
        <h2 className="font-display text-4xl text-brown-darkest font-light mb-3 tracking-tight relative">
          Configuração do Sistema
        </h2>
        <p className="font-body text-brown-medium text-sm relative">
          Configure o Supabase Storage para upload de imagens
        </p>
      </motion.div>

      {/* Setup Card Moderno */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-beige-medium/50 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold-warm/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="h-[3px] bg-gradient-to-r from-gold-warm via-gold to-gold-warm mb-8 relative z-10" />

        {/* Storage Section Moderno */}
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-wine to-wine-dark rounded-xl flex items-center justify-center shadow-lg">
              <ImageIcon className="text-white" size={28} />
            </div>
            <div>
              <h3 className="font-display text-2xl text-brown-darkest font-light mb-1">
                Supabase Storage
              </h3>
              <p className="font-body text-sm text-brown-medium">
                Bucket para armazenar fotos dos produtos
              </p>
            </div>
          </div>

          {/* Status Message */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 border-l-4 ${
              status.type === 'success'
                ? 'bg-green-50 border-green-500'
                : status.type === 'error'
                ? 'bg-red-50 border-red-500'
                : 'bg-blue-50 border-blue-500'
            }`}
          >
            <div className="flex items-start gap-3">
              {status.bucketExists === true && (
                <CheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
              )}
              {status.bucketExists === false && (
                <XCircle className="text-red-600 flex-shrink-0 mt-0.5" size={20} />
              )}
              {status.bucketExists === null && (
                <Database className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
              )}
              <p className="font-body text-sm text-brown-darkest">
                {status.message}
              </p>
            </div>
          </motion.div>

          {/* Actions Modernas */}
          <div className="flex items-center gap-4">
            <motion.button
              onClick={handleCheck}
              disabled={checking}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-forest via-forest-dark to-forest text-white px-8 py-5 font-body text-sm uppercase tracking-wider flex items-center gap-3 shadow-xl rounded-xl hover:shadow-2xl transition-all disabled:opacity-50 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              {checking ? (
                <>
                  <Loader2 size={20} className="animate-spin relative z-10" />
                  <span className="relative z-10 font-semibold">Verificando...</span>
                </>
              ) : (
                <>
                  <Database size={20} className="relative z-10" />
                  <span className="relative z-10 font-semibold">Verificar Bucket</span>
                </>
              )}
            </motion.button>

            {status.bucketExists === false && (
              <motion.button
                onClick={handleCreate}
                disabled={creating}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-wine via-wine-dark to-wine text-white px-8 py-5 font-body text-sm uppercase tracking-wider flex items-center gap-3 shadow-xl rounded-xl hover:shadow-2xl transition-all disabled:opacity-50 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                {creating ? (
                  <>
                    <Loader2 size={20} className="animate-spin relative z-10" />
                    <span className="relative z-10 font-semibold">Criando...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon size={20} className="relative z-10" />
                    <span className="relative z-10 font-semibold">Criar Bucket</span>
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>

        {/* Instructions Modernas */}
        <div className="mt-8 pt-8 border-t border-beige-medium/50 relative z-10">
          <h4 className="font-display text-xl text-brown-darkest font-light mb-4">
            Instruções Manuais (se necessário)
          </h4>
          <div className="space-y-4 font-body text-sm text-brown-medium bg-beige-lightest/50 p-6 rounded-xl">
            <p className="font-semibold">Se a criação automática falhar, siga estes passos no Dashboard do Supabase:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Acesse <strong>Storage</strong> no menu lateral</li>
              <li>Clique em <strong>New bucket</strong></li>
              <li>Nome: <code className="bg-white px-3 py-1.5 text-xs rounded-lg font-mono font-semibold text-wine">natal-produtos</code></li>
              <li>Marque <strong>Public bucket</strong> ✅</li>
              <li>Clique em <strong>Create bucket</strong></li>
            </ol>
            <p className="mt-4 pt-4 border-t border-beige-medium">
              Documentação completa: 
              <a 
                href="/STORAGE_SETUP.md" 
                target="_blank"
                className="text-wine hover:text-wine-dark underline ml-1 font-semibold"
              >
                STORAGE_SETUP.md
              </a>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Info Cards Modernos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-beige-medium/50"
        >
          <h4 className="font-display text-lg text-brown-darkest font-light mb-4">
            Configurações do Bucket
          </h4>
          <ul className="space-y-3 font-body text-sm text-brown-medium">
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gold-warm rounded-full" />
              <strong>Nome:</strong> natal-produtos
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gold-warm rounded-full" />
              <strong>Tipo:</strong> Público
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gold-warm rounded-full" />
              <strong>Tamanho máximo:</strong> 5MB
            </li>
            <li className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-gold-warm rounded-full" />
              <strong>Formatos:</strong> PNG, JPG, WEBP
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-beige-medium/50"
        >
          <h4 className="font-display text-lg text-brown-darkest font-light mb-4">
            Próximos Passos
          </h4>
          <ul className="space-y-3 font-body text-sm text-brown-medium">
            <li className="flex items-center gap-2">
              <CheckCircle size={16} className="text-forest" />
              Verificar bucket
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={16} className="text-forest" />
              Criar bucket (se necessário)
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={16} className="text-forest" />
              Testar upload em Produtos
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle size={16} className="text-forest" />
              Configurar políticas RLS
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
