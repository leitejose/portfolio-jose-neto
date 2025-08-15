import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const isAdmin = searchParams.get('admin') === 'true'
    const skip = (page - 1) * limit

    // Build where clause for search
    const whereClause = {
      ...(isAdmin ? {} : { published: true }), // Admin vê todas, público só publicadas
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: 'insensitive' as const } },
              { description: { contains: search, mode: 'insensitive' as const } },
              { location: { contains: search, mode: 'insensitive' as const } },
            ],
          }
        : {})
    }

    try {
      // Get photos with pagination
      const [photos, totalCount] = await Promise.all([
        prisma.photo.findMany({
          where: whereClause,
          include: {
            photographer: {
              select: {
                name: true,
                email: true,
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip,
          take: limit,
        }),
        prisma.photo.count({ where: whereClause }),
      ])

      const totalPages = Math.ceil(totalCount / limit)

      return NextResponse.json({
        photos,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      })

    } catch (dbError) {
      console.error('Photos API Error:', dbError)
      
      // Return mock data when database is unavailable
      const mockPhotos = [
        {
          id: 1,
          title: "Pôr do sol em Coimbra",
          description: "Vista deslumbrante do pôr do sol na cidade de Coimbra",
          location: "Coimbra, Portugal",
          imageUrl: "/api/placeholder/600/400",
          views: 89,
          createdAt: new Date('2025-08-06'),
          updatedAt: new Date('2025-08-06'),
          photographerId: 1,
          photographer: {
            name: "José Leite",
            email: "joseleite688@gmail.com"
          }
        },
        {
          id: 2,
          title: "Arquitetura Moderna",
          description: "Detalhes da arquitetura moderna na cidade do Porto",
          location: "Porto, Portugal",
          imageUrl: "/api/placeholder/600/400",
          views: 127,
          createdAt: new Date('2025-08-04'),
          updatedAt: new Date('2025-08-04'),
          photographerId: 1,
          photographer: {
            name: "José Leite",
            email: "joseleite688@gmail.com"
          }
        }
      ]

      const filteredPhotos = search 
        ? mockPhotos.filter(photo => 
            photo.title.toLowerCase().includes(search.toLowerCase()) ||
            photo.description.toLowerCase().includes(search.toLowerCase()) ||
            photo.location.toLowerCase().includes(search.toLowerCase())
          )
        : mockPhotos

      const startIndex = skip
      const endIndex = startIndex + limit
      const paginatedPhotos = filteredPhotos.slice(startIndex, endIndex)
      const totalCount = filteredPhotos.length
      const totalPages = Math.ceil(totalCount / limit)

      return NextResponse.json({
        photos: paginatedPhotos,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      })
    }
  } catch (error) {
    console.error('Photos API Error:', error)
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
      imageUrl,
      location,
      camera,
      lens,
      settings,
      featured = false,
      authorId = 'admin-user-id' // TODO: Get from auth context
    } = body

    // Validate required fields
    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: 'Título e URL da imagem são obrigatórios' },
        { status: 400 }
      )
    }

    // Create photo
    const photo = await prisma.photo.create({
      data: {
        title,
        description,
        imageUrl,
        location,
        camera,
        lens,
        settings,
        featured,
        photographerId: authorId,
      },
      include: {
        photographer: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    })

    return NextResponse.json(photo, { status: 201 })
  } catch (error) {
    console.error('Photo creation error:', error)
    return NextResponse.json(
      { error: 'Erro ao criar foto' },
      { status: 500 }
    )
  }
}
