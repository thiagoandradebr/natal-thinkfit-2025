'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)
  const [hasRedirected, setHasRedirected] = useState(false)

  useEffect(() => {
    // Aguardar um tempo fixo para garantir que a verificação de auth foi feita
    const timer = setTimeout(() => {
      setIsChecking(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Não redirecionar se já estiver na página de login
    if (pathname === '/admin/login') {
      return
    }

    // Aguardar até que a verificação de autenticação esteja completa
    // IMPORTANTE: Aguardar mais tempo após login para dar tempo dos cookies serem estabelecidos
    if (!loading && !isChecking) {
      if (!user && !hasRedirected) {
        // Aguardar mais tempo antes de redirecionar
        // Isso evita redirecionar imediatamente após login quando os cookies ainda estão sendo estabelecidos
        const redirectTimer = setTimeout(() => {
          // Verificar novamente se ainda não há usuário antes de redirecionar
          // Isso evita redirecionar se o usuário foi autenticado durante o delay
          if (!user) {
            // Nenhum usuário encontrado, redirecionando para login
            setHasRedirected(true)
            router.replace('/admin/login')
          }
        }, 2000) // Aumentado para 2 segundos para dar mais tempo
        
        return () => clearTimeout(redirectTimer)
      } else if (user) {
        // Resetar flag de redirecionamento se o usuário estiver autenticado
        setHasRedirected(false)
      }
    }
  }, [user, loading, isChecking, router, pathname, hasRedirected])

  // Se estiver na página de login, não aplicar o guard
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Mostrar loading enquanto verifica
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige-lightest">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wine mx-auto mb-4"></div>
          <p className="font-body text-sm text-brown-medium">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Bloquear renderização se não autenticado
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-beige-lightest">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-wine mx-auto mb-4"></div>
          <p className="font-body text-sm text-brown-medium">Redirecionando para login...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

