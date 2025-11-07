import { NextResponse } from 'next/server'

// Função auxiliar para formatar preço
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}

// Gerar mensagem para WhatsApp
const getWhatsAppMessage = (pedido: any) => {
  const itens = pedido.itens
    .map((item: any) => `• ${item.quantidade}x ${item.nome} - ${formatPrice(item.preco * item.quantidade)}`)
    .join('\n')

  return `
🎄 *NOVO PEDIDO - NATAL THINKFIT*

*Cliente:* ${pedido.nome_cliente}
*WhatsApp:* ${pedido.telefone_whatsapp}
*E-mail:* ${pedido.email}

*ITENS DO PEDIDO:*
${itens}

*TOTAL: ${formatPrice(pedido.total)}*

${pedido.endereco_entrega ? `*Observações:* ${pedido.endereco_entrega}` : ''}

*ID do Pedido:* #${pedido.id.substring(0, 8).toUpperCase()}
*Data:* ${new Date(pedido.criado_em).toLocaleString('pt-BR')}
  `.trim()
}

export async function POST(request: Request) {
  try {
    const { telefone, pedido } = await request.json()

    const mensagem = getWhatsAppMessage(pedido)

    // Aqui você implementaria o envio real via API de WhatsApp
    // Exemplo com Twilio:
    /*
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const client = require('twilio')(accountSid, authToken)
    
    await client.messages.create({
      body: mensagem,
      from: 'whatsapp:+14155238886',
      to: `whatsapp:+${telefone}`
    })
    */

    // Exemplo com API360 ou similar:
    /*
    await fetch('https://api.360dialog.com/v1/messages', {
      method: 'POST',
      headers: {
        'D360-API-KEY': process.env.WHATSAPP_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: telefone,
        type: 'text',
        text: { body: mensagem },
      }),
    })
    */

    // Por enquanto, apenas log (para desenvolvimento)
    console.log('📱 WhatsApp enviado para:', telefone)
    console.log('Mensagem:', mensagem)

    // Alternativa: Abrir WhatsApp Web com mensagem pré-preenchida
    const whatsappUrl = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`
    console.log('URL WhatsApp:', whatsappUrl)

    return NextResponse.json({ 
      success: true,
      whatsappUrl // Pode ser usado para abrir automaticamente
    })
  } catch (error) {
    console.error('Erro ao enviar WhatsApp:', error)
    return NextResponse.json(
      { error: 'Erro ao enviar WhatsApp' },
      { status: 500 }
    )
  }
}
