import { createClient } from '@supabase/supabase-js'

// Configuração do cliente Supabase para uso no cliente (browser)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Verificar se as variáveis estão configuradas (apenas uma vez no carregamento)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Verificar apenas uma vez para evitar logs repetidos
  const checkedKey = '__supabase_checked__'
  if (!(window as any)[checkedKey]) {
    (window as any)[checkedKey] = true
    if (!supabaseUrl) {
      console.error('❌ [Supabase] NEXT_PUBLIC_SUPABASE_URL não está configurada!')
    } else {
      console.log('✅ [Supabase] URL configurada')
    }
    
    if (!supabaseAnonKey) {
      console.error('❌ [Supabase] NEXT_PUBLIC_SUPABASE_ANON_KEY não está configurada!')
    } else {
      console.log('✅ [Supabase] Anon Key configurada')
    }
  }
}

// Criar cliente com persistência de sessão em cookies
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
})

// Cliente Supabase com service role para operações administrativas (apenas server-side)
export const getServiceSupabase = () => {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!serviceRoleKey) {
    console.error('❌ SUPABASE_SERVICE_ROLE_KEY não está configurada!')
    console.error('📋 Variáveis de ambiente disponíveis:', {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌',
      SUPABASE_SERVICE_ROLE_KEY: '❌',
    })
    throw new Error('SUPABASE_SERVICE_ROLE_KEY não está configurada. Configure no arquivo .env.local')
  }
  
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL não está configurada')
  }
  
  return createClient(supabaseUrl, serviceRoleKey)
}
