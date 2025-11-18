'use client'

import { createContext, useContext, useState, ReactNode, useEffect, useRef, useCallback } from 'react'
import Toast from './Toast'
import type { ToastType } from './Toast'
import Alert from './Alert'
import type { AlertType } from './Alert'
import { setCartNotificationCallback } from '@/contexts/CartContext'

export interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
  showAlert: (message: string, type?: AlertType, title?: string, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ message: string; isVisible: boolean; type: ToastType }>({
    message: '',
    isVisible: false,
    type: 'success',
  })

  const [alert, setAlert] = useState<{ message: string; isVisible: boolean; type: AlertType; title?: string; duration?: number }>({
    message: '',
    isVisible: false,
    type: 'info',
  })

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, isVisible: true, type })
  }

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }))
  }

  const showAlert = (message: string, type: AlertType = 'info', title?: string, duration: number = 5000) => {
    setAlert({ message, isVisible: true, type, title, duration })
  }

  const hideAlert = useCallback(() => {
    setAlert((prev) => ({ ...prev, isVisible: false }))
  }, [])

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
    <ToastContext.Provider value={{ showToast, showAlert }}>
      {children}
      <Toast
        message={toast.message}
        isVisible={toast.isVisible}
        onClose={hideToast}
        type={toast.type}
      />
      <Alert
        message={alert.message}
        isVisible={alert.isVisible}
        onClose={hideAlert}
        type={alert.type}
        title={alert.title}
        duration={alert.duration}
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

