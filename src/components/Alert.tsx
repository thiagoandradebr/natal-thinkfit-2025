'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Info, AlertCircle, CheckCircle, X, AlertTriangle } from 'lucide-react'
import { ReactNode, useEffect, useRef } from 'react'

export type AlertType = 'info' | 'warning' | 'error' | 'success'

interface AlertProps {
  message: string | ReactNode
  isVisible: boolean
  onClose: () => void
  duration?: number
  type?: AlertType
  title?: string
  actions?: ReactNode
}

export default function Alert({ 
  message, 
  isVisible, 
  onClose, 
  duration = 5000, 
  type = 'info',
  title,
  actions
}: AlertProps) {
  const getTypeStyles = () => {
    switch (type) {
      case 'info':
        return {
          border: 'border-[#4A7C2C]',
          bg: 'bg-gradient-to-br from-[#2D5016]/10 via-[#4A7C2C]/15 to-[#2D5016]/10',
          iconBg: 'bg-[#2D5016]',
          icon: <Info size={24} className="text-white" fill="currentColor" />,
          titleColor: 'text-[#2D5016]',
          textColor: 'text-[#1a3a0d]',
          shadow: 'shadow-[#2D5016]/30',
        }
      case 'warning':
        return {
          border: 'border-amber-400',
          bg: 'bg-gradient-to-br from-amber-50 via-amber-100/50 to-amber-50',
          iconBg: 'bg-amber-500',
          icon: <AlertTriangle size={24} className="text-white" fill="currentColor" />,
          titleColor: 'text-amber-900',
          textColor: 'text-amber-800',
          shadow: 'shadow-amber-200/50',
        }
      case 'error':
        return {
          border: 'border-red-400',
          bg: 'bg-gradient-to-br from-red-50 via-red-100/50 to-red-50',
          iconBg: 'bg-red-500',
          icon: <AlertCircle size={24} className="text-white" fill="currentColor" />,
          titleColor: 'text-red-900',
          textColor: 'text-red-800',
          shadow: 'shadow-red-200/50',
        }
      default: // success
        return {
          border: 'border-green-400',
          bg: 'bg-gradient-to-br from-green-50 via-green-100/50 to-green-50',
          iconBg: 'bg-green-500',
          icon: <CheckCircle size={24} className="text-white" fill="currentColor" />,
          titleColor: 'text-green-900',
          textColor: 'text-green-800',
          shadow: 'shadow-green-200/50',
        }
    }
  }

  const styles = getTypeStyles()
  const onCloseRef = useRef(onClose)

  // Atualizar ref quando onClose mudar
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  // Auto-close após a duração especificada
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onCloseRef.current()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 25
          }}
          className="fixed top-24 right-6 z-[100] max-w-md"
        >
          <div className={`${styles.bg} border-2 ${styles.border} rounded-xl p-5 shadow-2xl ${styles.shadow} relative overflow-hidden`}>
            {/* Decoração de fundo */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <div className="absolute top-4 right-4 w-24 h-24 border-2 border-current rounded-full"></div>
            </div>
            
            <div className="relative flex items-start gap-4">
              {/* Ícone */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className={`flex-shrink-0 ${styles.iconBg} rounded-full p-2.5 shadow-lg`}
              >
                {styles.icon}
              </motion.div>

              {/* Conteúdo */}
              <div className="flex-1 min-w-0">
                {title && (
                  <h4 className={`font-body font-semibold mb-1.5 ${styles.titleColor}`} style={{ fontSize: '15px' }}>
                    {title}
                  </h4>
                )}
                <div className={`font-body leading-relaxed ${styles.textColor}`} style={{ fontSize: '13px' }}>
                  {typeof message === 'string' ? (
                    <p>{message}</p>
                  ) : (
                    message
                  )}
                </div>
                
                {/* Ações customizadas */}
                {actions && (
                  <div className="mt-3 flex gap-2">
                    {actions}
                  </div>
                )}
              </div>

              {/* Botão fechar */}
              <button
                onClick={onClose}
                className={`flex-shrink-0 ${styles.textColor} hover:opacity-70 transition-opacity p-1 rounded-full hover:bg-white/20`}
              >
                <X size={18} />
              </button>
            </div>

            {/* Barra de progresso (opcional) */}
            {duration > 0 && (
              <motion.div
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
                className={`absolute bottom-0 left-0 h-1 ${styles.iconBg} opacity-30`}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

