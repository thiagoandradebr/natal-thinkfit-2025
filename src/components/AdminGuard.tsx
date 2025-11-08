'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Aguardar um pouco para garantir que a verificação de auth foi feita
    const timer = setTimeout(() => {
      setIsChecking(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!loading && !isChecking && !user) {
      router.replace('/admin/login')
    }
  }, [user, loading, isChecking, router])

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

