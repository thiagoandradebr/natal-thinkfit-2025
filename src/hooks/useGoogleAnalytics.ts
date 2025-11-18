'use client'

import { useCallback } from 'react'

declare global {
  interface Window {
    dataLayer: any[]
    gtag: (
      command: string,
      targetId: string | Date,
      config?: Record<string, any>
    ) => void
  }
}

/**
 * Hook para disparar eventos do Google Analytics 4
 * 
 * @example
 * const { trackEvent, trackPurchase, trackAddToCart, trackBeginCheckout } = useGoogleAnalytics()
 * trackPurchase({ transaction_id: '123', value: 100.00, currency: 'BRL', items: [...] })
 */
export function useGoogleAnalytics() {
  const trackEvent = useCallback(
    (eventName: string, params?: Record<string, any>) => {
      if (typeof window === 'undefined' || !window.gtag) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[Google Analytics] Evento não disparado (gtag não inicializado):', eventName, params)
        }
        return
      }

      try {
        window.gtag('event', eventName, params || {})
        
        if (process.env.NODE_ENV === 'development') {
          console.log('[Google Analytics] Evento disparado:', eventName, params)
        }
      } catch (error) {
        console.error('[Google Analytics] Erro ao disparar evento:', error)
      }
    },
    []
  )

  const trackPurchase = useCallback(
    (transactionData: {
      transaction_id: string
      value: number
      currency: string
      items: Array<{
        item_id: string
        item_name: string
        quantity: number
        price: number
      }>
    }) => {
      trackEvent('purchase', {
        transaction_id: transactionData.transaction_id,
        value: transactionData.value,
        currency: transactionData.currency,
        items: transactionData.items,
      })
    },
    [trackEvent]
  )

  const trackAddToCart = useCallback(
    (itemData: {
      currency: string
      value: number
      items: Array<{
        item_id: string
        item_name: string
        quantity: number
        price: number
      }>
    }) => {
      trackEvent('add_to_cart', {
        currency: itemData.currency,
        value: itemData.value,
        items: itemData.items,
      })
    },
    [trackEvent]
  )

  const trackBeginCheckout = useCallback(
    (checkoutData: {
      currency: string
      value: number
      items: Array<{
        item_id: string
        item_name: string
        quantity: number
        price: number
      }>
    }) => {
      trackEvent('begin_checkout', {
        currency: checkoutData.currency,
        value: checkoutData.value,
        items: checkoutData.items,
      })
    },
    [trackEvent]
  )

  return {
    trackEvent,
    trackPurchase,
    trackAddToCart,
    trackBeginCheckout,
  }
}

