import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const technologies = await prisma.technology.findMany({
      orderBy: {
        name: 'asc'
      }
    })

    return NextResponse.json({
      technologies,
      success: true
    })
  } catch (error) {
    console.error('Erro ao buscar tecnologias:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar tecnologias', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
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

    const technology = await prisma.technology.create({
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
    console.error('Erro ao criar tecnologia:', error)
    return NextResponse.json(
      { error: 'Erro ao criar tecnologia', success: false },
      { status: 500 }
    )
  }
}
