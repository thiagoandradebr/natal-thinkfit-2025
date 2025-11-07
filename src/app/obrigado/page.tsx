'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Mail, Phone } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function ObrigadoPage() {
  const [mensagem, setMensagem] = useState('')
  const [emailVendas, setEmailVendas] = useState('vendas@thinkfit.com.br')

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const { data } = await supabase
        .from('configuracoes_site')
        .select('*')
        .in('chave', ['mensagem_obrigado', 'email_vendas'])

      const configMap = data?.reduce((acc: any, item: any) => {
        acc[item.chave] = item.valor
        return acc
      }, {})

      if (configMap?.mensagem_obrigado) {
        setMensagem(configMap.mensagem_obrigado)
      }
      if (configMap?.email_vendas) {
        setEmailVendas(configMap.email_vendas)
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
        {/* Ícone de Sucesso */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="mb-8"
        >
          <CheckCircle className="w-24 h-24 text-primary-emerald mx-auto" />
        </motion.div>

        {/* Título */}
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
          Pedido Recebido!
        </h1>

        {/* Mensagem de Agradecimento */}
        <p className="text-xl text-gray-300 mb-8">
          Obrigado por escolher o Cardápio de Natal ThinkFit! 🎄
        </p>

        {/* Instruções de Pagamento */}
        <div className="bg-dark-200 rounded-card p-6 mb-8 text-left">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Mail className="text-primary-gold" />
            Próximos Passos
          </h2>
          <p className="text-gray-300 mb-4">
            {mensagem || 'Assim que o pagamento for confirmado, envie um e-mail para vendas@thinkfit.com.br com o comprovante e informações de entrega.'}
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-primary-gold text-dark-300 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                1
              </div>
              <p className="text-gray-300">
                Você receberá um e-mail com as instruções de pagamento e os dados bancários.
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary-gold text-dark-300 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                2
              </div>
              <p className="text-gray-300">
                Após realizar o pagamento, envie o comprovante para{' '}
                <a href={`mailto:${emailVendas}`} className="text-primary-gold hover:underline">
                  {emailVendas}
                </a>
              </p>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary-gold text-dark-300 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 font-bold text-sm">
                3
              </div>
              <p className="text-gray-300">
                Entraremos em contato em até 24 horas para confirmar seu pedido e combinar a entrega.
              </p>
            </div>
          </div>
        </div>

        {/* Informações de Contato */}
        <div className="bg-primary-gold/10 border border-primary-gold/30 rounded-card p-6 mb-8">
          <h3 className="text-lg font-bold text-white mb-3">Dúvidas?</h3>
          <p className="text-gray-300 mb-4">
            Entre em contato conosco por e-mail ou WhatsApp
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`mailto:${emailVendas}`}
              className="flex items-center justify-center gap-2 bg-primary-gold text-dark-300 px-6 py-3 rounded-card font-semibold hover:bg-primary-gold/90 transition-colors"
            >
              <Mail size={20} />
              Enviar E-mail
            </a>
            <a
              href="https://wa.me/5511999999999"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-primary-emerald text-white px-6 py-3 rounded-card font-semibold hover:bg-primary-emerald/90 transition-colors"
            >
              <Phone size={20} />
              WhatsApp
            </a>
          </div>
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
