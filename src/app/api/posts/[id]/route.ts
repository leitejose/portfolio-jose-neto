import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
const supabase = createClient(supabaseUrl, supabaseKey)

interface Params {
  id: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar post:', error)
      return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    console.log('📥 API PUT recebeu body:', body)
    
    const { title, content, excerpt, published = false, featured = false, coverImage } = body
    console.log('🖼️ API PUT extraiu coverImage:', coverImage)

    // Gerar novo slug se o título mudou
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim()

    const now = new Date().toISOString()
    
    const updateData = {
      title,
      content,
      excerpt,
      slug,
      published,
      featured,
      coverImage,
      readTime: Math.ceil(content.split(' ').length / 200),
      updatedAt: now,
      publishedAt: published ? now : null
    }

    const { data, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar post:', error)
      return NextResponse.json({ error: 'Erro ao atualizar post' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Post atualizado com sucesso', post: data }, { status: 200 })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar post:', error)
      return NextResponse.json({ error: 'Erro ao deletar post' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Post deletado com sucesso' }, { status: 200 })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
