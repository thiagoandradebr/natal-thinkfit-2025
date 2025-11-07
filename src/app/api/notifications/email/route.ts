import { NextResponse } from 'next/server'

// Função auxiliar para formatar preço
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price)
}

// Template de e-mail para o admin
const getAdminEmailTemplate = (pedido: any) => {
  const itensHtml = pedido.itens
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.nome}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantidade}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(item.preco)}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(item.preco * item.quantidade)}</td>
    </tr>
  `
    )
    .join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Novo Pedido - ThinkFit</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #D4AF37; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
          🎄 Novo Pedido Recebido!
        </h1>
        
        <h2>Dados do Cliente</h2>
        <p><strong>Nome:</strong> ${pedido.nome_cliente}</p>
        <p><strong>WhatsApp:</strong> ${pedido.telefone_whatsapp}</p>
        <p><strong>E-mail:</strong> ${pedido.email}</p>
        
        <h2>Itens do Pedido</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f4f4f4;">
              <th style="padding: 10px; text-align: left;">Produto</th>
              <th style="padding: 10px; text-align: center;">Qtd</th>
              <th style="padding: 10px; text-align: right;">Preço Unit.</th>
              <th style="padding: 10px; text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itensHtml}
          </tbody>
          <tfoot>
            <tr style="background-color: #f9f9f9; font-weight: bold;">
              <td colspan="3" style="padding: 15px; text-align: right;">TOTAL:</td>
              <td style="padding: 15px; text-align: right; color: #D4AF37; font-size: 1.2em;">
                ${formatPrice(pedido.total)}
              </td>
            </tr>
          </tfoot>
        </table>
        
        ${pedido.endereco_entrega ? `
          <h2>Observações</h2>
          <p>${pedido.endereco_entrega}</p>
        ` : ''}
        
        <div style="margin-top: 30px; padding: 15px; background-color: #f0f0f0; border-radius: 5px;">
          <p><strong>ID do Pedido:</strong> ${pedido.id}</p>
          <p><strong>Data:</strong> ${new Date(pedido.criado_em).toLocaleString('pt-BR')}</p>
          <p><strong>Status:</strong> Aguardando Pagamento</p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Template de e-mail para o cliente
const getClientEmailTemplate = (pedido: any) => {
  const itensHtml = pedido.itens
    .map(
      (item: any) => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.nome}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantidade}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${formatPrice(item.preco * item.quantidade)}</td>
    </tr>
  `
    )
    .join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Pedido Confirmado - ThinkFit</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #D4AF37; border-bottom: 2px solid #D4AF37; padding-bottom: 10px;">
          🎄 Pedido Recebido com Sucesso!
        </h1>
        
        <p>Olá, <strong>${pedido.nome_cliente}</strong>!</p>
        
        <p>Recebemos seu pedido do Cardápio de Natal ThinkFit. Obrigado pela preferência! 🎉</p>
        
        <h2>Resumo do Pedido</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f4f4f4;">
              <th style="padding: 10px; text-align: left;">Produto</th>
              <th style="padding: 10px; text-align: center;">Qtd</th>
              <th style="padding: 10px; text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itensHtml}
          </tbody>
          <tfoot>
            <tr style="background-color: #f9f9f9; font-weight: bold;">
              <td colspan="2" style="padding: 15px; text-align: right;">TOTAL:</td>
              <td style="padding: 15px; text-align: right; color: #D4AF37; font-size: 1.2em;">
                ${formatPrice(pedido.total)}
              </td>
            </tr>
          </tfoot>
        </table>
        
        <div style="margin: 30px 0; padding: 20px; background-color: #fff3cd; border-left: 4px solid #D4AF37; border-radius: 5px;">
          <h3 style="margin-top: 0;">📋 Próximos Passos</h3>
          <ol style="margin: 10px 0; padding-left: 20px;">
            <li>Você receberá em breve as instruções de pagamento via WhatsApp ou e-mail</li>
            <li>Após realizar o pagamento, envie o comprovante para <strong>vendas@thinkfit.com.br</strong></li>
            <li>Entraremos em contato em até 24 horas para confirmar e combinar a entrega</li>
          </ol>
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background-color: #f0f0f0; border-radius: 5px; font-size: 0.9em;">
          <p><strong>Número do Pedido:</strong> #${pedido.id.substring(0, 8).toUpperCase()}</p>
          <p><strong>Data:</strong> ${new Date(pedido.criado_em).toLocaleString('pt-BR')}</p>
        </div>
        
        <div style="margin-top: 30px; text-align: center; color: #666; font-size: 0.9em;">
          <p>Dúvidas? Entre em contato:</p>
          <p>📧 vendas@thinkfit.com.br | 📱 WhatsApp: (11) 99999-9999</p>
          <p style="margin-top: 20px; color: #999;">ThinkFit - Natal 2025</p>
        </div>
      </div>
    </body>
    </html>
  `
}

export async function POST(request: Request) {
  try {
    const { to, pedido, tipo } = await request.json()

    // Determinar template baseado no tipo
    const htmlContent = tipo === 'admin' 
      ? getAdminEmailTemplate(pedido)
      : getClientEmailTemplate(pedido)

    const subject = tipo === 'admin'
      ? `🎄 Novo Pedido #${pedido.id.substring(0, 8).toUpperCase()} - ThinkFit`
      : `✅ Pedido Confirmado #${pedido.id.substring(0, 8).toUpperCase()} - ThinkFit`

    // Aqui você implementaria o envio real via SendGrid, Resend, etc.
    // Exemplo com SendGrid:
    /*
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    
    await sgMail.send({
      to,
      from: process.env.EMAIL_FROM,
      subject,
      html: htmlContent,
    })
    */

    // Por enquanto, apenas log (para desenvolvimento)
    console.log('📧 E-mail enviado para:', to)
    console.log('Assunto:', subject)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error)
    return NextResponse.json(
      { error: 'Erro ao enviar e-mail' },
      { status: 500 }
    )
  }
}
