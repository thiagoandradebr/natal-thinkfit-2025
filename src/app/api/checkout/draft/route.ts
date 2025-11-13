import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { cookies } from 'next/headers'

// Gerar ou recuperar session_id único
async function getSessionId(): Promise<string> {
  // Tentar obter do cookie
  const cookieStore = await cookies()
  let sessionId = cookieStore.get('checkout_session_id')?.value

  // Se não existir, gerar novo
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
  }

  return sessionId
}

// GET - Recuperar rascunho
export async function GET() {
  try {
    const sessionId = await getSessionId()
    let formData = null

    try {
      const { data, error } = await supabase
        .from('checkout_drafts')
        .select('form_data, updated_at, expires_at')
        .eq('session_id', sessionId)
        .single()

      if (error) {
        // Se não encontrou (PGRST116) ou tabela não existe (42P01), não é erro crítico
        if (error.code === 'PGRST116' || error.code === '42P01') {
          // Tabela não existe ou não há rascunho - retornar null silenciosamente
        } else {
          console.warn('Erro ao buscar rascunho:', error.message)
        }
      } else if (data) {
        // Verificar se expirou
        if (data.expires_at && new Date(data.expires_at) < new Date()) {
          // Rascunho expirado, deletar
          await supabase
            .from('checkout_drafts')
            .delete()
            .eq('session_id', sessionId)
        } else {
          formData = data.form_data
        }
      }
    } catch (dbError: any) {
      // Se a tabela não existe, apenas logar e continuar
      if (dbError.code === '42P01' || dbError.message?.includes('does not exist')) {
        console.warn('Tabela checkout_drafts não existe ainda. Aplicar migração 006_create_checkout_drafts.sql')
      } else {
        console.error('Erro ao acessar banco:', dbError)
      }
    }

    // Criar resposta com cookie
    const response = NextResponse.json({ formData, sessionId })
    response.cookies.set('checkout_session_id', sessionId, {
      maxAge: 7 * 24 * 60 * 60,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    return response
  } catch (error: any) {
    console.error('Erro ao recuperar rascunho:', error)
    // Retornar resposta vazia ao invés de erro 500 para não quebrar o frontend
    const response = NextResponse.json({ formData: null, sessionId: null })
    return response
  }
}

// POST - Salvar rascunho
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { formData } = body

    if (!formData) {
      return NextResponse.json(
        { error: 'Dados do formulário não fornecidos' },
        { status: 400 }
      )
    }

    const sessionId = await getSessionId()

    try {
      // Usar upsert para criar ou atualizar
      const { data, error } = await supabase
        .from('checkout_drafts')
        .upsert({
          session_id: sessionId,
          form_data: formData,
          updated_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
        }, {
          onConflict: 'session_id'
        })
        .select()
        .single()

      if (error) {
        // Se a tabela não existe, apenas logar e continuar (fallback para localStorage)
        if (error.code === '42P01' || error.message?.includes('does not exist')) {
          console.warn('Tabela checkout_drafts não existe ainda. Aplicar migração 006_create_checkout_drafts.sql')
        } else {
          throw error
        }
      }
    } catch (dbError: any) {
      // Se a tabela não existe, apenas logar e continuar
      if (dbError.code === '42P01' || dbError.message?.includes('does not exist')) {
        console.warn('Tabela checkout_drafts não existe. Fallback para localStorage no frontend.')
      } else {
        console.error('Erro ao salvar rascunho:', dbError)
      }
    }

    // Sempre retornar sucesso para não quebrar o frontend
    // O frontend tem fallback para localStorage
    const response = NextResponse.json({ 
      success: true, 
      sessionId 
    })
    
    response.cookies.set('checkout_session_id', sessionId, {
      maxAge: 7 * 24 * 60 * 60, // 7 dias
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    })

    return response
  } catch (error: any) {
    console.error('Erro ao salvar rascunho:', error)
    // Retornar sucesso mesmo com erro para não quebrar o frontend
    const response = NextResponse.json({ success: false, sessionId: null })
    return response
  }
}

// DELETE - Limpar rascunho
export async function DELETE() {
  try {
    const sessionId = await getSessionId()

    const { error } = await supabase
      .from('checkout_drafts')
      .delete()
      .eq('session_id', sessionId)

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erro ao deletar rascunho:', error)
    return NextResponse.json(
      { error: 'Erro ao deletar rascunho' },
      { status: 500 }
    )
  }
}

