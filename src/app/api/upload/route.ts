import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'portfolio'

    if (!file) {
      return NextResponse.json(
        { error: 'Nenhum arquivo foi enviado' },
        { status: 400 }
      )
    }

    // Converter arquivo para base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64String = `data:${file.type};base64,${buffer.toString('base64')}`

    // Upload para Cloudinary
    const result = await uploadImage(base64String, {
      folder: `portfolio/${folder}`,
      transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    })

    return NextResponse.json({
      success: true,
      url: result.url,
      publicId: result.publicId,
      width: result.width,
      height: result.height
    })

  } catch (error) {
    console.error('Erro no upload:', error)
    return NextResponse.json(
      { error: 'Erro ao fazer upload da imagem' },
      { status: 500 }
    )
  }
}
