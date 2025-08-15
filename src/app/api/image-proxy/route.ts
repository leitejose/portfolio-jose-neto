import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageUrl = searchParams.get('url')
    
    if (!imageUrl) {
      return new NextResponse('URL da imagem é obrigatória', { status: 400 })
    }

    // Fazer o fetch da imagem
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    })

    if (!response.ok) {
      throw new Error(`Erro ao buscar imagem: ${response.status}`)
    }

    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/jpeg'

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400', // Cache por 24 horas
        'Access-Control-Allow-Origin': '*',
      },
    })
  } catch (error) {
    console.error('Erro no proxy de imagem:', error)
    return new NextResponse('Erro ao carregar imagem', { status: 500 })
  }
}
