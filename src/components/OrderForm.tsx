'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Trash2, Plus, Minus } from 'lucide-react'
import { Produto, ItemPedido } from '@/types/database'

interface CartItem extends ItemPedido {
  produto: Produto
}

interface OrderFormProps {
  produtos: Produto[]
}

export default function OrderForm({ produtos }: OrderFormProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    observacoes: '',
    aceitoTermos: false,
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Adicionar produto ao carrinho
  const addToCart = (produto: Produto) => {
    const existingItem = cart.find((item) => item.produto_id === produto.id)
    
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.produto_id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        )
      )
    } else {
      setCart([
        ...cart,
        {
          produto_id: produto.id,
          nome: produto.nome,
          preco: produto.preco,
          quantidade: 1,
          produto,
        },
      ])
    }
  }

  // Remover produto do carrinho
  const removeFromCart = (produtoId: string) => {
    setCart(cart.filter((item) => item.produto_id !== produtoId))
  }

  // Atualizar quantidade
  const updateQuantity = (produtoId: string, delta: number) => {
    setCart(
      cart
        .map((item) =>
          item.produto_id === produtoId
            ? { ...item, quantidade: Math.max(0, item.quantidade + delta) }
            : item
        )
        .filter((item) => item.quantidade > 0)
    )
  }

  // Calcular total
  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.preco * item.quantidade, 0)
  }

  // Formatar preço
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  // Enviar pedido
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (cart.length === 0) {
      setMessage({ type: 'error', text: 'Adicione pelo menos um produto ao carrinho!' })
      return
    }

    if (!formData.aceitoTermos) {
      setMessage({ type: 'error', text: 'Você precisa aceitar os termos para continuar.' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/pedido', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          itens: cart.map(({ produto, ...item }) => item),
          total: calculateTotal(),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirecionar para página de agradecimento
        window.location.href = '/obrigado'
      } else {
        setMessage({ type: 'error', text: data.error || 'Erro ao enviar pedido. Tente novamente.' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao enviar pedido. Verifique sua conexão.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="pedido" className="py-24 bg-[#F5F1E8]">
      <div className="container mx-auto px-4">
        {/* Container do Formulário */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white mx-auto"
          style={{
            maxWidth: '900px',
            padding: '80px 60px',
            boxShadow: '0 4px 40px rgba(62, 39, 35, 0.08)',
            borderRadius: '0px'
          }}
        >
          {/* Título e Subtítulo */}
          <div className="text-center mb-12">
            <h2 
              className="font-display font-light text-[#3E2723] mb-3"
              style={{ fontSize: '38px' }}
            >
              Faça Seu Pedido
            </h2>
            <p 
              className="font-body font-light text-[#8D6E63]"
              style={{ fontSize: '14px' }}
            >
              Selecione os produtos e preencha seus dados para finalizar
            </p>
          </div>

        <div className="space-y-12">
          {/* Seleção de Produtos */}
          <div>
            <label 
              className="block font-body font-medium text-[#6D4C41] uppercase mb-2"
              style={{ fontSize: '11px', letterSpacing: '1.5px' }}
            >
              Selecione os Produtos
            </label>
            <div className="space-y-3">
              {produtos
                .filter((p) => p.status === 'disponivel')
                .map((produto) => (
                  <div
                    key={produto.id}
                    className="flex items-center justify-between p-4 bg-[#FAFAF8] border border-[#E0DED9] transition-colors hover:border-[#B8860B]"
                    style={{ borderRadius: '0px' }}
                  >
                    <div className="flex-1">
                      <span className="font-body text-[#3E2723]" style={{ fontSize: '14px' }}>
                        {produto.nome} · {produto.tamanho} · {formatPrice(produto.preco)}
                      </span>
                    </div>
                    <button
                      onClick={() => addToCart(produto)}
                      className="bg-[#3E2723] text-white px-6 py-2 font-body font-medium uppercase hover:opacity-90 transition-opacity"
                      style={{ fontSize: '11px', letterSpacing: '1.5px', borderRadius: '0px' }}
                    >
                      Adicionar
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Carrinho */}
          {cart.length > 0 && (
            <div className="pb-8 border-b border-[#E0DED9]">
              <label 
                className="block font-body font-medium text-[#6D4C41] uppercase mb-4"
                style={{ fontSize: '11px', letterSpacing: '1.5px' }}
              >
                Seu Carrinho
              </label>
              <div className="space-y-3 mb-6">
                {cart.map((item) => (
                  <div key={item.produto_id} className="flex items-center justify-between p-4 bg-[#FAFAF8]">
                    <div className="flex-1">
                      <p className="font-body text-[#3E2723]" style={{ fontSize: '14px' }}>
                        {item.nome} · {item.quantidade}x
                      </p>
                      <p className="font-body text-[#8D6E63]" style={{ fontSize: '12px' }}>
                        {formatPrice(item.preco)} cada
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item.produto_id, -1)}
                        className="text-[#6D4C41] hover:text-[#3E2723]"
                      >
                        <Minus size={16} strokeWidth={1.5} />
                      </button>
                      <span className="font-body text-[#3E2723] w-8 text-center" style={{ fontSize: '14px' }}>
                        {item.quantidade}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.produto_id, 1)}
                        className="text-[#6D4C41] hover:text-[#3E2723]"
                      >
                        <Plus size={16} strokeWidth={1.5} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.produto_id)}
                        className="text-[#A1887F] hover:text-[#8D6E63] ml-2"
                      >
                        <Trash2 size={16} strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-[#E0DED9]">
                <span className="font-display text-[#3E2723]" style={{ fontSize: '24px', fontWeight: 400 }}>
                  Total
                </span>
                <span className="font-display text-[#8B6914]" style={{ fontSize: '36px', fontWeight: 500 }}>
                  {formatPrice(calculateTotal())}
                </span>
              </div>
            </div>
          )}

            {/* Formulário */}
            <form onSubmit={handleSubmit} className="space-y-6 pt-8">
              <div>
                <label 
                  className="block font-body font-medium text-[#6D4C41] uppercase mb-2"
                  style={{ fontSize: '11px', letterSpacing: '1.5px' }}
                >
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full bg-[#FAFAF8] text-[#3E2723] border border-[#E0DED9] px-5 py-4 font-body focus:border-[#B8860B] focus:outline-none transition-colors"
                  style={{ borderRadius: '0px', fontSize: '14px' }}
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label 
                  className="block font-body font-medium text-[#6D4C41] uppercase mb-2"
                  style={{ fontSize: '11px', letterSpacing: '1.5px' }}
                >
                  WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="w-full bg-[#FAFAF8] text-[#3E2723] border border-[#E0DED9] px-5 py-4 font-body focus:border-[#B8860B] focus:outline-none transition-colors"
                  style={{ borderRadius: '0px', fontSize: '14px' }}
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <label 
                  className="block font-body font-medium text-[#6D4C41] uppercase mb-2"
                  style={{ fontSize: '11px', letterSpacing: '1.5px' }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#FAFAF8] text-[#3E2723] border border-[#E0DED9] px-5 py-4 font-body focus:border-[#B8860B] focus:outline-none transition-colors"
                  style={{ borderRadius: '0px', fontSize: '14px' }}
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label 
                  className="block font-body font-medium text-[#6D4C41] uppercase mb-2"
                  style={{ fontSize: '11px', letterSpacing: '1.5px' }}
                >
                  Observações
                </label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                  className="w-full bg-[#FAFAF8] text-[#3E2723] border border-[#E0DED9] px-5 py-4 font-body focus:border-[#B8860B] focus:outline-none h-32 resize-none transition-colors"
                  style={{ borderRadius: '0px', fontSize: '14px' }}
                  placeholder="Alguma observação sobre seu pedido?"
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="termos"
                  checked={formData.aceitoTermos}
                  onChange={(e) => setFormData({ ...formData, aceitoTermos: e.target.checked })}
                  className="mt-1 w-4 h-4 border border-[#B8860B] checked:bg-[#B8860B] focus:ring-0 focus:ring-offset-0"
                  style={{ borderRadius: '0px' }}
                />
                <label htmlFor="termos" className="font-body text-[#6D4C41]" style={{ fontSize: '13px', lineHeight: '1.6' }}>
                  Aceito os termos e condições e autorizo o contato para confirmação do pedido *
                </label>
              </div>

              {message && (
                <div
                  className={`p-4 ${
                    message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                  style={{ borderRadius: '0px' }}
                >
                  <p className="font-body" style={{ fontSize: '14px' }}>{message.text}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || cart.length === 0}
                className="w-full bg-[#3E2723] text-white py-5 font-body font-medium uppercase hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ fontSize: '13px', letterSpacing: '2px', borderRadius: '0px', marginTop: '40px' }}
              >
                {loading ? 'ENVIANDO...' : 'ENVIAR PEDIDO'}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
