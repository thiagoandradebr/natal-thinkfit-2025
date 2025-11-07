'use client'

import { createContext, useContext, useState, ReactNode, useEffect, useRef } from 'react'
import Toast from './Toast'
import { setCartNotificationCallback } from '@/contexts/CartContext'

interface ToastContextType {
  showToast: (message: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ message: string; isVisible: boolean }>({
    message: '',
    isVisible: false,
  })

  const showToast = (message: string) => {
    setToast({ message, isVisible: true })
  }

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }))
  }

  // Conectar callback do carrinho com o toast usando useRef para evitar warning
  const showToastRef = useRef(showToast)
  
  useEffect(() => {
    showToastRef.current = showToast
  }, [showToast])

  useEffect(() => {
    // Usar requestAnimationFrame para garantir que está fora do ciclo de renderização
    const frameId = requestAnimationFrame(() => {
      setCartNotificationCallback((message: string) => {
        showToastRef.current(message)
      })
    })
    return () => cancelAnimationFrame(frameId)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (context === undefined) {
    throw new Error('useToast deve ser usado dentro de ToastProvider')
  }
  return context
}

