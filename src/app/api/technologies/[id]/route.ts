import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const technology = await prisma.technology.findUnique({
      where: {
        id: id
      }
    })

    if (!technology) {
      return NextResponse.json(
        { error: 'Tecnologia não encontrada', success: false },
        { status: 404 }
      )
    }

    return NextResponse.json({
      technology,
      success: true
    })
  } catch (error) {
    console.error('Erro ao buscar tecnologia:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar tecnologia', success: false },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { name, color, icon } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Nome é obrigatório', success: false },
        { status: 400 }
      )
    }

    // Gerar slug a partir do nome
    const slug = name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    const technology = await prisma.technology.update({
      where: {
        id: id
      },
      data: {
        name,
        slug,
        color: color || null,
        icon: icon || null
      }
    })

    return NextResponse.json({
      technology,
      success: true
    })
  } catch (error) {
    console.error('Erro ao atualizar tecnologia:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar tecnologia', success: false },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.technology.delete({
      where: {
        id: id
      }
    })

    return NextResponse.json({
      success: true
    })
  } catch (error) {
    console.error('Erro ao excluir tecnologia:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir tecnologia', success: false },
      { status: 500 }
    )
  }
}
