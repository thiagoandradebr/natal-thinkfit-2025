'use client'

import { useEffect } from 'react'
import { storage, STORAGE_KEYS } from '@/lib/storage'

/**
 * Hook para salvar e restaurar posição de scroll
 */
export function useScrollPosition() {
  useEffect(() => {
    // Restaurar posição de scroll salva
    const savedScroll = storage.get<number>('thinkfit-scroll-position')
    if (savedScroll) {
      window.scrollTo(0, savedScroll)
      // Limpar após restaurar
      storage.remove('thinkfit-scroll-position')
    }

    // Salvar posição de scroll ao sair da página
    const handleBeforeUnload = () => {
      storage.set('thinkfit-scroll-position', window.scrollY)
    }

    // Salvar posição periodicamente (a cada 1 segundo)
    const interval = setInterval(() => {
      storage.set('thinkfit-scroll-position', window.scrollY)
    }, 1000)

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
      clearInterval(interval)
    }
  }, [])
}

