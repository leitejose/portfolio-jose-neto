import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string
const supabase = createClient(supabaseUrl, supabaseKey)

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Primeiro, buscar o post atual
    const { data: currentPost, error: fetchError } = await supabase
      .from('posts')
      .select('id, views')
      .eq('id', id)
      .eq('published', true)
      .single()

    if (fetchError || !currentPost) {
      return NextResponse.json({ error: 'Post não encontrado' }, { status: 404 })
    }

    // Incrementar visualizações
    const newViews = (currentPost.views || 0) + 1
    
    const { data, error } = await supabase
      .from('posts')
      .update({ 
        views: newViews,
        updatedAt: new Date().toISOString()
      })
      .eq('id', currentPost.id)
      .select('views')
      .single()

    if (error) {
      console.error('Erro ao incrementar visualizações:', error)
      return NextResponse.json({ error: 'Erro ao incrementar visualizações' }, { status: 500 })
    }

    return NextResponse.json({ views: data.views }, { status: 200 })
  } catch (error) {
    console.error('Erro interno:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
