import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Validação dos dados
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nome, email e mensagem são obrigatórios' },
        { status: 400 }
      )
    }

    // Validação básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    // Salvar mensagem no banco de dados
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        subject: subject || 'Mensagem via Portfolio',
        message,
        status: 'UNREAD'
      }
    })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Mensagem enviada com sucesso!' 
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Erro ao salvar mensagem:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // Buscar todas as mensagens ordenadas por data (mais recentes primeiro)
    const contacts = await prisma.contact.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({ contacts })

  } catch (error) {
    console.error('Erro ao buscar mensagens:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
