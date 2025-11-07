'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, X } from 'lucide-react'
import { useEffect } from 'react'

interface ToastProps {
  message: string
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export default function Toast({ message, isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

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
          <div className="bg-white shadow-2xl border-2 border-gold-warm/30 rounded-lg p-4 flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gold-warm/20 rounded-full flex items-center justify-center">
                <CheckCircle size={20} className="text-gold-warm" fill="currentColor" />
              </div>
            </div>
            <div className="flex-1">
              <p className="font-body text-sm text-brown-darkest">
                {message}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 text-brown-medium hover:text-brown-darkest transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

