'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRedirecting, setIsRedirecting] = useState(false) // Flag para evitar múltiplos redirecionamentos
  const router = useRouter()

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        console.log('✅ [AuthContext] Sessão encontrada para:', session.user.email)
      }
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }).catch((err) => {
      console.error('❌ [AuthContext] Erro ao obter sessão:', err)
      setLoading(false)
    })

    // Ouvir mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 [AuthContext] Iniciando login para:', email)
      
      // Evitar múltiplos redirecionamentos
      if (isRedirecting) {
        console.log('⚠️ [AuthContext] Já está redirecionando, ignorando nova tentativa')
        return { error: null }
      }

      // Verificar se o Supabase está configurado
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        console.error('❌ [AuthContext] Variáveis de ambiente do Supabase não configuradas!')
        return { error: { message: 'Configuração do Supabase não encontrada. Verifique as variáveis de ambiente.' } }
      }

      console.log('📡 [AuthContext] Chamando Supabase signInWithPassword...')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('❌ [AuthContext] Erro no login:', error)
        console.error('❌ [AuthContext] Código do erro:', error.status)
        console.error('❌ [AuthContext] Mensagem:', error.message)
        return { error }
      }

      if (data.session) {
        console.log('✅ [AuthContext] Login bem-sucedido!')
        console.log('✅ [AuthContext] Sessão criada:', data.session.user.email)
        console.log('✅ [AuthContext] User ID:', data.session.user.id)
        
        // Marcar que estamos redirecionando
        setIsRedirecting(true)
        
        // Atualizar estado imediatamente
        setSession(data.session)
        setUser(data.session.user)
        setLoading(false)
        
        console.log('⏳ [AuthContext] Aguardando 500ms antes de redirecionar...')
        // Aguardar um pouco para garantir que a sessão está totalmente estabelecida
        // e que os cookies foram salvos no localStorage/cookies
        setTimeout(() => {
          console.log('🚀 [AuthContext] Redirecionando para /admin...')
          // Usar window.location para forçar um reload completo e garantir que os cookies sejam enviados
          window.location.href = '/admin'
        }, 500)
      } else {
        console.warn('⚠️ [AuthContext] Login retornou sem sessão!')
        return { error: { message: 'Login realizado mas nenhuma sessão foi criada' } }
      }

      return { error: null }
    } catch (err: any) {
      console.error('💥 [AuthContext] Exceção durante login:', err)
      setIsRedirecting(false) // Resetar flag em caso de erro
      return { error: { message: err.message || 'Erro ao fazer login' } }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setSession(null)
    setUser(null)
    router.push('/admin/login')
  }

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

