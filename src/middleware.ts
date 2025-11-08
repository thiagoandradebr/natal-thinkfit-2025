import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  // Verificar cookies do Supabase
  // O Supabase armazena a sessão em cookies no formato: sb-<project-ref>-auth-token
  const allCookies = req.cookies.getAll()
  
  // Verificar se há cookie de autenticação do Supabase
  // O Supabase usa cookies que contêm 'auth-token' no nome
  const hasAuthToken = allCookies.some(
    cookie => {
      const name = cookie.name.toLowerCase()
      return (name.includes('auth-token') || name.includes('sb-')) && cookie.value && cookie.value.length > 10
    }
  )

  // Proteger rotas /admin/* (exceto /admin/login)
  if (req.nextUrl.pathname.startsWith('/admin') && !req.nextUrl.pathname.startsWith('/admin/login')) {
    if (!hasAuthToken) {
      // Redirecionar para login se não autenticado
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/admin/login'
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Redirecionar de /admin/login para /admin se já autenticado
  if (req.nextUrl.pathname === '/admin/login' && hasAuthToken) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/admin'
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
}

