import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    const whereClause: any = {}
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [projects, totalCount] = await Promise.all([
      prisma.project.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { order: 'asc' },
      }),
      prisma.project.count({ where: whereClause }),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      projects,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error('Projects API Error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      content,
      imageUrl,
      demoUrl,
      repoUrl,
      featured,
      published,
      order
    } = body

    // Validação básica
    if (!title || !description) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: title, description' },
        { status: 400 }
      )
    }

    // Gerar slug a partir do título
    const slug = title.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')

    try {
      // Tentar criar no banco de dados
      const project = await prisma.project.create({
        data: {
          title,
          slug,
          description,
          content: content || description,
          imageUrl,
          demoUrl,
          repoUrl,
          featured: featured || false,
          published: published !== false,
          order: order || 0,
        },
      })

      return NextResponse.json(project, { status: 201 })
    } catch (dbError) {
      console.error('Database connection failed for project creation:', dbError)
      
      // Retornar erro 500 em vez de mock data
      return NextResponse.json(
        { error: 'Erro interno do servidor' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
