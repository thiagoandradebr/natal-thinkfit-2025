import { NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // Dados recebidos do checkout
    
    const { nome, telefone, email, itens, total, tipo_entrega, endereco_entrega, forma_pagamento, data_entrega } = body

    // Validações básicas
    if (!nome || !telefone || !itens || itens.length === 0 || !tipo_entrega || !forma_pagamento || !data_entrega) {
      // Validação falhou
      return NextResponse.json(
        { error: 'Dados incompletos. Preencha todos os campos obrigatórios, incluindo o tipo de entrega e a data.' },
        { status: 400 }
      )
    }

    // Se for entrega, endereço é obrigatório
    if (tipo_entrega === 'entrega' && !endereco_entrega) {
      return NextResponse.json(
        { error: 'Endereço de entrega é obrigatório quando o tipo de entrega é "Entrega".' },
        { status: 400 }
      )
    }

    // Validar estrutura dos itens
    if (!Array.isArray(itens)) {
      // Itens não é um array
      return NextResponse.json(
        { error: 'Formato inválido: itens deve ser um array.' },
        { status: 400 }
      )
    }

    // Validar cada item
    for (const item of itens) {
      if (!item.produto_id || !item.nome || item.preco === undefined || item.quantidade === undefined) {
        // Item inválido
        return NextResponse.json(
          { error: `Item inválido: ${JSON.stringify(item)}` },
          { status: 400 }
        )
      }
    }

    let supabase
    try {
      supabase = getServiceSupabase()
    } catch (supabaseError: any) {
      // Erro ao criar cliente Supabase
      return NextResponse.json(
        { 
          error: 'Erro de configuração do servidor. Verifique as variáveis de ambiente.',
          details: process.env.NODE_ENV === 'development' ? supabaseError.message : undefined
        },
        { status: 500 }
      )
    }

    // Preparar dados do pedido
    const pedidoData: any = {
      nome_cliente: String(nome).trim(),
      telefone_whatsapp: String(telefone).trim(),
      tipo_entrega: String(tipo_entrega).trim(),
      itens: itens.map((item: any) => ({
        produto_id: String(item.produto_id),
        variacao_id: item.variacao_id ? String(item.variacao_id) : undefined,
        variacao_nome: item.variacao_nome ? String(item.variacao_nome) : undefined,
        variacao_descricao: item.variacao_descricao ? String(item.variacao_descricao) : undefined,
        nome: String(item.nome),
        preco: Number(item.preco),
        quantidade: Number(item.quantidade),
      })),
      total: Number(total),
      endereco_entrega: endereco_entrega ? String(endereco_entrega).trim() : 'Retirada no local',
      metodo_pagamento: String(forma_pagamento),
      data_entrega: String(data_entrega),
      status_pagamento: 'pendente',
    }

    // Adicionar email apenas se fornecido e não vazio
    if (email && email.trim() !== '') {
      pedidoData.email = String(email).trim()
    }

    // Dados do pedido preparados

    // Inserir pedido no banco de dados (tabela pedidos_natal)
    const { data: pedido, error: pedidoError } = await supabase
      .from('pedidos_natal')
      .insert(pedidoData)
      .select()
      .single()

    if (pedidoError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao criar pedido:', pedidoError)
      }
      
      // Retornar mensagem mais detalhada em desenvolvimento
      const errorMessage = process.env.NODE_ENV === 'development' 
        ? `Erro ao processar pedido: ${pedidoError.message || 'Erro desconhecido'} (Code: ${pedidoError.code || 'N/A'})`
        : 'Erro ao processar pedido. Tente novamente.'
      
      return NextResponse.json(
        { error: errorMessage, details: process.env.NODE_ENV === 'development' ? pedidoError : undefined },
        { status: 500 }
      )
    }

    // Pedido criado com sucesso

    // Buscar configurações para envio de notificações
    const { data: configs } = await supabase
      .from('configuracoes_site')
      .select('*')

    const configMap = configs?.reduce((acc: any, item: any) => {
      acc[item.chave] = item.valor
      return acc
    }, {})

    // Gerar mensagem para WhatsApp
    let whatsappUrl = null
    if (configMap?.telefone_whatsapp) {
      const itensTexto = pedido.itens.map((item: any) => {
        const variacaoInfo = item.variacao_nome 
          ? ` (${item.variacao_nome}${item.variacao_descricao ? ` - ${item.variacao_descricao}` : ''})`
          : ''
        return `• ${item.nome}${variacaoInfo} - ${item.quantidade}x - ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.preco * item.quantidade)}`
      }).join('\n')
      
      const tipoEntregaTexto = pedido.tipo_entrega === 'entrega' ? 'Entrega' : 'Retirada'
      const enderecoTexto = pedido.tipo_entrega === 'entrega' 
        ? `*Endereço:* ${pedido.endereco_entrega}`
        : '*Retirada no local*'
      const dataTexto = pedido.tipo_entrega === 'entrega' ? 'Data de Entrega' : 'Data de Retirada'
      
      const mensagem = `🎄 *NOVO PEDIDO - ThinkFit Natal 2025* 🎄

*Cliente:* ${pedido.nome_cliente}
*Telefone:* ${pedido.telefone_whatsapp}
*Tipo:* ${tipoEntregaTexto}
${enderecoTexto}
*${dataTexto}:* ${pedido.data_entrega || 'Não informada'}
*Forma de Pagamento:* ${pedido.metodo_pagamento === 'pix' ? 'PIX' : 'Link Cartão'}

*Itens:*
${itensTexto}

*Total:* ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(pedido.total)}

*Data do Pedido:* ${new Date(pedido.criado_em).toLocaleString('pt-BR')}`

      whatsappUrl = `https://wa.me/${configMap.telefone_whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`
    }

    // Enviar notificações (email e WhatsApp)
    try {
      await Promise.all([
        // Enviar email para o admin
        fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/notifications/email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: configMap?.email_vendas || 'vendas@thinkfit.com.br',
            pedido,
            tipo: 'admin',
          }),
        }),
        
        // Enviar email para o cliente (se email fornecido)
        email && fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/notifications/email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email,
            pedido,
            tipo: 'cliente',
          }),
        }),
      ])
    } catch (notificationError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Erro ao enviar notificações:', notificationError)
      }
      // Não falhar o pedido se notificações falharem
    }

    const responseData = {
      success: true,
      pedido_id: pedido.id,
      whatsappUrl,
      message: 'Pedido recebido com sucesso!',
    }
    
    // Retornando resposta de sucesso
    
    return NextResponse.json(responseData, { status: 200 })
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Erro no endpoint de pedido:', error)
    }
    return NextResponse.json(
      { error: `Erro interno do servidor: ${error?.message || 'Erro desconhecido'}` },
      { status: 500 }
    )
  }
}
