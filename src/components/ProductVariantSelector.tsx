'use client'

import { useState, useEffect } from 'react'
import { VariacaoProduto } from '@/types/database'

interface ProductVariantSelectorProps {
  variants: VariacaoProduto[]
  onSelect: (variant: VariacaoProduto) => void
  selectedVariantId?: string
  isMobile?: boolean
}

export default function ProductVariantSelector({ 
  variants, 
  onSelect, 
  selectedVariantId,
  isMobile = false 
}: ProductVariantSelectorProps) {
  const [selected, setSelected] = useState<string>(selectedVariantId || '')

  useEffect(() => {
    if (!selected && variants.length > 0) {
      // Selecionar variação padrão ou primeira
      const defaultVariant = variants.find(v => v.is_default) || variants[0]
      if (defaultVariant) {
        setSelected(defaultVariant.id)
        onSelect(defaultVariant)
      }
    }
  }, [variants, selected, onSelect])

  useEffect(() => {
    if (selectedVariantId && selectedVariantId !== selected) {
      setSelected(selectedVariantId)
    }
  }, [selectedVariantId])

  const handleSelect = (variantId: string) => {
    setSelected(variantId)
    const variant = variants.find(v => v.id === variantId)
    if (variant) {
      onSelect(variant)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  if (!variants || variants.length === 0) return null

  // Se só tem uma variação, mostrar informação sem seletor
  if (variants.length === 1) {
    const variant = variants[0]
    return (
      <div className="mt-4">
        {variant.descricao && (
          <p className="text-sm text-gray-600 mb-2">{variant.descricao}</p>
        )}
        <p className="text-2xl font-bold text-gold-dark">
          {formatPrice(variant.preco)}
        </p>
      </div>
    )
  }

  // Mobile: usar select dropdown se mais de 3 variações
  const useMobileView = isMobile && variants.length > 3

  if (useMobileView) {
    return (
      <div>
        <select
          value={selected}
          onChange={(e) => handleSelect(e.target.value)}
          className="w-full px-3 py-2 border border-beige-medium rounded-md focus:border-gold-warm focus:ring-1 focus:ring-gold-warm/20 transition-all font-body text-sm bg-white"
        >
          {variants.map((variant) => (
            <option key={variant.id} value={variant.id}>
              {variant.nome_variacao} - {formatPrice(variant.preco)}
              {variant.descricao ? ` (${variant.descricao})` : ''}
            </option>
          ))}
        </select>
      </div>
    )
  }

  // Desktop: radio buttons compacto
  return (
    <div>
      <div className="space-y-1.5">
        {variants.map((variant) => (
          <label
            key={variant.id}
            className={`
              flex items-center justify-between px-3 py-2 rounded-md border cursor-pointer transition-all
              ${selected === variant.id 
                ? 'border-gold-warm bg-gold-warm/5' 
                : 'border-beige-medium hover:border-gold-warm/50'
              }
            `}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <input
                type="radio"
                name="variant"
                value={variant.id}
                checked={selected === variant.id}
                onChange={() => handleSelect(variant.id)}
                className="w-3.5 h-3.5 text-gold-warm focus:ring-gold-warm flex-shrink-0"
              />
              
              <div className="min-w-0 flex-1">
                <p className="font-medium text-brown-darkest text-sm truncate">{variant.nome_variacao}</p>
                {variant.descricao && (
                  <p className="text-xs text-brown-medium truncate">{variant.descricao}</p>
                )}
              </div>
            </div>
            
            <p className="text-sm font-bold text-gold-dark ml-2 flex-shrink-0">
              {formatPrice(variant.preco)}
            </p>
          </label>
        ))}
      </div>
    </div>
  )
}

