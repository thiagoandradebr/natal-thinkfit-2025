import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // Verificar cookies do Supabase
  // O Supabase armazena a sessão em cookies no formato: sb-<project-ref>-auth-token
  const allCookies = req.cookies.getAll()
  
  // Verificar se há cookie de autenticação do Supabase
  // O Supabase usa cookies que contêm 'auth-token' no nome ou começam com 'sb-'
  const hasAuthToken = allCookies.some(
    cookie => {
      const name = cookie.name.toLowerCase()
      // Verificar múltiplos padrões de cookies do Supabase
      const isSupabaseCookie = 
        name.includes('auth-token') || 
        name.includes('sb-') ||
        name.startsWith('sb-') ||
        (name.includes('supabase') && name.includes('auth'))
      
      return isSupabaseCookie && cookie.value && cookie.value.length > 10
    }
  )

  // Proteção de rotas /admin/* é feita pelo AdminGuard no lado do cliente
  // O middleware não redireciona para evitar loops com cookies recém-criados

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}

