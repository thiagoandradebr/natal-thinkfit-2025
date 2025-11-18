'use client'

import { useCallback } from 'react'

declare global {
  interface Window {
    fbq: (
      action: string,
      event: string,
      params?: Record<string, any>
    ) => void
  }
}

/**
 * Hook para disparar eventos do Facebook Pixel
 * 
 * @example
 * const { trackEvent } = useFacebookPixel()
 * trackEvent('Purchase', { value: 100.00, currency: 'BRL' })
 */
export function useFacebookPixel() {
  const trackEvent = useCallback(
    (eventName: string, params?: Record<string, any>) => {
      if (typeof window === 'undefined' || !window.fbq) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[Facebook Pixel] Evento não disparado (pixel não inicializado):', eventName, params)
        }
        return
      }

      try {
        window.fbq('track', eventName, params || {})
        
        if (process.env.NODE_ENV === 'development') {
          console.log('[Facebook Pixel] Evento disparado:', eventName, params)
        }
      } catch (error) {
        console.error('[Facebook Pixel] Erro ao disparar evento:', error)
      }
    },
    []
  )

  const trackCustomEvent = useCallback(
    (eventName: string, params?: Record<string, any>) => {
      if (typeof window === 'undefined' || !window.fbq) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[Facebook Pixel] Evento customizado não disparado:', eventName, params)
        }
        return
      }

      try {
        window.fbq('trackCustom', eventName, params || {})
        
        if (process.env.NODE_ENV === 'development') {
          console.log('[Facebook Pixel] Evento customizado disparado:', eventName, params)
        }
      } catch (error) {
        console.error('[Facebook Pixel] Erro ao disparar evento customizado:', error)
      }
    },
    []
  )

  return {
    trackEvent,
    trackCustomEvent,
  }
}

