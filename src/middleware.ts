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

  // Proteger rotas /admin/* (exceto /admin/login e /api)
  // DESABILITADO TEMPORARIAMENTE: O middleware estava causando loops
  // Deixar apenas o AdminGuard fazer a verificação no lado do cliente
  // O middleware pode não detectar cookies recém-criados após login
  // if (
  //   req.nextUrl.pathname.startsWith('/admin') && 
  //   !req.nextUrl.pathname.startsWith('/admin/login') &&
  //   !req.nextUrl.pathname.startsWith('/api')
  // ) {
  //   if (!hasAuthToken) {
  //     const redirectUrl = req.nextUrl.clone()
  //     redirectUrl.pathname = '/admin/login'
  //     return NextResponse.redirect(redirectUrl)
  //   }
  // }

  // NÃO redirecionar de /admin/login para /admin no middleware
  // Deixar o AuthContext e a página de login fazerem isso no lado do cliente
  // Isso evita loops de redirecionamento

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}

