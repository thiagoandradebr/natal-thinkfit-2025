'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Star, Sparkles, Calendar, CheckCircle2, Gift, Heart, Phone } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { saveCheckoutForm, getCheckoutForm, clearCheckoutForm } from '@/lib/storage'

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, removeFromCart, updateQuantity, clearCart, getTotal } = useCart()
  
  // Carregar dados salvos do formulário
  const savedFormData = getCheckoutForm()
  const [formData, setFormData] = useState({
    nome: savedFormData?.nome || '',
    telefone: savedFormData?.telefone || '',
    endereco: savedFormData?.endereco || '',
    formaPagamento: (savedFormData?.formaPagamento || 'pix') as 'pix' | 'cartao',
    dataEntrega: (savedFormData?.dataEntrega || '') as '' | '24/12' | '30/12',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [pedidoConfirmado, setPedidoConfirmado] = useState(false)
  const [nomeCliente, setNomeCliente] = useState<string>('')

  // Salvar dados do formulário sempre que mudar (com debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.nome || formData.telefone || formData.endereco) {
        saveCheckoutForm(formData)
      }
    }, 500) // Debounce de 500ms
    
    return () => clearTimeout(timer)
  }, [formData])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (cart.length === 0) {
      setMessage({ type: 'error', text: 'Seu carrinho está vazio!' })
      return
    }

    if (!formData.nome || !formData.telefone || !formData.endereco || !formData.dataEntrega) {
      setMessage({ type: 'error', text: 'Preencha todos os campos obrigatórios, incluindo a data de entrega.' })
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
          nome: formData.nome,
          telefone: formData.telefone,
          email: '', // Não obrigatório no novo sistema
          endereco_entrega: formData.endereco,
          forma_pagamento: formData.formaPagamento,
          data_entrega: formData.dataEntrega,
          itens: cart.map(({ produto, ...item }) => ({
            produto_id: item.produto_id,
            variacao_id: item.variacao_id,
            variacao_nome: item.variacao_nome,
            variacao_descricao: item.variacao_descricao,
            nome: item.nome,
            preco: Number(item.preco),
            quantidade: Number(item.quantidade),
          })),
          total: getTotal(),
        }),
      })

      // Processar resposta JSON uma única vez
      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        if (process.env.NODE_ENV === 'development') {
          console.error('Erro ao processar JSON da resposta:', jsonError)
        }
        setMessage({ 
          type: 'error', 
          text: 'Erro ao processar resposta do servidor. Tente novamente.'
        })
        setLoading(false)
        return
      }

      // Verificar status da resposta
      if (!response.ok) {
        setMessage({ 
          type: 'error', 
          text: data.error || `Erro ao processar pedido (${response.status}). Tente novamente.`
        })
        setLoading(false)
        return
      }

      // Validar se o pedido foi realmente criado
      if (!data.success || !data.pedido_id) {
        setMessage({ 
          type: 'error', 
          text: data.error || 'Erro ao criar pedido. Por favor, tente novamente.'
        })
        setLoading(false)
        return
      }

      // Só limpar e mostrar sucesso se tudo estiver OK
      // Salvar nome do cliente antes de limpar o formulário
      setNomeCliente(formData.nome)
      
      // Marcar pedido como confirmado ANTES de qualquer outra ação
      setPedidoConfirmado(true)
      
      // Mostrar mensagem de sucesso IMEDIATAMENTE
      const pedidoIdShort = data.pedido_id.substring(0, 8).toUpperCase()
      setMessage({ 
        type: 'success', 
        text: pedidoIdShort // Passar apenas o ID, o texto será renderizado no componente
      })
      
      // Scroll para o topo para mostrar a mensagem
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 100)
      
      // Limpar carrinho e formulário após um delay maior para garantir que a mensagem apareça
      setTimeout(() => {
        clearCart()
        clearCheckoutForm()
        
        // Resetar formulário
        setFormData({
          nome: '',
          telefone: '',
          endereco: '',
          formaPagamento: 'pix',
          dataEntrega: '',
        })
      }, 1000) // Delay maior para garantir que a mensagem apareça primeiro
      
      setLoading(false)
    } catch (error: any) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao enviar pedido:', error)
      }
      setMessage({ 
        type: 'error', 
        text: `Erro ao enviar pedido: ${error?.message || 'Verifique sua conexão.'}` 
      })
      setLoading(false)
    }
  }

  // Mostrar tela de carrinho vazio apenas se não houver pedido confirmado E não houver mensagem de sucesso
  if (cart.length === 0 && !pedidoConfirmado && message?.type !== 'success') {
    return (
      <main className="min-h-screen bg-[#F5F1E8]">
        <Header />
        <div className="pt-32 pb-20 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <ShoppingCart size={64} className="text-brown-medium mx-auto mb-6 opacity-50" />
              <h1 className="font-display font-light text-[#3E2723] mb-4" style={{ fontSize: '38px' }}>
                Seu carrinho está vazio
              </h1>
              <p className="font-body text-[#8D6E63] mb-8" style={{ fontSize: '16px' }}>
                Adicione produtos ao carrinho antes de finalizar o pedido.
              </p>
              <motion.button
                onClick={() => router.push('/#cardapio')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-wine text-white px-10 py-4 font-body text-sm uppercase tracking-[2px] flex items-center gap-3 mx-auto"
              >
                <ArrowLeft size={18} />
                Ver Cardápio
              </motion.button>
            </motion.div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  // Se pedido foi confirmado mas carrinho está vazio, mostrar apenas mensagem de sucesso
  if (pedidoConfirmado && cart.length === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#F5F1E8] via-[#FAF8F3] to-[#F5F1E8] relative overflow-hidden">
        {/* Decorações Natalinas Animadas */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute top-20 right-10 w-40 h-40 border-2 border-gold-warm/30 rounded-full opacity-20"
          />
          <motion.div
            animate={{ 
              rotate: [360, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 25, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute bottom-40 left-10 w-32 h-32 border-2 border-sage/30 rounded-full opacity-20"
          />
          <motion.div
            animate={{ 
              y: [0, -20, 0],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="absolute top-1/3 right-1/4"
          >
            <Sparkles size={32} className="text-gold-warm" />
          </motion.div>
          <motion.div
            animate={{ 
              y: [0, 15, 0],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 1
            }}
            className="absolute bottom-1/3 left-1/4"
          >
            <Star size={24} className="text-sage" fill="currentColor" />
          </motion.div>
        </div>

        <Header />
        <div className="pt-32 pb-20 px-6 relative z-10">
          <div className="max-w-3xl mx-auto">
            {message && message.type === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="bg-white rounded-lg shadow-2xl overflow-hidden"
                style={{ boxShadow: '0 20px 60px rgba(62, 39, 35, 0.15)' }}
              >
                {/* Borda superior decorativa */}
                <div className="h-2 bg-gradient-to-r from-gold-warm via-sage to-gold-warm" />
                
                <div className="p-10 md:p-12">
                  {/* Ícone de sucesso animado */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ 
                      delay: 0.2, 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 15 
                    }}
                    className="flex justify-center mb-6"
                  >
                    <div className="relative">
                      <div className="w-24 h-24 bg-gradient-to-br from-green-100 via-emerald-50 to-green-100 rounded-full flex items-center justify-center shadow-lg">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                        >
                          <CheckCircle2 size={48} className="text-green-600" fill="currentColor" />
                        </motion.div>
                      </div>
                      {/* Decoração natalina ao redor */}
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -top-2 -right-2"
                      >
                        <Star size={20} className="text-gold-warm" fill="currentColor" />
                      </motion.div>
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                        className="absolute -bottom-2 -left-2"
                      >
                        <Sparkles size={16} className="text-sage" />
                      </motion.div>
                    </div>
                  </motion.div>

                  {/* Título */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center mb-6"
                  >
                    <h2 className="font-display text-4xl md:text-5xl text-brown-darkest mb-3 font-light">
                      🎄 Pedido Recebido! 🎄
                    </h2>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <div className="h-[1px] w-12 bg-gold-warm"></div>
                      <Gift size={20} className="text-gold-warm" />
                      <div className="h-[1px] w-12 bg-gold-warm"></div>
                    </div>
                  </motion.div>

                  {/* Mensagem principal */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4 mb-8"
                  >
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border-2 border-green-200">
                      <p className="font-body text-brown-darkest leading-relaxed text-center mb-4" style={{ fontSize: '18px' }}>
                        <strong className="text-green-700">Obrigado{nomeCliente ? `, ${nomeCliente.split(' ')[0]}` : ''}!</strong>
                      </p>
                      <p className="font-body text-brown-darkest leading-relaxed text-center mb-4" style={{ fontSize: '16px' }}>
                        Seu pedido foi <strong className="text-green-700">recebido com sucesso</strong> e está sendo processado pela nossa equipe.
                      </p>
                      <div className="flex items-center justify-center gap-3 mb-4 p-4 bg-white rounded-lg border border-green-200">
                        <Phone size={20} className="text-gold-warm flex-shrink-0" />
                        <p className="font-body text-brown-darkest text-center" style={{ fontSize: '15px' }}>
                          <strong>A ThinkFit entrará em contato</strong> em breve pelo WhatsApp para finalizar o pagamento e confirmar todos os detalhes da sua encomenda.
                        </p>
                      </div>
                      <div className="flex items-center justify-center gap-2 text-brown-medium">
                        <Heart size={16} className="text-gold-warm fill-current" />
                        <p className="font-body text-sm italic">
                          Estamos ansiosos para tornar sua celebração ainda mais especial!
                        </p>
                        <Heart size={16} className="text-gold-warm fill-current" />
                      </div>
                    </div>

                    {/* Número do pedido */}
                    <div className="bg-beige-lightest rounded-lg p-5 border-2 border-gold-warm/30">
                      <div className="flex items-center justify-center gap-3">
                        <Calendar size={20} className="text-gold-warm" />
                        <div className="text-center">
                          <p className="font-body text-xs uppercase tracking-wider text-brown-medium mb-1">
                            Número do Pedido
                          </p>
                          <p className="font-display text-2xl text-gold-dark font-semibold tracking-wider">
                            {message.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Botão de ação */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setPedidoConfirmado(false)
                        setMessage(null)
                        router.push('/#cardapio')
                      }}
                      className="bg-gradient-to-r from-wine to-wine-dark text-white py-4 px-10 font-body font-medium uppercase hover:shadow-xl transition-all flex items-center justify-center gap-3 group"
                      style={{ fontSize: '13px', letterSpacing: '2px', borderRadius: '4px' }}
                    >
                      <Gift size={18} className="group-hover:rotate-12 transition-transform" />
                      Fazer Outro Pedido
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push('/')}
                      className="bg-white border-2 border-gold-warm text-gold-dark py-4 px-10 font-body font-medium uppercase hover:bg-gold-warm hover:text-white transition-all flex items-center justify-center gap-3"
                      style={{ fontSize: '13px', letterSpacing: '2px', borderRadius: '4px' }}
                    >
                      <ArrowLeft size={18} />
                      Voltar ao Início
                    </motion.button>
                  </motion.div>
                </div>

                {/* Borda inferior decorativa */}
                <div className="h-2 bg-gradient-to-r from-sage via-gold-warm to-sage" />
              </motion.div>
            )}
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F5F1E8] relative overflow-hidden">
      {/* Decorações Natalinas de Fundo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 right-10 w-32 h-32 border border-gold-warm/20 rounded-full opacity-30"></div>
        <div className="absolute bottom-40 left-10 w-24 h-24 border border-sage/20 rounded-full opacity-30"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 border border-gold-warm/15 rounded-full opacity-20"></div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-32 right-1/4 opacity-10"
        >
          <Star size={24} className="text-gold-warm" fill="currentColor" />
        </motion.div>
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-32 left-1/3 opacity-10"
        >
          <Sparkles size={20} className="text-sage" />
        </motion.div>
      </div>

      <Header />
      
      <div className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Título com Decoração Natalina */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-brown-medium hover:text-brown-darkest mb-6 transition-colors font-body text-sm"
            >
              <ArrowLeft size={18} />
              Voltar
            </button>
            
            {/* Ornamento decorativo */}
            <div className="flex items-center justify-center gap-4 mb-4 opacity-60">
              <div className="h-[1px] w-12 bg-gold-warm"></div>
              <Star size={20} className="text-gold-warm" fill="currentColor" />
              <div className="h-[1px] w-12 bg-gold-warm"></div>
            </div>
            
            <h1 className="font-display font-light text-[#3E2723] mb-3 text-center" style={{ fontSize: '38px' }}>
              🎄 Finalizar Pedido 🎄
            </h1>
            <p className="font-body font-light text-[#8D6E63] text-center" style={{ fontSize: '14px' }}>
              Revise seus produtos e preencha seus dados para concluir
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Coluna Esquerda - Produtos */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="bg-white p-8 relative" style={{ boxShadow: '0 4px 40px rgba(62, 39, 35, 0.08)' }}>
                {/* Decoração natalina no card */}
                <div className="absolute -top-3 -right-3 opacity-20">
                  <Star size={32} className="text-gold-warm" fill="currentColor" />
                </div>
                
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles size={16} className="text-gold-warm" />
                  <h2 className="font-body font-medium text-[#6D4C41] uppercase" style={{ fontSize: '11px', letterSpacing: '1.5px' }}>
                    Produtos Selecionados
                  </h2>
                </div>
                
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={`${item.produto_id}-${item.variacao_id || 'default'}`} className="flex items-center justify-between p-4 bg-[#FAFAF8] border border-[#E0DED9] hover:border-gold-warm/50 transition-colors relative group">
                      {/* Decoração sutil */}
                      <div className="absolute -left-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-30 transition-opacity">
                        <Star size={8} className="text-gold-warm" fill="currentColor" />
                      </div>
                      <div className="flex-1">
                        <p className="font-body text-[#3E2723] font-medium" style={{ fontSize: '14px' }}>
                          {item.nome}
                          {item.variacao_nome && (
                            <span className="text-[#8D6E63] font-normal ml-2">
                              ({item.variacao_nome})
                            </span>
                          )}
                        </p>
                        {item.variacao_descricao && (
                          <p className="font-body text-[#8D6E63] italic" style={{ fontSize: '11px', marginTop: '2px' }}>
                            {item.variacao_descricao}
                          </p>
                        )}
                        <p className="font-body text-[#8D6E63]" style={{ fontSize: '12px' }}>
                          {formatPrice(item.preco)} cada
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.produto_id, -1, item.variacao_id)}
                          className="text-[#6D4C41] hover:text-[#3E2723] transition-colors"
                        >
                          <Minus size={16} strokeWidth={1.5} />
                        </button>
                        <span className="font-body text-[#3E2723] w-8 text-center" style={{ fontSize: '14px' }}>
                          {item.quantidade}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.produto_id, 1, item.variacao_id)}
                          className="text-[#6D4C41] hover:text-[#3E2723] transition-colors"
                        >
                          <Plus size={16} strokeWidth={1.5} />
                        </button>
                        <button
                          onClick={() => removeFromCart(item.produto_id, item.variacao_id)}
                          className="text-[#A1887F] hover:text-[#8D6E63] ml-2 transition-colors"
                        >
                          <Trash2 size={16} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t-2 border-gold-warm/30 relative">
                  {/* Decoração natalina no total */}
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 opacity-20">
                    <Sparkles size={16} className="text-gold-warm" />
                  </div>
                  <span className="font-display text-[#3E2723]" style={{ fontSize: '24px', fontWeight: 400 }}>
                    Total
                  </span>
                  <span className="font-display text-gold-dark" style={{ fontSize: '36px', fontWeight: 500 }}>
                    {formatPrice(getTotal())}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Coluna Direita - Formulário */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <form onSubmit={handleSubmit} className="bg-white p-6 relative" style={{ boxShadow: '0 4px 40px rgba(62, 39, 35, 0.08)' }}>
                {/* Decoração natalina no formulário */}
                <div className="absolute -top-3 -left-3 opacity-20">
                  <Star size={32} className="text-sage" fill="currentColor" />
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={16} className="text-sage" />
                  <h2 className="font-body font-medium text-[#6D4C41] uppercase" style={{ fontSize: '11px', letterSpacing: '1.5px' }}>
                    Dados do Cliente
                  </h2>
                </div>

                <div className="space-y-4">
                  {/* Nome */}
                  <div>
                    <label 
                      className="block font-body font-medium text-[#6D4C41] uppercase mb-1.5"
                      style={{ fontSize: '11px', letterSpacing: '1.5px' }}
                    >
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="w-full bg-[#FAFAF8] text-[#3E2723] border border-[#E0DED9] px-4 py-2.5 font-body focus:border-gold-warm focus:outline-none transition-colors"
                      style={{ borderRadius: '0px', fontSize: '14px' }}
                      placeholder="Seu nome completo"
                    />
                  </div>

                  {/* Telefone */}
                  <div>
                    <label 
                      className="block font-body font-medium text-[#6D4C41] uppercase mb-1.5"
                      style={{ fontSize: '11px', letterSpacing: '1.5px' }}
                    >
                      WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.telefone}
                      onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                      className="w-full bg-[#FAFAF8] text-[#3E2723] border border-[#E0DED9] px-4 py-2.5 font-body focus:border-gold-warm focus:outline-none transition-colors"
                      style={{ borderRadius: '0px', fontSize: '14px' }}
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  {/* Endereço */}
                  <div>
                    <label 
                      className="block font-body font-medium text-[#6D4C41] uppercase mb-1.5"
                      style={{ fontSize: '11px', letterSpacing: '1.5px' }}
                    >
                      Endereço de Entrega *
                    </label>
                    <textarea
                      required
                      value={formData.endereco}
                      onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                      className="w-full bg-[#FAFAF8] text-[#3E2723] border border-[#E0DED9] px-4 py-2.5 font-body focus:border-gold-warm focus:outline-none h-24 resize-none transition-colors"
                      style={{ borderRadius: '0px', fontSize: '14px' }}
                      placeholder="Rua, número, complemento, bairro, cidade..."
                    />
                  </div>

                  {/* Data de Entrega */}
                  <div>
                    <label 
                      className="block font-body font-medium text-[#6D4C41] uppercase mb-2"
                      style={{ fontSize: '11px', letterSpacing: '1.5px' }}
                    >
                      Data de Entrega *
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex items-center justify-center gap-2 p-3 border-2 border-[#E0DED9] cursor-pointer hover:border-gold-warm transition-colors bg-[#FAFAF8] relative group">
                        <input
                          type="radio"
                          name="dataEntrega"
                          value="24/12"
                          checked={formData.dataEntrega === '24/12'}
                          onChange={(e) => setFormData({ ...formData, dataEntrega: e.target.value as '24/12' | '30/12' })}
                          className="w-4 h-4 border border-gold-warm checked:bg-gold-warm focus:ring-0"
                        />
                        <div className="flex flex-col items-center">
                          <Calendar size={18} className="text-gold-warm mb-0.5" />
                          <span className="font-body text-[#3E2723] font-medium" style={{ fontSize: '13px' }}>
                            24/12
                          </span>
                          <span className="font-body text-[#8D6E63] text-[10px]">
                            Véspera de Natal
                          </span>
                        </div>
                        {formData.dataEntrega === '24/12' && (
                          <div className="absolute -top-1.5 -right-1.5">
                            <Star size={14} className="text-gold-warm" fill="currentColor" />
                          </div>
                        )}
                      </label>
                      <label className="flex items-center justify-center gap-2 p-3 border-2 border-[#E0DED9] cursor-pointer hover:border-gold-warm transition-colors bg-[#FAFAF8] relative group">
                        <input
                          type="radio"
                          name="dataEntrega"
                          value="30/12"
                          checked={formData.dataEntrega === '30/12'}
                          onChange={(e) => setFormData({ ...formData, dataEntrega: e.target.value as '24/12' | '30/12' })}
                          className="w-4 h-4 border border-gold-warm checked:bg-gold-warm focus:ring-0"
                        />
                        <div className="flex flex-col items-center">
                          <Calendar size={18} className="text-gold-warm mb-0.5" />
                          <span className="font-body text-[#3E2723] font-medium" style={{ fontSize: '13px' }}>
                            30/12
                          </span>
                          <span className="font-body text-[#8D6E63] text-[10px]">
                            Réveillon
                          </span>
                        </div>
                        {formData.dataEntrega === '30/12' && (
                          <div className="absolute -top-1.5 -right-1.5">
                            <Star size={14} className="text-gold-warm" fill="currentColor" />
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Forma de Pagamento */}
                  <div>
                    <label 
                      className="block font-body font-medium text-[#6D4C41] uppercase mb-2"
                      style={{ fontSize: '11px', letterSpacing: '1.5px' }}
                    >
                      Forma de Pagamento *
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2.5 p-3 border-2 border-[#E0DED9] cursor-pointer hover:border-gold-warm transition-colors bg-[#FAFAF8]">
                        <input
                          type="radio"
                          name="formaPagamento"
                          value="pix"
                          checked={formData.formaPagamento === 'pix'}
                          onChange={(e) => setFormData({ ...formData, formaPagamento: e.target.value as 'pix' | 'cartao' })}
                          className="w-4 h-4 border border-gold-warm checked:bg-gold-warm focus:ring-0"
                        />
                        <span className="font-body text-[#3E2723]" style={{ fontSize: '14px' }}>
                          PIX
                        </span>
                      </label>
                      <label className="flex items-center gap-2.5 p-3 border-2 border-[#E0DED9] cursor-pointer hover:border-gold-warm transition-colors bg-[#FAFAF8]">
                        <input
                          type="radio"
                          name="formaPagamento"
                          value="cartao"
                          checked={formData.formaPagamento === 'cartao'}
                          onChange={(e) => setFormData({ ...formData, formaPagamento: e.target.value as 'pix' | 'cartao' })}
                          className="w-4 h-4 border border-gold-warm checked:bg-gold-warm focus:ring-0"
                        />
                        <span className="font-body text-[#3E2723]" style={{ fontSize: '14px' }}>
                          Link de Pagamento (Cartão)
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Instruções */}
                  <div className="p-3 bg-gradient-to-br from-gold-warm/10 to-gold-warm/5 border-2 border-gold-warm/30">
                    <div className="flex items-start gap-2.5">
                      <Sparkles size={18} className="text-gold-warm flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-body font-medium text-[#3E2723] mb-1" style={{ fontSize: '13px' }}>
                          Como funciona?
                        </h3>
                        <p className="font-body text-[#6D4C41] leading-relaxed" style={{ fontSize: '12px' }}>
                          Seu pedido será enviado para a ThinkFit. Entraremos em contato para finalizar o pagamento e garantir a sua encomenda.
                        </p>
                      </div>
                    </div>
                  </div>

                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`p-4 ${
                        message.type === 'success' 
                          ? 'bg-gradient-to-br from-green-50 to-emerald-50 text-green-900 border-2 border-green-300 shadow-lg' 
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                      style={{ borderRadius: '0px' }}
                    >
                      <div className="flex items-start gap-3">
                        {message.type === 'success' && (
                          <div className="flex-shrink-0 mt-0.5">
                            <Star size={20} className="text-gold-warm" fill="currentColor" />
                          </div>
                        )}
                        <p className="font-body leading-relaxed whitespace-pre-line" style={{ fontSize: '14px' }}>
                          {message.text}
                        </p>
                      </div>
                      {message.type === 'success' && (
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          onClick={() => router.push('/#cardapio')}
                          className="mt-4 w-full bg-gradient-to-r from-wine to-wine-dark text-white py-3 font-body font-medium uppercase hover:shadow-lg transition-all"
                          style={{ fontSize: '12px', letterSpacing: '1.5px', borderRadius: '0px' }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Fazer Outro Pedido
                        </motion.button>
                      )}
                    </motion.div>
                  )}

                  {message?.type !== 'success' && (
                    <motion.button
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                      className="group w-full bg-gradient-to-r from-wine to-wine-dark text-white py-4 font-body font-medium uppercase hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                      style={{ fontSize: '13px', letterSpacing: '2px', borderRadius: '0px', marginTop: '16px' }}
                    >
                      {/* Efeito brilho natalino */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      <span className="relative flex items-center justify-center gap-2">
                        {loading ? (
                          'PROCESSANDO...'
                        ) : (
                          <>
                            <Star size={16} className="text-white" fill="currentColor" />
                            FINALIZAR PEDIDO
                            <Star size={16} className="text-white" fill="currentColor" />
                          </>
                        )}
                      </span>
                    </motion.button>
                  )}
                </div>
              </form>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

