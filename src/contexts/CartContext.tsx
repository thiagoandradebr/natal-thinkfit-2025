'use client'

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { Produto, ItemPedido, VariacaoProduto } from '@/types/database'
import { storage, STORAGE_KEYS } from '@/lib/storage'

// Callback para notificação externa
let notifyCallback: ((message: string) => void) | null = null

export const setCartNotificationCallback = (callback: (message: string) => void) => {
  notifyCallback = callback
}

interface CartItem extends ItemPedido {
  produto: Produto
  variacao_id?: string
  variacao_nome?: string
  variacao_descricao?: string
}

interface CartContextType {
  cart: CartItem[]
  addToCart: (produto: Produto & { variacao_selecionada?: VariacaoProduto }) => void
  removeFromCart: (produtoId: string, variacaoId?: string) => void
  updateQuantity: (produtoId: string, delta: number, variacaoId?: string) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])

  // Carregar carrinho do storage ao montar
  useEffect(() => {
    const savedCart = storage.get<CartItem[]>(STORAGE_KEYS.CART)
    if (savedCart && Array.isArray(savedCart)) {
      try {
        setCart(savedCart)
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error)
        // Limpar carrinho corrompido
        storage.remove(STORAGE_KEYS.CART)
      }
    }
  }, [])

  // Salvar carrinho no storage sempre que mudar (com debounce)
  useEffect(() => {
    if (cart.length > 0) {
      const timer = setTimeout(() => {
        storage.set(STORAGE_KEYS.CART, cart)
      }, 300) // Debounce de 300ms para evitar muitas escritas
      
      return () => clearTimeout(timer)
    } else {
      // Se carrinho vazio, remover do storage
      storage.remove(STORAGE_KEYS.CART)
    }
  }, [cart])

  const addToCart = useCallback((produto: Produto & { variacao_selecionada?: VariacaoProduto }) => {
    setCart((prevCart) => {
      const variacaoId = produto.variacao_selecionada?.id
      const preco = produto.variacao_selecionada?.preco || produto.preco
      
      // Buscar item existente (mesmo produto e mesma variação)
      const existingItem = prevCart.find((item) => 
        item.produto_id === produto.id && 
        item.variacao_id === variacaoId
      )
      
      if (existingItem) {
        // Notificar que quantidade foi aumentada
        if (notifyCallback) {
          const variacaoNome = produto.variacao_selecionada?.nome_variacao
          const nomeCompleto = variacaoNome ? `${produto.nome} (${variacaoNome})` : produto.nome
          notifyCallback(`${nomeCompleto} adicionado novamente ao carrinho!`)
        }
        return prevCart.map((item) =>
          item.produto_id === produto.id && item.variacao_id === variacaoId
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        )
      } else {
        // Notificar que produto foi adicionado
        if (notifyCallback) {
          const variacaoNome = produto.variacao_selecionada?.nome_variacao
          const nomeCompleto = variacaoNome ? `${produto.nome} (${variacaoNome})` : produto.nome
          notifyCallback(`${nomeCompleto} adicionado ao carrinho! 🎄`)
        }
        
        // Rastrear evento AddToCart no Facebook Pixel
        if (typeof window !== 'undefined' && window.fbq) {
          try {
            window.fbq('track', 'AddToCart', {
              content_name: produto.nome,
              content_ids: [produto.id],
              content_type: 'product',
              value: preco,
              currency: 'BRL',
            })
          } catch (error) {
            console.error('Erro ao rastrear AddToCart:', error)
          }
        }
        
        return [
          ...prevCart,
          {
            produto_id: produto.id,
            variacao_id: variacaoId,
            variacao_nome: produto.variacao_selecionada?.nome_variacao,
            variacao_descricao: produto.variacao_selecionada?.descricao,
            nome: produto.nome,
            preco: preco,
            quantidade: 1,
            produto,
          },
        ]
      }
    })
  }, [])

  const removeFromCart = (produtoId: string, variacaoId?: string) => {
    setCart((prevCart) => 
      prevCart.filter((item) => 
        !(item.produto_id === produtoId && (variacaoId === undefined || item.variacao_id === variacaoId))
      )
    )
  }

  const updateQuantity = (produtoId: string, delta: number, variacaoId?: string) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.produto_id === produtoId && (variacaoId === undefined || item.variacao_id === variacaoId)
            ? { ...item, quantidade: Math.max(0, item.quantidade + delta) }
            : item
        )
        .filter((item) => item.quantidade > 0)
    )
  }

  const clearCart = () => {
    setCart([])
    storage.remove(STORAGE_KEYS.CART)
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.preco * item.quantidade, 0)
  }

  const getItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantidade, 0)
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart deve ser usado dentro de CartProvider')
  }
  return context
}

