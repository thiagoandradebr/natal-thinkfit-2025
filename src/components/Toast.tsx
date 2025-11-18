'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, X, Info, AlertCircle } from 'lucide-react'
import { useEffect } from 'react'

export type ToastType = 'success' | 'info' | 'warning' | 'error'

export interface ToastProps {
  message: string
  isVisible: boolean
  onClose: () => void
  duration?: number
  type?: ToastType
}

export default function Toast({ message, isVisible, onClose, duration = 4000, type = 'success' }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  const getTypeStyles = () => {
    switch (type) {
      case 'info':
        return {
          border: 'border-blue-300',
          bg: 'bg-blue-50',
          iconBg: 'bg-blue-100',
          icon: <Info size={20} className="text-blue-600" fill="currentColor" />,
        }
      case 'warning':
        return {
          border: 'border-amber-300',
          bg: 'bg-amber-50',
          iconBg: 'bg-amber-100',
          icon: <AlertCircle size={20} className="text-amber-600" fill="currentColor" />,
        }
      case 'error':
        return {
          border: 'border-red-300',
          bg: 'bg-red-50',
          iconBg: 'bg-red-100',
          icon: <AlertCircle size={20} className="text-red-600" fill="currentColor" />,
        }
      default: // success
        return {
          border: 'border-gold-warm/30',
          bg: 'bg-white',
          iconBg: 'bg-gold-warm/20',
          icon: <CheckCircle size={20} className="text-gold-warm" fill="currentColor" />,
        }
    }
  }

  const styles = getTypeStyles()

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="fixed top-24 right-6 z-[100] max-w-md"
        >
          <div className={`${styles.bg} shadow-2xl border-2 ${styles.border} rounded-lg p-4 flex items-start gap-3`}>
            <div className="flex-shrink-0 mt-0.5">
              <div className={`w-10 h-10 ${styles.iconBg} rounded-full flex items-center justify-center`}>
                {styles.icon}
              </div>
            </div>
            <div className="flex-1">
              <p className="font-body text-sm text-brown-darkest leading-relaxed">
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 text-brown-medium hover:text-brown-darkest transition-colors mt-0.5"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

