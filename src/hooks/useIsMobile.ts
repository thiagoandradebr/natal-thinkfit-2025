'use client'

import { useState, useEffect } from 'react'

/**
 * Hook compartilhado para detectar mobile
 * Evita criar múltiplos event listeners de resize
 */
let mobileState = typeof window !== 'undefined' ? window.innerWidth < 768 : false
let listeners: Set<(isMobile: boolean) => void> = new Set()

if (typeof window !== 'undefined') {
  const handleResize = () => {
    const newMobileState = window.innerWidth < 768
    if (newMobileState !== mobileState) {
      mobileState = newMobileState
      listeners.forEach(listener => listener(mobileState))
    }
  }
  
  window.addEventListener('resize', handleResize, { passive: true })
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(mobileState)

  useEffect(() => {
    const listener = (value: boolean) => setIsMobile(value)
    listeners.add(listener)
    
    return () => {
      listeners.delete(listener)
    }
  }, [])

  return isMobile
}

