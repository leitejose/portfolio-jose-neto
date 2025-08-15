import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function GET() {
  try {
    // Buscar todas as fotos da pasta 'photography' no Cloudinary
    const result = await cloudinary.search
      .expression('folder:photography/*')
      .sort_by('created_at', 'desc')
      .max_results(500)
      .with_field('context')
      .with_field('tags')
      .execute()

    const photos = result.resources.map((resource: any) => ({
      id: resource.public_id,
      url: resource.secure_url,
      thumbnail: cloudinary.url(resource.public_id, {
        width: 400,
        height: 300,
        crop: 'fill',
        quality: 'auto',
        format: 'auto'
      }),
      title: resource.context?.title || resource.filename || 'Sem título',
      location: resource.context?.location || resource.tags?.find((tag: string) => tag.startsWith('location:'))?.replace('location:', '') || 'Sem localização',
      description: resource.context?.description || '',
      tags: resource.tags || [],
      createdAt: resource.created_at,
      width: resource.width,
      height: resource.height
    }))

    return NextResponse.json({ photos })
  } catch (error) {
    console.error('Erro ao buscar fotos do Cloudinary:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar fotos' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { photoId, title, location, description } = await request.json()

    // Atualizar contexto da foto no Cloudinary
    await cloudinary.uploader.update_metadata(
      {
        title,
        location,
        description
      },
      photoId
    )

    // Também adicionar tag de localização
    if (location) {
      await cloudinary.uploader.add_tag(`location:${location}`, photoId)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao atualizar foto:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar foto' },
      { status: 500 }
    )
  }
}
