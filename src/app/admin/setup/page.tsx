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
      {/* Header */}
      <div className="mb-8">
        <h2 className="font-display text-3xl text-brown-darkest font-light mb-2">
          Configuração do Sistema
        </h2>
        <p className="font-body text-brown-medium text-sm">
          Configure o Supabase Storage para upload de imagens
        </p>
      </div>

      {/* Setup Card */}
      <div className="bg-white p-8 shadow-sm">
        <div className="h-1 bg-gradient-to-r from-gold-warm via-gold to-gold-warm mb-8" />

        {/* Storage Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-beige-lightest flex items-center justify-center">
              <ImageIcon className="text-wine" size={24} />
            </div>
            <div>
              <h3 className="font-body text-sm uppercase tracking-wider text-brown-darkest font-medium">
                Supabase Storage
              </h3>
              <p className="font-body text-xs text-brown-medium">
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

          {/* Actions */}
          <div className="flex items-center gap-4">
            <motion.button
              onClick={handleCheck}
              disabled={checking}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="bg-gradient-to-r from-forest to-forest-dark text-white px-8 py-4 font-body text-sm uppercase tracking-[2px] flex items-center gap-3 shadow-lg disabled:opacity-50"
            >
              {checking ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Verificando...
                </>
              ) : (
                <>
                  <Database size={18} />
                  Verificar Bucket
                </>
              )}
            </motion.button>

            {status.bucketExists === false && (
              <motion.button
                onClick={handleCreate}
                disabled={creating}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-wine to-wine-dark text-white px-8 py-4 font-body text-sm uppercase tracking-[2px] flex items-center gap-3 shadow-lg disabled:opacity-50"
              >
                {creating ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <ImageIcon size={18} />
                    Criar Bucket
                  </>
                )}
              </motion.button>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 pt-8 border-t border-beige-medium">
          <h4 className="font-body text-xs uppercase tracking-wider text-brown-darkest mb-4 font-medium">
            Instruções Manuais (se necessário)
          </h4>
          <div className="space-y-3 font-body text-sm text-brown-medium">
            <p>Se a criação automática falhar, siga estes passos no Dashboard do Supabase:</p>
            <ol className="list-decimal list-inside space-y-2 ml-4">
              <li>Acesse <strong>Storage</strong> no menu lateral</li>
              <li>Clique em <strong>New bucket</strong></li>
              <li>Nome: <code className="bg-beige-lightest px-2 py-1 text-xs">natal-produtos</code></li>
              <li>Marque <strong>Public bucket</strong> ✅</li>
              <li>Clique em <strong>Create bucket</strong></li>
            </ol>
            <p className="mt-4">
              Documentação completa: 
              <a 
                href="/STORAGE_SETUP.md" 
                target="_blank"
                className="text-wine hover:text-wine-dark underline ml-1"
              >
                STORAGE_SETUP.md
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 shadow-sm">
          <h4 className="font-body text-xs uppercase tracking-wider text-brown-darkest mb-3 font-medium">
            Configurações do Bucket
          </h4>
          <ul className="space-y-2 font-body text-sm text-brown-medium">
            <li>• <strong>Nome:</strong> natal-produtos</li>
            <li>• <strong>Tipo:</strong> Público</li>
            <li>• <strong>Tamanho máximo:</strong> 5MB</li>
            <li>• <strong>Formatos:</strong> PNG, JPG, WEBP</li>
          </ul>
        </div>

        <div className="bg-white p-6 shadow-sm">
          <h4 className="font-body text-xs uppercase tracking-wider text-brown-darkest mb-3 font-medium">
            Próximos Passos
          </h4>
          <ul className="space-y-2 font-body text-sm text-brown-medium">
            <li>✅ Verificar bucket</li>
            <li>✅ Criar bucket (se necessário)</li>
            <li>✅ Testar upload em Produtos</li>
            <li>✅ Configurar políticas RLS</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
