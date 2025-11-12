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
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }).catch((err) => {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao obter sessão:', err)
      }
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
      // Evitar múltiplos redirecionamentos
      if (isRedirecting) {
        return { error: null }
      }

      // Verificar se o Supabase está configurado
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      
      if (!supabaseUrl || !supabaseKey) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Variáveis de ambiente do Supabase não configuradas!')
        }
        return { error: { message: 'Configuração do Supabase não encontrada. Verifique as variáveis de ambiente.' } }
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Erro no login:', error)
        }
        return { error }
      }

      if (data.session) {
        // Marcar que estamos redirecionando
        setIsRedirecting(true)
        
        // Atualizar estado imediatamente
        setSession(data.session)
        setUser(data.session.user)
        setLoading(false)
        
        // Aguardar um pouco para garantir que a sessão está totalmente estabelecida
        // e que os cookies foram salvos no localStorage/cookies
        setTimeout(() => {
          // Usar window.location para forçar um reload completo e garantir que os cookies sejam enviados
          window.location.href = '/admin'
        }, 500)
      } else {
        return { error: { message: 'Login realizado mas nenhuma sessão foi criada' } }
      }

      return { error: null }
    } catch (err: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Exceção durante login:', err)
      }
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

