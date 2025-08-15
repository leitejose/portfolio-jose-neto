import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    // Validar status
    const validStatuses = ['UNREAD', 'READ', 'REPLIED', 'ARCHIVED']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Status inválido' },
        { status: 400 }
      )
    }

    // Atualizar o status da mensagem
    const contact = await prisma.contact.update({
      where: { id },
      data: { 
        status,
        updatedAt: new Date()
      }
    })

    return NextResponse.json({ contact })

  } catch (error) {
    console.error('Erro ao atualizar mensagem:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params
    
    await prisma.contact.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erro ao deletar mensagem:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
