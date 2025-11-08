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

  // REMOVIDO: Redirecionamento automático quando user existe
  // Isso estava causando loop com o AdminGuard
  // Se o usuário já estiver autenticado, o middleware/AdminGuard cuidará do redirecionamento

  // REMOVIDO: Redirecionamento duplicado
  // O redirecionamento após login é feito pelo AuthContext no signIn
  // Isso evita múltiplos redirecionamentos e loops
  // Se o usuário já estiver autenticado ao acessar a página, o AdminGuard ou middleware cuidará disso

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    console.log('📝 [LoginPage] handleSubmit chamado!')
    console.log('📝 [LoginPage] Email:', email)
    console.log('📝 [LoginPage] Password:', password ? '***' : '(vazio)')
    console.log('📝 [LoginPage] Loading antes:', loading)
    console.log('📝 [LoginPage] AuthLoading:', authLoading)
    
    if (loading || authLoading) {
      console.warn('⚠️ [LoginPage] Já está processando, ignorando submit')
      return
    }
    
    setError(null)
    setLoading(true)

    try {
      console.log('📞 [LoginPage] Chamando signIn...')
      const { error } = await signIn(email, password)

      if (error) {
        console.error('❌ [LoginPage] Erro retornado do signIn:', error)
        // Se o erro for "Invalid login credentials", pode ser que o usuário não exista
        if (error.message?.includes('Invalid login credentials') || error.message?.includes('Invalid')) {
          setError('Credenciais inválidas. Verifique se o usuário existe no Supabase e se a senha está correta.')
        } else {
          setError(error.message || 'Erro ao fazer login. Verifique suas credenciais.')
        }
        setLoading(false)
      } else {
        console.log('✅ [LoginPage] Login bem-sucedido! Aguardando redirecionamento...')
        // Login bem-sucedido - o redirecionamento será feito pelo AuthContext
        // Manter loading true para mostrar o estado de "Entrando..."
        // O redirecionamento acontecerá automaticamente
      }
    } catch (err: any) {
      console.error('💥 [LoginPage] Exceção durante handleSubmit:', err)
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.')
      setLoading(false)
    }
  }

  // Se estiver carregando, mostrar loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige-lightest">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wine mx-auto mb-4"></div>
          <p className="font-body text-sm text-brown-medium">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // REMOVIDO: Redirecionamento automático quando user existe
  // Isso estava causando loop infinito com o AdminGuard
  // Se o usuário já estiver autenticado, ele pode usar o botão "Limpar sessão" ou
  // simplesmente acessar /admin diretamente

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-beige-lightest via-white to-beige-light p-6 relative overflow-hidden">
      {/* Background Decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-gold-warm/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-wine/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card de Login */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-gold-warm/20 relative overflow-hidden"
        >
          {/* Borda dourada superior */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-warm to-transparent" />
          
          {/* Logo e Título */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ scale: 0.8, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-wine via-wine-dark to-wine rounded-2xl mb-6 shadow-lg"
            >
              <Sparkles className="text-white w-10 h-10" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-4xl text-brown-darkest font-light mb-3 tracking-tight"
            >
              ThinkFit Admin
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="font-body text-sm text-brown-medium tracking-wide"
            >
              Painel Administrativo - Natal 2025
            </motion.p>
          </div>

          {/* Formulário */}
          <form 
            onSubmit={(e) => {
              console.log('🖱️ [LoginPage] Formulário onSubmit disparado')
              handleSubmit(e)
            }} 
            className="space-y-6"
          >
            {/* Email */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block font-body text-xs uppercase tracking-wider text-brown-darkest mb-3 font-semibold">
                Email
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-medium group-focus-within:text-gold-warm transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full pl-12 pr-4 py-4 border-2 border-beige-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-warm/50 focus:border-gold-warm bg-beige-lightest/50 font-body text-brown-darkest transition-all placeholder:text-brown-medium/50"
                  placeholder="seu@email.com"
                />
              </div>
            </motion.div>

            {/* Senha */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block font-body text-xs uppercase tracking-wider text-brown-darkest mb-3 font-semibold">
                Senha
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brown-medium group-focus-within:text-gold-warm transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full pl-12 pr-12 py-4 border-2 border-beige-medium rounded-xl focus:outline-none focus:ring-2 focus:ring-gold-warm/50 focus:border-gold-warm bg-beige-lightest/50 font-body text-brown-darkest transition-all placeholder:text-brown-medium/50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brown-medium hover:text-gold-warm transition-colors p-1 rounded-lg hover:bg-gold-warm/10"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </motion.div>

            {/* Erro */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="bg-red-50/90 border-2 border-red-200 text-red-700 px-5 py-4 rounded-xl text-sm font-body flex items-start gap-3 shadow-lg"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-5 h-5 rounded-full bg-red-200 flex items-center justify-center">
                    <span className="text-red-700 text-xs font-bold">!</span>
                  </div>
                </div>
                <p className="flex-1">{error}</p>
              </motion.div>
            )}

            {/* Botão Submit */}
            <motion.button
              type="submit"
              disabled={loading || authLoading}
              onClick={(e) => {
                console.log('🖱️ [LoginPage] Botão clicado')
                console.log('🖱️ [LoginPage] Loading:', loading)
                console.log('🖱️ [LoginPage] AuthLoading:', authLoading)
                console.log('🖱️ [LoginPage] Email:', email)
                console.log('🖱️ [LoginPage] Password:', password ? '***' : '(vazio)')
                if (loading || authLoading) {
                  console.warn('⚠️ [LoginPage] Botão desabilitado!')
                  e.preventDefault()
                }
              }}
              whileHover={{ scale: loading || authLoading ? 1 : 1.02 }}
              whileTap={{ scale: loading || authLoading ? 1 : 0.98 }}
              className="w-full bg-gradient-to-r from-wine via-wine-dark to-wine text-white py-4 rounded-xl font-body text-sm uppercase tracking-wider hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
            >
              {/* Efeito de brilho no hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Entrando...</span>
                </>
              ) : (
                <>
                  <Lock size={18} className="relative z-10" />
                  <span className="relative z-10">Entrar</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-10 pt-6 border-t border-beige-medium/50 text-center space-y-3"
          >
            <p className="font-body text-xs text-brown-medium/70">
              © 2025 ThinkFit Brasil. Todos os direitos reservados.
            </p>
            {/* Botão para limpar sessão se houver problema */}
            {user && (
              <button
                onClick={async () => {
                  console.log('🧹 [LoginPage] Limpando sessão...')
                  const { supabase } = await import('@/lib/supabase')
                  await supabase.auth.signOut()
                  window.location.reload()
                }}
                className="text-xs text-red-600 hover:text-red-800 underline transition-colors font-medium"
              >
                Limpar sessão e tentar novamente
              </button>
            )}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  )
}

