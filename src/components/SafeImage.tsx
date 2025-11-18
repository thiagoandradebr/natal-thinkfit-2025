'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface SafeImageProps {
  src: string | undefined | null
  alt: string
  className?: string
  fallback?: string
  onError?: () => void
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'sync' | 'auto'
  [key: string]: any // Para passar outras props do motion.img
}

/**
 * Componente de imagem com tratamento de erro
 * Exibe placeholder quando a imagem falha ao carregar
 */
export default function SafeImage({
  src,
  alt,
  className = '',
  fallback = '/images/placeholder.jpg',
  onError,
  loading = 'lazy',
  decoding = 'async',
  ...motionProps
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src || fallback)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError && imgSrc !== fallback) {
      setHasError(true)
      setImgSrc(fallback)
      if (onError) {
        onError()
      }
    }
  }

  // Se src mudar, resetar estado de erro
  if (src !== imgSrc && src !== undefined && !hasError) {
    setImgSrc(src || fallback)
  }

  return (
    <motion.img
      src={imgSrc}
      alt={alt}
      className={className}
      loading={loading}
      decoding={decoding}
      onError={handleError}
      {...motionProps}
    />
  )
}

