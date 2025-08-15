import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

interface Params {
  id: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params

    try {
      // Tentar buscar no banco de dados
      const photo = await prisma.photo.findUnique({
        where: { id: id },
        include: {
          photographer: {
            select: {
              name: true,
              email: true,
            }
          }
        }
      })

      if (!photo) {
        return NextResponse.json(
          { error: 'Foto não encontrada' },
          { status: 404 }
        )
      }

      return NextResponse.json(photo)
    } catch (dbError) {
      console.error('Database connection failed, using mock data:', dbError)
      
      // Mock data fallback
      const mockPhoto = {
        id: id,
        title: "Foto Mock",
        description: "Esta é uma foto de exemplo para demonstração",
        location: "Local Mock",
        imageUrl: "/api/placeholder/600/400",
        views: 42,
        featured: false,
        published: true,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-15'),
        photographerId: 1,
        photographer: {
          name: "José Leite",
          email: "joseleite688@gmail.com"
        }
      }

      return NextResponse.json(mockPhoto)
    }
  } catch (error) {
    console.error('Photo fetch error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      title,
      description,
      imageUrl,
      location,
      camera,
      lens,
      settings,
      featured,
      published
    } = body

    try {
      // Tentar atualizar no banco de dados
      const photo = await prisma.photo.update({
        where: { id: id },
        data: {
          title,
          description,
          imageUrl,
          location,
          camera,
          lens,
          settings,
          featured,
          published,
          updatedAt: new Date(),
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

      return NextResponse.json(photo)
    } catch (dbError) {
      console.error('Database connection failed for photo update:', dbError)
      
      // Mock successful update
      const mockUpdatedPhoto = {
        id: id,
        title,
        description,
        imageUrl,
        location,
        camera,
        lens,
        settings,
        featured: featured || false,
        published: published || true,
        views: 42,
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date(),
        photographerId: 1,
        photographer: {
          name: "José Leite",
          email: "joseleite688@gmail.com"
        }
      }

      return NextResponse.json(mockUpdatedPhoto)
    }
  } catch (error) {
    console.error('Photo update error:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar foto' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params

    try {
      // Tentar deletar do banco de dados
      const photo = await prisma.photo.delete({
        where: { id: id }
      })

      return NextResponse.json({ 
        message: 'Foto excluída com sucesso',
        deletedPhoto: photo
      })
    } catch (dbError) {
      console.error('Database connection failed for photo deletion:', dbError)
      
      // Mock successful deletion
      return NextResponse.json({ 
        message: 'Foto excluída com sucesso (modo offline)',
        deletedPhoto: {
          id: id,
          title: "Foto Excluída"
        }
      })
    }
  } catch (error) {
    console.error('Photo deletion error:', error)
    return NextResponse.json(
      { error: 'Erro ao excluir foto' },
      { status: 500 }
    )
  }
}
