'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Sparkles, Lock, Mail, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { signIn, user, loading: authLoading } = useAuth()
  const router = useRouter()

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/admin')
    }
  }, [user, authLoading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      setError(error.message || 'Erro ao fazer login. Verifique suas credenciais.')
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige-lightest">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wine"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-beige-lightest via-white to-beige-light p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-beige-medium">
          {/* Logo e Título */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-wine to-wine-dark rounded-full mb-4"
            >
              <Sparkles className="text-white w-8 h-8" />
            </motion.div>
            <h1 className="font-display text-3xl text-brown-darkest font-light mb-2">
              ThinkFit Admin
            </h1>
            <p className="font-body text-sm text-brown-medium">
              Painel Administrativo - Natal 2025
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block font-body text-xs uppercase tracking-wider text-brown-darkest mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-medium w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-beige-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-wine focus:border-transparent font-body text-brown-darkest"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block font-body text-xs uppercase tracking-wider text-brown-darkest mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-medium w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-12 py-3 border border-beige-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-wine focus:border-transparent font-body text-brown-darkest"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brown-medium hover:text-brown-darkest transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Erro */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-body"
              >
                {error}
              </motion.div>
            )}

            {/* Botão Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-wine to-wine-dark text-white py-3 rounded-lg font-body text-sm uppercase tracking-wider hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Entrando...
                </>
              ) : (
                <>
                  <Lock size={18} />
                  Entrar
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-beige-medium text-center">
            <p className="font-body text-xs text-brown-medium">
              © 2025 ThinkFit Brasil. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

