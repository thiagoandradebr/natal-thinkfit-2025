'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, Mail } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function EsgotadoPage() {
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const { data } = await supabase
        .from('configuracoes_site')
        .select('*')
        .eq('chave', 'mensagem_esgotado')
        .single()

      if (data?.valor) {
        setMensagem(data.valor)
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full bg-dark-100 rounded-card p-8 md:p-12 text-center"
      >
        {/* Ícone */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-8"
        >
          <AlertCircle className="w-24 h-24 text-yellow-500 mx-auto" />
        </motion.div>

        {/* Título */}
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
          Produtos Esgotados
        </h1>

        {/* Mensagem */}
        <p className="text-xl text-gray-300 mb-8">
          {mensagem || 'Infelizmente todos os produtos do Cardápio de Natal 2025 estão esgotados. Obrigado pelo interesse!'}
        </p>

        {/* Informações Adicionais */}
        <div className="bg-dark-200 rounded-card p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">
            Fique por dentro das próximas edições!
          </h2>
          <p className="text-gray-300 mb-4">
            Entre em contato conosco para ser avisado sobre futuras coleções especiais da ThinkFit.
          </p>
          <a
            href="mailto:vendas@thinkfit.com.br?subject=Interesse em Próximas Edições"
            className="inline-flex items-center gap-2 bg-primary-gold text-dark-300 px-6 py-3 rounded-card font-semibold hover:bg-primary-gold/90 transition-colors"
          >
            <Mail size={20} />
            Entrar em Contato
          </a>
        </div>

        {/* Botão Voltar */}
        <Link
          href="/"
          className="inline-block text-gray-400 hover:text-primary-gold transition-colors"
        >
          ← Voltar para o início
        </Link>
      </motion.div>
    </div>
  )
}
